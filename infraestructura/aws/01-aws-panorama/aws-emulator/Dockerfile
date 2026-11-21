# Imagen base: Amazon Linux, el Linux de AWS
FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal
# Descarga el paquete del emulador
# (en un Mac con chip M1/M2/M3... cambia x86_64 por aarch64)
ADD https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest/aws-emulator-x86_64.rpm /tmp/aws-emulator.rpm
# Lo instala, borra el paquete y crea la carpeta del usuario
RUN rpm -i /tmp/aws-emulator.rpm && rm /tmp/aws-emulator.rpm \
    && mkdir -p /home/emulator && chown 1000 /home/emulator
# No se ejecuta como root
USER 1000
ENV HOME=/home/emulator
# El emulador escucha en el puerto 9297
EXPOSE 9297
# Al arrancar el contenedor, arranca el emulador
ENTRYPOINT ["aws-emulator", "-b", "0.0.0.0"]
