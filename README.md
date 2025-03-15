<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Library API

Modern API for library management, built with NestJS.

## Project Description

Library API is a comprehensive backend solution for library systems. It enables management of books, users, and loans. The system offers full CRUD operation support for all entities, user authentication and authorization, and advanced library management features.

## Main Features

- 📚 **Library Structure Management**: cataloging books, categories, and authors
- 👥 **User Management**: registration, login, roles (client, employee, administrator)
- 📝 **Loan Management**: reserving, borrowing, and returning books
- 🔐 **Security**: JWT, roles, and permissions
- 📧 **Notifications**: automatic email notifications for users

## Project Structure

The project is organized in a modular structure:

- `auth` - authentication and authorization
- `config` - application configuration
- `database` - database configuration
- `mailer` - email handling
- `rent` - loan management
- `structure` - library structure management (books, etc.)
- `users` - user management

## Technologies

- [NestJS](https://nestjs.com/) - framework
- [TypeORM](https://typeorm.io/) - database ORM
- [PostgreSQL](https://www.postgresql.org/) - database
- [JWT](https://jwt.io/) - authentication tokens
- [Swagger](https://swagger.io/) - API documentation

## Requirements

- Node.js (v18+)
- pnpm
- PostgreSQL

## Installation

```bash
# Clone repository
$ git clone [REPOSITORY_URL]
$ cd library-api

# Install dependencies
$ pnpm install

# Environment configuration
$ cp .env.example .env
# Edit the .env file to customize the configuration
```

## Running the Application

```bash
# Development mode
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod
```

## API Documentation

After starting the application, Swagger documentation is available at:

```
http://localhost:3000/api
```

## Tests

```bash
# Unit tests
$ pnpm run test

# End-to-end tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## Code Standards

The project uses ESLint and Prettier to maintain high code quality:

```bash
# Code linting
$ pnpm run lint

# Code formatting
$ pnpm run format
```

## License

This project is covered by the [MIT license](LICENSE).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
