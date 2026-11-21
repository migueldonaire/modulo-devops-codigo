# 08 · Monitorización con Prometheus y Grafana

```bash
docker compose up -d                       # Prometheus y Grafana
cd api-libros && npm install && npm run start:dev
```

| Qué | Dónde |
|---|---|
| Métricas de la API | http://localhost:3000/metrics |
| Prometheus | http://localhost:9090 (Status → Target health: `api-libros` en UP) |
| Grafana | http://localhost:3001 (`admin` / `admin`) → Dashboards → API de libros |

- `api-libros/src/metrics/metrics.ts`: las métricas (prom-client) y `GET /metrics`. Abierto en tu ordenador; en producción da 404 salvo que exista `METRICS_TOKEN`, y entonces pide `Authorization: Bearer <token>` (para Grafana Cloud).
- `prometheus.yml`: qué lee Prometheus y cada cuánto.
- `grafana/`: la fuente de datos y el dashboard, cargados al arrancar.
