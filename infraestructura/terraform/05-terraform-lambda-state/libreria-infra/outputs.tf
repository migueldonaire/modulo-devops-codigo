# El nombre final del bucket
output "bucket_name" {
  value = aws_s3_bucket.web.bucket
}

# El ARN de la tabla (lo decide AWS al crearla)
output "table_arn" {
  value = aws_dynamodb_table.books.arn
}

# Bucket y fichero juntos
output "index_url" {
  value = "${aws_s3_bucket.web.bucket}/${aws_s3_object.index.key}"
}

# La URL de la API (termina en /)
output "api_url" {
  value = aws_lambda_function_url.api.function_url
}

output "covers_arn" {
  value = module.covers.bucket_arn
}
