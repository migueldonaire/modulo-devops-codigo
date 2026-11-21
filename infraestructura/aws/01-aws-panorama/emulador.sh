#!/bin/bash
# Apunta la terminal al AWS Emulator. Úsalo con: source emulador.sh
# A dónde mandar las peticiones: al emulador
export AWS_ENDPOINT_URL=https://127.0.0.1:9297
# Credenciales, configuración y certificado que ha creado el emulador
export AWS_SHARED_CREDENTIALS_FILE=~/.aws/emulator/9297/emulator_credentials
export AWS_CONFIG_FILE=~/.aws/emulator/9297/config
export AWS_CA_BUNDLE=~/.aws/emulator/9297/ca.pem
# Ajustes que pide el emulador
export AWS_EC2_METADATA_DISABLED=true
export AWS_DISABLE_HOST_PREFIX_INJECTION=true
# El emulador trabaja en una sola región
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1
