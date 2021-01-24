# Cafechan Imageboard Engine

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A imageboard engine, just that.

Uses Node and Express for the API, Pug for rendering pages and Vue for the panel.

This proyect still unstable for now, there are some bugs and shitcode that needs to be fixed.

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

## TO DOs

I have already done a lot of changes that i not going to list here. These are the pending changes for version v0.1.0:

- [x] Add quick reply
- ~~[ ] Add Assets to a compressed file (or find some way that fonts and images don't get corrupted when downloaded/uploaded it)~~
  * solved deleting .gitattributes, git was forcing CRLF which corrupts images and fonts when you push it to github
- [x] Add more unit tests and integration tests in client app
- [x] Migrate boardpages to Vue
- ~~[ ] Add flags and limit posting by geolocalization in regional boards~~
  * will be added in a posterior version
- [ ] Add responsivity in frontpage and boardpage.
* Basic html pages with SSR will be added in posterior version for those anons that doesn't like javascript.
