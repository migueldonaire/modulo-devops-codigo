# Web Minimalista · 01-ci-github-actions

Web estática (HTML, CSS y JavaScript) servida con Nginx. Estado al terminar la clase `01-ci-github-actions` de DevOps.

```bash
npm install          # si hay package-lock.json
npm run lint         # HTMLHint
npm test             # tests con node --test
docker compose up --build   # la web en http://localhost:8080
```
