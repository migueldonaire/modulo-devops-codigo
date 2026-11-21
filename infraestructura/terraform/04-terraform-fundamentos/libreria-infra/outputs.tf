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
