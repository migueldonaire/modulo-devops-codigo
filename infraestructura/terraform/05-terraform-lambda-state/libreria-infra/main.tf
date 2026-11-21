# Un bucket de S3 (tu nombre al final, para no repetir entre compañeros)
resource "aws_s3_bucket" "web" {
  # ${...} mete el valor de la variable dentro del texto
  bucket = "web-libreria-${var.student_name}"
}

# Un fichero dentro del bucket
resource "aws_s3_object" "index" {
  # ¿En qué bucket? En el de arriba: TIPO.NOMBRE.atributo
  bucket = aws_s3_bucket.web.id
  # Nombre del fichero dentro del bucket
  key = "index.html"
  # Contenido del fichero, escrito aquí mismo
  content = "<h1>Hola desde Terraform</h1>"
  # Para que el navegador sepa que es HTML
  content_type = "text/html"
}

# La tabla de libros
resource "aws_dynamodb_table" "books" {
  # Nombre de la tabla en AWS
  name = var.table_name
  # Bajo demanda: pagas por petición, sin reservar capacidad
  billing_mode = "PAY_PER_REQUEST"
  # La clave de partición (la "clave primaria")
  hash_key = "id"

  # De qué tipo es la clave: S = texto (String)
  attribute {
    name = "id"
    type = "S"
  }
}

# Un libro que se crea junto con la tabla
resource "aws_dynamodb_table_item" "first_book" {
  table_name = aws_dynamodb_table.books.name
  hash_key   = aws_dynamodb_table.books.hash_key

  # El libro, con el tipo de cada campo: S = texto, N = número
  item = jsonencode({
    id     = { S = "1" }
    title  = { S = "Cien años de soledad" }
    author = { S = "Gabriel García Márquez" }
    price  = { N = "19.9" }
  })
}
