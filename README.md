# Stable web application - Stajnia Malta

Project is part of my thesis for Bachelor of Engineering degree.

## How to run

Install before running:

- Node v18.3.0
- npm 8.11.0

To start this application accounts on Deta platform and Google Cloud Platform are required.

Before running setup PostgreSQL database on remote using Railway or local:

```sh
  sudo apt install postgresql
  createdb stable
  psql -d "stable"
```

In psql console paste content of dbSchema.sql file. Then run following command to set password for your user:

```sh
  ALTER USER $USER with PASSWORD 'password';
```

### Server

Export database connection values, e.g.:

```sh
  export PGDATABASE=stable
  export PGHOST=localhost
  export PGPASSWORD=password
  export PGPORT=5432
  export PGUSER=$USER
```

Export keys, e.g.:

```sh
  PRIVATE_KEY=private_key
  export DETA_KEY=deta_key
```

In server folder run:

```sh
  npm install
  npm start
```

### Frontend

Export GCP key and REST API address, e.g.:

```sh
  export REACT_APP_GMAP_API_KEY=gmap_key
  export REACT_APP_REST_API_URL="http://localhost:3001/api/"
```

In frontend folder run:

```sh
  npm install
  npm start
```

### Fullstack

Server should be started before running frontend application separately.

Export database connection values, e.g.:

```sh
  export PGDATABASE=stable
  export PGHOST=localhost
  export PGPASSWORD=password
  export PGPORT=5432
  export PGUSER=$USER
```

Export PRIVATE_KEY, DETA_KEY, GMAP_KEY, REST_API_URL, e.g.:

```sh
  export PRIVATE_KEY=private_key
  export DETA_KEY=deta_key
  export REACT_APP_GMAP_API_KEY=gmap_key
  export REACT_APP_REST_API_URL="http://localhost:3001/api/"
```

In project folder run:

```sh
  npm install
  npm run build
  npm start
```

Scripts will handle startup. Default address is http://localhost:3001

ESlint on server:

```sh
  npx eslint "**/*.js"
```

## Documentation

[Documentation](thesis.pdf)

## Disclaimer

Proszę nie kopiować, bo ASAP wykryje i Cię uwali
