# card-deck-api

Simple server for card decks management.
Now it supports only french deck without jokers.

## Run the application

1. Create .env file and fill it by .env.template
2. Launch postgres db in docker

```sh
docker-compose -f docker-compose.yml up -d
```

3. Install dependencies

```sh
npm install
```

4. Run migration

```sh
npm run migrate
```

5. Launch server

```sh
npm start
```

or from vscode launcher if you want to debug

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Run Tests

1. Create .test.env file and fill it by .env.template
2. Launch postgres test db in docker

```sh
docker-compose -f docker-compose.test.yml up -d
```

3. Install dependencies if you aren't install them before

```sh
npm install
```

4. Run migration

```sh
NODE_ENV=test npm run migrate
```

5. Run tests

```sh
NODE_ENV=test npm test
```

you also can run tests from vscode for debug

## You can find API spec on

localhost:3000/
