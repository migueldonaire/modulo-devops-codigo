# 10 · Logs con Loki

Todo lo de la 08 y la 09, más **Loki** (guarda los logs) y **Alloy** (los lee de Docker y se los envía a Loki). Aquí la API también corre en Docker, para que Alloy pueda leer sus logs. La API apunta una línea por petición (`api-libros/src/common/request-logger.ts`).

```bash
# Para antes "npm run start:dev" si lo tenías (los dos usan el puerto 3000)
docker compose up -d --build
```

En Grafana (http://localhost:3001): **Explore → Loki →** `{container="api-libros"}`.

Después de tocar código de la API, reconstruye su imagen: `docker compose up -d --build api`.
