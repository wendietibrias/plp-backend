<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

This project is a NestJS application designed to provide a robust backend solution with the following features:

### Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (RBAC)
  - Permission-based authorization system
  - User management with secure password handling

- **Modular Architecture**
  - Organized module structure for scalability
  - Feature modules with clear separation of concerns
  - Global modules for shared functionality

- **Database Integration**
  - TypeORM integration with PostgreSQL/MySQL support
  - Entity relationships and migrations
  - Database seeding system for initial data

- **Security & Validation**
  - Input validation with class-validator
  - Custom decorators for validation and transformation
  - Protected controller endpoints
  - Exception filtering and logging

- **Developer Experience**
  - Custom decorators for common operations
  - Base classes for entities and query parameters
  - Pagination utilities
  - Comprehensive logging and error handling
  - Code organization following NestJS best practices

## Project Setup

To set up the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nest-base
   ```

2. Install the dependencies:

   ```bash
   yarn install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add necessary configuration (database, JWT secrets, etc.)

4. Seed the database (optional):
   ```bash
   yarn run seed
   ```

## Compile and Run the Project

You can run the project in different modes:

- **Development Mode**:

  ```bash
  yarn run start
  ```

- **Watch Mode** (auto-restarts on file changes):

  ```bash
  yarn run start:dev
  ```

- **Production Mode**:
  ```bash
  yarn run start:prod
  ```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
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
