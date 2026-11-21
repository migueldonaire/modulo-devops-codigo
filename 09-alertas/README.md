# 09 · Alertas y percentiles

Lo mismo que la 08, más **Mailpit** (http://localhost:8025), que recoge los correos de las alertas de Grafana.

```bash
docker compose up -d
cd api-libros && npm install && npm run start:dev
```

`solucion-alertas/alerts.yml` tiene la solución de la clase como código: el contact point, la política y las reglas `API down`, `API slow`, `Server errors` y `Too many 404`. Para cargarla, cópiala a `grafana/provisioning/alerting/` y reinicia Grafana (`docker compose restart grafana`). Si ya creaste las mismas alertas a mano, bórralas antes.
