# Bloque de configuración de Terraform: qué providers necesita este proyecto
terraform {
  required_providers {
    aws = {
      # De dónde se descarga: el provider oficial de AWS
      source = "hashicorp/aws"
      # Versión 6.algo (no salta solo a la 7, que podría romper cosas)
      version = "~> 6.0"
    }
  }
}

# Configuración del provider de AWS
provider "aws" {
  # El emulador trabaja en una sola región
  region = "us-east-1"
  # Si algo falla, reintenta solo 2 veces (si no, se queda un buen rato esperando)
  max_retries = 2

  # Credenciales y certificado que crea el emulador al arrancar
  # (pathexpand cambia ~ por tu carpeta de usuario, en Windows también)
  shared_credentials_files = [pathexpand("~/.aws/emulator/9297/emulator_credentials")]
  custom_ca_bundle         = pathexpand("~/.aws/emulator/9297/ca.pem")

  # Ajustes para el emulador: la URL lleva el bucket en la ruta
  # y no se le pregunta a AWS por la cuenta
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_requesting_account_id  = true

  # A dónde mandar las peticiones de cada servicio: al emulador
  endpoints {
    s3       = "https://127.0.0.1:9297"
    dynamodb = "https://127.0.0.1:9297"
    lambda   = "https://127.0.0.1:9297"
    iam      = "https://127.0.0.1:9297"
    sts      = "https://127.0.0.1:9297"
  }
}
