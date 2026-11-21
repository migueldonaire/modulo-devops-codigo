# Comprime lambda/index.mjs en build/lambda.zip
# "data" = no crea nada en AWS: solo calcula o lee algo
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.mjs"
  output_path = "${path.module}/build/lambda.zip"
}

# El rol que usará la Lambda
resource "aws_iam_role" "lambda" {
  name = "books-api-role"

  # "Este rol lo puede usar el servicio Lambda"
  # jsonencode convierte este objeto en el JSON que espera AWS
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# Permiso para escribir logs en CloudWatch (una política que ya trae AWS)
resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Permiso para usar la tabla books: solo las 4 operaciones de la API
resource "aws_iam_role_policy" "dynamodb" {
  name = "books-table-access"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["dynamodb:Scan", "dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"]
      # El ARN de la tabla sale de Terraform: ya no hay que copiar el número de cuenta
      Resource = aws_dynamodb_table.books.arn
    }]
  })
}

# La Lambda de la API de libros
resource "aws_lambda_function" "api" {
  function_name = "books-api"
  # El rol de arriba
  role    = aws_iam_role.lambda.arn
  runtime = "nodejs22.x"
  # Fichero index.mjs, función handler
  handler = "index.handler"

  # El zip que ha hecho archive_file
  filename = data.archive_file.lambda_zip.output_path
  # Huella del zip: si cambias el código, Terraform lo vuelve a subir
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  # Variables de entorno de la Lambda: aquí va el nombre de la tabla
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.books.name
    }
  }
}

# URL pública para llamar a la Lambda (sin login)
resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"
}

# Permiso 1: cualquiera puede llamar a la URL...
resource "aws_lambda_permission" "url" {
  statement_id           = "public-url"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.api.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

# Permiso 2: ...y la URL puede ejecutar la función (AWS pide los dos desde 2025)
resource "aws_lambda_permission" "invoke" {
  statement_id             = "public-invoke"
  action                   = "lambda:InvokeFunction"
  function_name            = aws_lambda_function.api.function_name
  principal                = "*"
  invoked_via_function_url = true
}
