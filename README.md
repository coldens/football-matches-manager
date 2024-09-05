# Football Matches Manager

## Overview

The **Football Matches Manager** is a RESTful API built with NestJS that allows users to manage a collection of football matches. This project was developed as part of a technical interview and showcases fundamental API functionalities.

## Features

The API provides the following functionalities:

- **Create a Football Match**: Users can create new match entries by providing details such as home team, away team, date, and time.
- **Retrieve All Matches**: Users can fetch a list of all scheduled or completed matches.
- **Get Match by ID**: Users can retrieve details of a specific match using its unique identifier.

## API Documentation

For detailed API documentation, including endpoints, request/response formats, and examples, please visit the following link:

- [API Documentation](https://documenter.getpostman.com/view/2575985/2sAXjQ19e1)

## Project Setup

To get started with the project, follow these steps:

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env` and modify it as needed to set up your environment variables.

3. **Database Setup**:
   Run the following commands to set up the database:

   ```bash
   # Migrate the database
   npx prisma migrate dev

   # Populate the database with initial data
   npx prisma db seed
   ```

## Running the Project

You can run the project in different modes:

- **Development Mode**:

  ```bash
  pnpm run start:dev
  ```

- **Production Mode**:

  ```bash
  pnpm run start:prod
  ```

- **Default Start**:
  ```bash
  pnpm run start
  ```

## Running Tests

To execute unit tests, use the following command:

```bash
pnpm run test
```

## Resources

Here are some useful resources for working with NestJS:

- [NestJS Documentation](https://docs.nestjs.com): Comprehensive guide and reference for the NestJS framework.
- [Prisma Documentation](https://www.prisma.io/docs): Learn more about how to use Prisma for database management.

## Contributing

If you would like to contribute to this project, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
