#!/bin/bash
# Este script lo ejecuta la instancia sola, como root, al arrancar por primera vez.
# Lo que escribe se guarda en /var/log/cloud-init-output.log

# Algunos programas necesitan saber cuál es la carpeta del usuario
export HOME=/root

# 1. Instalar git y Node.js 24
dnf install -y git
curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -
dnf install -y nodejs

# 2. Descargar la API e instalar sus dependencias
git clone --depth 1 https://github.com/migueldonaire/modulo-backend-codigo.git /opt/app
cd /opt/app/02-express-memoria
npm ci

# 3. Crear un "servicio" de Linux: arranca la API con la máquina
#    y la vuelve a arrancar si se cae
cat > /etc/systemd/system/api.service <<'EOF'
[Unit]
Description=Products API
After=network.target

[Service]
WorkingDirectory=/opt/app/02-express-memoria
ExecStart=/usr/bin/npx tsx src/index.ts
Restart=always
Environment=HOME=/root

[Install]
WantedBy=multi-user.target
EOF

# 4. Activar el servicio y arrancarlo ya
systemctl enable --now api
