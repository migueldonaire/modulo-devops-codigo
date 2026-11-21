# Infraestructura: AWS y Terraform

El código de los apuntes de AWS (01 a 03) y Terraform (04 y 05). Todo se practica contra el **AWS Emulator** oficial, en tu ordenador: no hace falta cuenta de AWS ni tarjeta.

```text
infraestructura/
├── aws/
│   ├── 01-aws-panorama/        ← Dockerfile del emulador, emulador.sh / emulador.ps1, policy.json
│   ├── 02-lambda-dynamodb/     ← lambda-hello, books-api (+ solución) y los JSON de la clase
│   └── 03-ec2-load-balancer/   ← user-data.sh y user-data-api.sh
└── terraform/
    ├── 04-terraform-fundamentos/libreria-infra   ← bucket, index.html y tabla books
    └── 05-terraform-lambda-state/libreria-infra  ← lo anterior + la API en Lambda y un módulo
```

## Arrancar el emulador

```bash
cd aws/01-aws-panorama/aws-emulator
docker build -t aws-emulator .     # solo la primera vez
# El comando docker run para tu sistema está en el apunte 01, apartado 8.3
```

En **otra** terminal, apunta la AWS CLI al emulador (en cada terminal nueva):

```bash
source aws/01-aws-panorama/emulador.sh      # macOS / Linux
. .\aws\01-aws-panorama\emulador.ps1         # Windows (PowerShell)
aws sts get-caller-identity                  # tiene que salir la cuenta 000000000000
```

## Terraform

```bash
cd terraform/05-terraform-lambda-state/libreria-infra
# Cambia "tunombre" en terraform.tfvars
terraform init
terraform plan
terraform apply
terraform output api_url
terraform destroy    # al terminar
```

Terraform no necesita `emulador.sh`: lo lee todo de `provider.tf`. No subas nunca `.terraform/` ni los `*.tfstate` (ya están en `.gitignore`).
