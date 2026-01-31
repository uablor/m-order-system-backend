<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

**Merchant Order Management System** – NestJS backend with **Domain Driven Design (DDD)** and **Clean Architecture**.

- **Domains:** identity, merchant, customer, exchange-rate, order, arrival, payment, notification, customer-message, shared
- **Tech:** NestJS, TypeORM, **MySQL 8+**, class-validator, class-transformer, UUID, bcrypt, JWT, Winston-ready
- **Patterns:** CQRS-style (commands/queries), Repository, Use Cases, ORM → Domain → DTO mapping
- **2 IDs:** All ORM entities use `technical_id` (BIGINT auto-increment) and `domain_id` (UUID char 36). Domain/API use `domainId` only.

### Project structure (DDD)

```
src/
├── shared/                    # Shared Kernel: base-entity, value-object, result, exceptions, enums, pagination, utils
├── config/                    # MySQL database config
├── modules/
│   ├── identity/              # User, Role, Permission; bcrypt; DTOs + use cases
│   ├── auth/                  # JWT, Login/Register/Refresh, Guards, @Roles(), @Public()
│   ├── exchange-rate/         # Create rate, get latest; BUY/SELL; duplicate validation
│   └── order/                 # Order + OrderItem; 2 IDs; transactions; protected by JWT + Roles
└── orm-entities.ts            # (optional) Central TypeORM entity list
```

### API overview

| Module | Method | Path | Auth | Description |
|--------|--------|------|------|-------------|
| Auth | POST | `/auth/login` | Public | Login (email, password, merchantId) |
| Auth | POST | `/auth/register` | Public | Register user |
| Auth | POST | `/auth/refresh` | Public | Refresh tokens |
| Identity | POST | `/users` | JWT | Create user |
| Identity | GET | `/users/:id` | JWT | Get user by ID |
| Identity | PATCH | `/users/:id` | JWT | Update user |
| Order | POST | `/orders` | JWT + Roles | Create order + items (transaction) |
| Order | GET | `/orders` | JWT + Roles | List orders (paginated) |
| Order | GET | `/orders/:id` | JWT + Roles | Get order by ID |
| Order | POST | `/orders/:id/items` | JWT + Roles | Add item (transaction) |
| ExchangeRate | POST | `/exchange-rates` | JWT + Roles | Create rate (no duplicate date+currency) |
| ExchangeRate | GET | `/exchange-rates/latest` | JWT + Roles | Get latest rate by merchant, currency, date |

### Environment

Copy `.env.example` to `.env`. Set **MySQL** (DB_HOST, DB_USER, DB_PASS, DB_NAME) and **JWT** (JWT_SECRET; optional JWT_REFRESH_SECRET).

### Migrations and seeding (DDD-compliant)

- **Migrations** live under `src/infrastructure/database/migrations/`. Schema only; no business logic. MySQL, InnoDB, snake_case, `domain_id` (char 36), `technical_id` (BIGINT auto-increment).
- **Seeder** uses **Application-layer UseCases only** (no ORM entities, no repository impl, no raw SQL). It runs inside a single transaction and is idempotent.

**CLI commands:**

| Script | Description |
|--------|-------------|
| `pnpm run make:migration name=MyMigrationName` | Create a new migration file |
| `pnpm run make:migrate` | Run pending migrations (TypeORM + data-source.ts) |
| `pnpm run make:rollback` | Revert the last migration |
| `pnpm run make:seed` | Run DDD seed (permissions → role → assign permissions → merchant → superadmin user) |
| `pnpm run seed:run` | Build, run migrations, then seed |

**How to run:**

```bash
# Create a new migration (replace MyMigrationName with your migration name)
pnpm run make:migration --name=MyMigrationName
# or: npm run make:migration name=init

# Run pending migrations
pnpm run make:migrate
# or: npm run make:migrate

# Revert last migration
pnpm run make:rollback
# or: npm run make:rollback

# Seed (permissions → ADMIN role → assign permissions → Main Merchant → superadmin user)
pnpm run make:seed
# or: npm run make:seed
```

**Typical flow (first time):**

```bash
cp .env.example .env
# Edit .env with your MySQL and JWT values
pnpm install
pnpm run make:migrate
pnpm run make:seed
```

**After seed, you can log in:**

- Email: `superadmin@gmail.com`
- Password: `superadmin`
- Role: ADMIN with permissions (FULL_ACCESS, MANAGE_USERS, MANAGE_CUSTOMERS, MANAGE_ORDERS, MANAGE_PAYMENTS, MANAGE_ARRIVALS, MANAGE_NOTIFICATIONS, MANAGE_EXCHANGE_RATE)
- Merchant: Main Merchant (owner: Super Admin)

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
