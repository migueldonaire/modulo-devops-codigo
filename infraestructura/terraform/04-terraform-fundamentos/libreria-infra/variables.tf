# Tu nombre, para que los buckets no se repitan entre compañeros
variable "student_name" {
  # Texto de ayuda: sale si Terraform te la pide
  description = "Tu nombre en minúsculas, sin espacios ni tildes"
  # Tipo de dato: texto
  type = string
}

# Nombre de la tabla de DynamoDB
variable "table_name" {
  description = "Nombre de la tabla de DynamoDB"
  type        = string
  # Si nadie le da valor, vale "books"
  default = "books"
}
