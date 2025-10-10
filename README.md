# Clearless Hapi

This is a RESTful API for a forum application, built with Node.js, Hapi, and PostgreSQL. It provides functionalities for user management, threads, comments, replies, and likes.

## Features

- **User Management:**
  - User registration
  - User login and logout
  - JWT-based authentication
  - User profile management (get and update)
  - Email verification
- **Threads:**
  - Create, delete, and view threads
  - Get details of a specific thread
- **Comments:**
  - Add and delete comments on threads
- **Replies:**
  - Add and delete replies to comments
- **Likes:**
  - Like and unlike comments

## Tech Stack

- **Framework:** Hapi.js
- **Database:** PostgreSQL (Neon)
- **Caching:** Redis (Upstash)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **Asynchronous Task Processing:** QStash
- **Object Storage:** Vercel Blob

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- yarn
- PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Febriand1/Clearless-Hapi.git
    cd Clearless-Hapi
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

3.  Set up environment variables:

    Create a `.env` file in the root directory and add the following variables. You can use the `.env.example` file as a template.

    ```
    # Server Configuration
    HOST=localhost
    PORT=5000

    # Neon Database
    DATABASE_URL=<your-neon-database-url>

    # JWT
    ACCESS_TOKEN_KEY=<your-access-token-key>
    REFRESH_TOKEN_KEY=<your-refresh-token-key>
    ACCESS_TOKEN_AGE=3600

    # Vercel Blob Storage
    BLOB_READ_WRITE_TOKEN=<your-vercel-blob-token>

    # Upstash Redis
    UPSTASH_REDIS_REST_URL=<your-upstash-redis-url>
    UPSTASH_REDIS_REST_TOKEN=<your-upstash-redis-token>
    CACHE_MEMORY_TTL_SECONDS=3600

    # Email Configuration
    EMAIL_FROM=<your-email-address>
    EMAIL_VERIFICATION_SUBJECT="Verify your email"
    EMAIL_VERIFICATION_TTL_MINUTES=10

    # QStash
    QSTASH_TOKEN=<your-qstash-token>
    QSTASH_URL=<your-qstash-url>
    QSTASH_EMAIL_TARGET_URL=<your-qstash-email-target-url>
    QSTASH_EMAIL_TOPIC=<your-qstash-email-topic>
    QSTASH_EMAIL_HEADERS='''{"Content-Type": "application/json"}'''
    ```

4.  Run database migrations:

    ```bash
    yarn run migrate up
    ```

### Running the Application

To start the server, run the following command:

```bash
yarn run start
```

For development with auto-reloading, use:

```bash
yarn run start:dev
```

The server will be running at `http://localhost:5000`.

## Project Structure

The project follows a Domain-Driven Design (DDD) approach, with a clear separation of concerns:

- `src/Domains`: Contains the core business logic and entities.
- `src/Applications`: Contains the application logic and use cases.
- `src/Infrastructures`: Contains the implementation details, such as database repositories, security, and external services.
- `src/Interfaces`: Contains the API definitions and handlers.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
