# Apunta la terminal al AWS Emulator. Úsalo con: . .\emulador.ps1
# A dónde mandar las peticiones: al emulador
$env:AWS_ENDPOINT_URL = "https://127.0.0.1:9297"
# Credenciales, configuración y certificado que ha creado el emulador
$env:AWS_SHARED_CREDENTIALS_FILE = "$env:USERPROFILE\.aws\emulator\9297\emulator_credentials"
$env:AWS_CONFIG_FILE = "$env:USERPROFILE\.aws\emulator\9297\config"
$env:AWS_CA_BUNDLE = "$env:USERPROFILE\.aws\emulator\9297\ca.pem"
# Ajustes que pide el emulador
$env:AWS_EC2_METADATA_DISABLED = "true"
$env:AWS_DISABLE_HOST_PREFIX_INJECTION = "true"
# El emulador trabaja en una sola región
$env:AWS_REGION = "us-east-1"
$env:AWS_DEFAULT_REGION = "us-east-1"
