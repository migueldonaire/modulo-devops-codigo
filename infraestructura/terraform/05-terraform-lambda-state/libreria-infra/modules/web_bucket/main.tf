# Lo que recibe el módulo (como los parámetros de una función)
variable "name" {
  type = string
}

# Lo que crea el módulo
resource "aws_s3_bucket" "this" {
  bucket = var.name
}

# Lo que devuelve el módulo (como el return)
output "bucket_name" {
  value = aws_s3_bucket.this.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.this.arn
}
