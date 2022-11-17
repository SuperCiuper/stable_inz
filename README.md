# Stable web application - Stajnia Malta

Projekt realizowany w ramach pracy inżynierskiej

## How to run

Install before running:

- Node v18.3.0
- npm 8.11.0

### Fullstack

Prepare database connection, e.g.:

```sh
  export PGDATABASE=db
  export PGHOST=localhost
  export PGPASSWORD=password
  export PGPORT=3005
  export PGUSER=postgres
```

Deploy:

```sh
  REACT_APP_REST_API_URL="http://localhost:3001"
  npm install
  npm run build
  npm start
```

Default address is http://localhost:3001

ESlint on server:

```sh
  npx eslint "**/*.js"
```

## Dokumentacja

Dodać załącznik jak napiszę

## Disclaimer

Proszę nie kopiować, bo ASAP wykryje i Cię uwali
