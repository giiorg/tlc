# Simple Auth

## Installation & Running

This API uses several extra services for persistent layer, caching and search indexing.

You can set up development environment with docker-compose.yml file that ships with this repository.

Please, use commands below:

```bash
# Start all required services (postgres, redis, elasticsearch)
$ docker-compose up -d

# Copy .env.example to .env and fill the configuration
$ cp .env.example .env

# Install all the dependencies
$ yarn install

# Start API in development mode
$ yarn dev
```
