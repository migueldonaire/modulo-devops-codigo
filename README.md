# Código de los apuntes de DevOps

El código de cada clase de DevOps, tal como queda **al terminarla**. Cada carpeta es independiente: tiene su propio `package.json`, sus pipelines y su `README.md`.

## Los proyectos

| Proyecto | Qué es | Clases |
|---|---|---|
| 🌐 `web-minimalista` | Web estática (HTML, CSS y JavaScript) servida con Nginx en Docker | 01 a 04, 06 y 07 |
| 📚 `api-libros` | API de libros con **NestJS 11**, datos en memoria, tests unitarios y e2e (Jest + supertest) | 05 a 10 |

La API es la de libros de los apuntes de NestJS (la de `03a-nestjs-memoria` de [modulo-backend-codigo](https://github.com/migueldonaire/modulo-backend-codigo)), con lo que necesita DevOps: `GET /api/health` con la versión, tests e2e, CORS por variable de entorno y un `Dockerfile` en tres etapas. No usa base de datos, así se despliega en Render sin nada más.

## Las clases

| Carpeta | Apuntes | Qué se añade |
|---|---|---|
| `01-ci-github-actions` | `01_ci_github_actions.md` | `package.json` con `lint` (HTMLHint) y `test` (`node --test`), tests, `.htmlhintrc` y la pipeline de PR (`ci.yml`) |
| `02-calidad-sonarqube` | `02_calidad_sonarqube_cloud.md` y `02b_docker_root_sonar.md` | ESLint, cobertura, `sonar-project.properties`, Sonar en la pipeline y el `Dockerfile` revisado |
| `03-versiones-artefactos` | `03_versiones_y_artefactos.md` | La versión en la imagen (`version.txt`), `release.yml` (tag, release e imagen en Docker Hub) y el aviso de versión en la PR |
| `04-entornos-produccion` | `04_entornos_produccion_rollback.md` | `deploy.yml` (Render, smoke test y rollback) y los despliegues a test y producción en `release.yml` |
| `05-pipeline-api` | `05_pipeline_api.md` | La API de libros con tests e2e, typecheck, `Dockerfile` en tres etapas y sus tres pipelines |
| `06-devsecops` | `06_devsecops.md` | Dependabot, `npm audit`, Gitleaks, Trivy, OWASP ZAP y permisos mínimos (en los dos proyectos) |
| `07-gitops-kubernetes` | `07_gitops_kubernetes.md` | `k8s/` con los manifiestos y la `Application` de Argo CD |
| `08-monitorizacion` | `08_monitorizacion_prometheus_grafana.md` | `GET /metrics` (prom-client), Prometheus y Grafana con el dashboard ya cargado |
| `09-alertas` | `09_alertas_y_percentiles.md` | Mailpit para los correos de las alertas y la solución de las alertas como código |
| `10-logs-loki` | `10_logs_loki.md` | Log de cada petición, la API en Docker, Loki y Alloy |

## Requisitos

- Node.js 24 LTS.
- Docker Desktop (con Docker Compose).
- Para las pipelines: una cuenta de GitHub, y según la clase SonarQube Cloud, Docker Hub y Render (cada apunte dice qué hace falta).

## Puesta en marcha

Entra en la carpeta del proyecto y:

```bash
npm install
npm run lint
npm test
```

La API, además, se arranca con `npm run start:dev` (http://localhost:3000/api/books).

Para la monitorización (08 a 10) mira el `README.md` de cada carpeta: se arranca con `docker compose up -d`.

## Las pipelines de cada carpeta

Cada proyecto lleva su `.github/workflows/` tal como queda en esa clase. **GitHub solo ejecuta los workflows de la raíz del repositorio**, así que esos ficheros funcionan cuando copias la carpeta como repositorio propio (que es lo que se hace en clase). Dentro de este repositorio, el `.github/workflows/ci.yml` de la raíz comprueba el lint y los tests de todas las carpetas.

Antes de usar las pipelines en tu repositorio, cambia `TU_ORGANIZACION` y `TU_PROJECT_KEY` en `sonar-project.properties` y crea los secretos y variables que dice cada apunte (`SONAR_TOKEN`, `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK`, `APP_URL`, `TEST_URL`).
