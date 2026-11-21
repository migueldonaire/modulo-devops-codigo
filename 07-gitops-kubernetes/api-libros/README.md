# API de libros (NestJS) · 07-gitops-kubernetes

API de libros con NestJS 11 y los datos en memoria. Estado al terminar la clase `07-gitops-kubernetes` de DevOps.

```bash
npm install
npm run start:dev        # http://localhost:3000/api/books
npm run lint             # ESLint
npm run typecheck        # comprobar tipos
npm test                 # tests unitarios (src/**/*.spec.ts) y e2e (test/*.e2e-spec.ts)
npm run test:cov         # con cobertura (coverage/lcov.info, para Sonar)
npm run build && npm run start:prod
```

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/health` | `{ "status": "ok", "version": "..." }` |
| GET | `/api/books?author=...` | Lista (filtro opcional por autor) |
| GET | `/api/books/:id` | Un libro, o 404 |
| POST | `/api/books` | 201 con el libro creado, o 400 |
| PATCH | `/api/books/:id` | Modifica los campos enviados |
| DELETE | `/api/books/:id` | Borra y devuelve el libro |

| Variable | Para qué | Por defecto |
|---|---|---|
| `PORT` | Puerto | `3000` |
| `CORS_ORIGIN` | Web que puede llamar a la API | `http://localhost:5173` |
| `APP_VERSION` | Versión que enseña `/api/health` (la pone el `Dockerfile`) | `dev` |
