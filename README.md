# Inventory Management System Shopping Online - Backend

## Project Overview

This is a backend system for an online inventory management application. It provides a comprehensive REST API for managing products, categories, inventory stock levels, movements, audits, and user authentication.

The system is built with Node.js, Express, TypeScript, and PostgreSQL, following a modular architecture pattern with clear separation of concerns.

## System Features

- User Authentication: Registration, login, and JWT-based session management with access and refresh tokens
- Category Management: Create, read, update, and delete product categories
- Product Management: Manage products with SKU codes, prices, and category associations
- Inventory Management: Track product stock levels and manage inventory
- Movement Tracking: Record all inventory movements (entries, exits, adjustments)
- Audit System: Track all user actions and changes made in the system
- Authorization: Role-based access control for different user types
- API Documentation: Swagger/OpenAPI documentation of all endpoints

## Project Structure

```
src/
├── app.ts                 # Express application setup
├── server.ts              # Server entry point
├── config/
│   └── swagger.ts         # Swagger configuration for API documentation
├── modules/
│   ├── auth/              # Authentication module
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # Route definitions
│   │   ├── dtos/          # Data transfer objects
│   │   ├── interfaces/    # TypeScript interfaces
│   │   └── middlewares/   # Auth and authorization middlewares
│   ├── categories/        # Category management module
│   ├── products/          # Product management module
│   ├── inventory/         # Inventory management module
│   ├── movements/         # Movement tracking module
│   └── audits/            # Audit logging module
├── shared/
│   ├── database/          # Database connection and configuration
│   ├── middlewares/       # Shared middlewares
│   └── utils/             # Utility functions
└── types/
    └── express.d.ts       # TypeScript declarations for Express
```

## Prerequisites

Before running this project, ensure you have the following installed on your system:

- Node.js (v16 or higher)
- npm (Node Package Manager)
- PostgreSQL (v12 or higher)
- Git (optional, for version control)

## Installation Guide

### Step 1: Clone or Download the Project

Clone the repository or download the project files to your local machine:

```bash
git clone <https://github.com/CarlosParra69/Inventory-Back.git>
cd Inventory-Back
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install the following dependencies:
- express: Web framework
- pg: PostgreSQL client
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variables management
- swagger-jsdoc & swagger-ui-express: API documentation
- zod: Data validation
- ts-node-dev: TypeScript development server

### Step 3: Set Up Environment Variables

Create a .env file in the root directory of the project with the following variables:

```
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=inventory

# JWT Configuration
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=1d

```

Replace the values with your actual PostgreSQL credentials and secret keys.

### Step 4: Create PostgreSQL Database

Open PostgreSQL and create a new database:

```sql
CREATE DATABASE inventory;
```

### Step 5: Set Up Database Tables

Execute the following SQL script to create the required tables in your PostgreSQL database:

```sql
create table users
(
    id            uuid        default uuid_generate_v4()        not null
        primary key,
    name          varchar(100)                                  not null,
    email         varchar(150)                                  not null
        unique,
    password_hash text                                          not null,
    created_at    timestamp   default CURRENT_TIMESTAMP         not null,
    role          varchar(20) default 'USER'::character varying not null
);

alter table users
    owner to postgres;

create table categories
(
    id          uuid      default uuid_generate_v4() not null
        primary key,
    name        varchar(100)                         not null
        unique,
    description text,
    created_at  timestamp default CURRENT_TIMESTAMP  not null,
    deleted_at  timestamp
);

alter table categories
    owner to postgres;

create index idx_categories_active
    on categories (id)
    where (deleted_at IS NULL);

create table products
(
    id          uuid      default uuid_generate_v4() not null
        primary key,
    name        varchar(150)                         not null,
    description text,
    sku         varchar(50)                          not null
        unique,
    category_id uuid                                 not null
        constraint fk_product_category
            references categories
            on update cascade on delete restrict,
    created_at  timestamp default CURRENT_TIMESTAMP  not null,
    deleted_at  timestamp
);

alter table products
    owner to postgres;

create index idx_products_category_id
    on products (category_id);

create table inventory_movements
(
    id            uuid      default uuid_generate_v4() not null
        primary key,
    product_id    uuid                                 not null
        constraint fk_inventory_product
            references products
            on update cascade on delete restrict,
    movement_type char(3)                              not null
        constraint inventory_movements_movement_type_check
            check (movement_type = ANY (ARRAY ['IN'::bpchar, 'OUT'::bpchar])),
    quantity      integer                              not null
        constraint inventory_movements_quantity_check
            check (quantity > 0),
    reason        varchar(150),
    created_at    timestamp default CURRENT_TIMESTAMP  not null
);

alter table inventory_movements
    owner to postgres;

create index idx_inventory_product_id
    on inventory_movements (product_id);

create index idx_inventory_created_at
    on inventory_movements (created_at);

create table refresh_tokens
(
    id         uuid      default gen_random_uuid() not null
        primary key,
    user_id    uuid                                not null
        references users
            on delete cascade,
    token      text                                not null,
    expires_at timestamp                           not null,
    created_at timestamp default CURRENT_TIMESTAMP
);

alter table refresh_tokens
    owner to postgres;

create table audit_logs
(
    id          uuid      default gen_random_uuid() not null
        primary key,
    user_id     uuid,
    role        varchar(20),
    action      varchar(50)                         not null,
    resource    varchar(50),
    resource_id uuid,
    ip          varchar(45),
    created_at  timestamp default now()
);

alter table audit_logs
    owner to postgres;


```

### Step 6: Test Database Connection

Run the database test script to verify the connection:

```bash
npm run dev
```

The server should start and display a success message if the database connection is established.

## Running the Project

### Development Mode

To start the server in development mode with auto-reload:

```bash
npm run dev
```

The server will start on the port specified in your .env file (default: 5000).

Output:
```
Server running on http://localhost:5000
Database connected successfully
```

### Build for Production

To compile TypeScript to JavaScript:

```bash
npm run build
```

This generates a dist/ folder with the compiled JavaScript files.

### Start Production Server

To run the compiled production build:

```bash
npm start
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:5000/api-docs
```

The API documentation provides:
- Complete list of all endpoints
- Request and response schemas
- Authentication requirements
- Parameter descriptions
- Example requests and responses

## Available Endpoints

### Authentication Module
- POST /auth/register - Register a new user
- POST /auth/login - Authenticate and get tokens
- POST /auth/refresh - Refresh access token
- POST /auth/logout - Logout and invalidate refresh token

### Categories Module
- GET /categories - Get all categories
- GET /categories/:id - Get category by ID
- POST /categories - Create new category
- PUT /categories/:id - Update category
- DELETE /categories/:id - Delete category

### Products Module
- GET /products - Get all products with pagination
- GET /products/:id - Get product by ID
- POST /products - Create new product
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product
- GET /products/search/sku/:sku - Search product by SKU

### Inventory Module
- GET /inventory - Get all inventory levels
- GET /inventory/:productId - Get inventory for specific product
- POST /inventory/entry - Add stock entry
- POST /inventory/exit - Remove stock
- GET /inventory/low-stock - Get low stock products

### Movements Module
- GET /movements - Get all movements
- GET /movements/:productId - Get movements for product
- POST /movements - Create new movement
- GET /movements/date-range - Get movements in date range

### Audits Module
- GET /audits - Get all audit records
- GET /audits/user/:userId - Get audits by user
- GET /audits/entity/:entity - Get audits by entity type
- GET /audits/date-range - Get audits in date range

## Environment Configuration

Key environment variables:

- PORT: Server port (default: 5000)
- DB_HOST: PostgreSQL host
- DB_PORT: PostgreSQL port (default: 5432)
- DB_USER: PostgreSQL username
- DB_PASSWORD: PostgreSQL password
- DB_NAME: Database name
- JWT_SECRET: Secret key for access tokens (use a strong, random string)
- JWT_REFRESH_SECRET: Secret key for refresh tokens (use a different strong, random string)
- JWT_EXPIRES_IN: Access token expiration time (default: 15m)
- JWT_REFRESH_EXPIRES_IN: Refresh token expiration time (default: 7d)
- NODE_ENV: Environment mode (development/production)

## Project Scripts

- npm run dev - Start development server with auto-reload
- npm run build - Compile TypeScript to JavaScript
- npm start - Run production build

## Technologies Used

- Node.js: JavaScript runtime
- Express.js: Web application framework
- TypeScript: Static typing for JavaScript
- PostgreSQL: Relational database
- JWT: JSON Web Tokens for authentication
- Bcrypt: Password hashing
- Zod: Schema validation
- Swagger/OpenAPI: API documentation

## Error Handling

The API implements comprehensive error handling:

- 400 Bad Request: Validation errors or missing parameters
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Duplicate entries or constraint violations
- 500 Internal Server Error: Unexpected server errors

All error responses include a descriptive message and error code for debugging.

## Database Connection Troubleshooting

If you encounter database connection errors:

1. Verify PostgreSQL is running
2. Check credentials in .env file
3. Ensure database exists
4. Check firewall settings if using remote database
5. Verify port 5432 is accessible
6. Check PostgreSQL logs for connection issues

## Security Considerations

- Tokens are stored securely using JWT
- Passwords are hashed with bcrypt before storage
- CORS is configured to allow frontend requests
- Authorization middleware validates user permissions
- Audit system tracks all actions for security monitoring
- Refresh token rotation is implemented for enhanced security

## Support and Documentation

For more information:
- Review the Prompts.md file for detailed construction steps
- Check Swagger documentation at /api-docs endpoint
- Review code comments in the modules for implementation details

## License

This project is provided as-is for educational and commercial use.

## Version

Version 1.0.0 - Initial release
