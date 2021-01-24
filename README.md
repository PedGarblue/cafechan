# Cafechan Imageboard Engine

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A imageboard engine with modern things, just that.

Uses Node and Express for the API, Pug for rendering pages and Vue for the panel.

This proyect stills unstable for production, there are some bugs and ~~shit~~code to be fixed.

### Installation

Clone the repo:

```bash
git clone https://github.com/PedGarblue/cafechan.git
cd cafechan
```

Install dependencies:

```bash
yarn install
```

Environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

### Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Building client app:

```bash
# development
yarn build:dev

# production
yarn build:prod
```

Testing:

```bash
# run all tests
yarn test

# run server tests

yarn test server

# run client tests

yarn test client

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```
