# Bucket para las portadas de los libros
module "covers" {
  source = "./modules/web_bucket"
  name   = "covers-${var.student_name}"
}

# Bucket para copias de seguridad
module "backups" {
  source = "./modules/web_bucket"
  name   = "backups-${var.student_name}"
}
