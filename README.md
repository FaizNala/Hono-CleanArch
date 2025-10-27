# 🏗️ Clean Architecture Backend API

Sistem backend modern dengan **Clean Architecture** menggunakan teknologi terkini untuk membangun aplikasi yang scalable, maintainable, dan testable.

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | [Hono.js](https://hono.dev/) | Ultra-fast web framework untuk Edge Computing |
| **Database** | [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL | Type-safe SQL toolkit dengan migrasi otomatis |
| **Authentication** | JWT + bcrypt | Secure token-based authentication |
| **Validation** | [Zod](https://zod.dev/) | TypeScript-first schema validation |
| **Authorization** | RBAC (Role-Based Access Control) | Permission system dengan caching |
| **Language** | TypeScript | Type safety dan developer experience |

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database (Supabase/Neon/Local)
- **npm** atau **yarn**

## ⚡ Quick Start

### 1. Installation & Setup

```bash
# Clone repository
git clone <repository-url>
cd backend-v2

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials Anda
```

### 2. Database Configuration

```env
# .env file
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
PORT=3000
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### 3. Database Migration & Seeding

```bash
# Generate schema migration files
npm run db:generate

# Push schema ke database
npm run db:push

# Seed data default (permissions, roles, users)
npm run seed

# Optional: Buka Drizzle Studio untuk inspect database
npm run db:studio
```

### 4. Development

```bash
# Start development server dengan hot reload
npm run dev

# Server berjalan di http://localhost:3000
```

## 🏛️ Clean Architecture Structure

Project ini mengimplementasikan **Clean Architecture** dengan 4 layer utama:

```
backend-v2/
├── 📁 src/
│   ├── 🎯 core/                      # BUSINESS LOGIC LAYER
│   │   ├── domain/                   # Entities & Domain Rules
│   │   │   ├── user.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   ├── permission.entity.ts
│   │   │   └── auth.entity.ts
│   │   └── application/              # Use Cases & Repository Interfaces
│   │       ├── repositories/         # Repository Contracts
│   │       └── use-cases/           # Business Logic Implementation
│   │           ├── auth/            # Authentication use cases
│   │           ├── user/            # User management use cases
│   │           ├── role/            # Role management use cases
│   │           └── permission/      # Permission management use cases
│   │
│   ├── 🔧 infrastructure/            # INFRASTRUCTURE LAYER
│   │   ├── database/                # Database Schema & Connection
│   │   │   ├── schema.ts           # Main schema export
│   │   │   ├── user.schema.ts      # User table definition
│   │   │   ├── role.schema.ts      # Role table definition
│   │   │   └── ...schema.ts        # Other table definitions
│   │   ├── repositories/           # Repository Implementations
│   │   │   ├── drizzle.user.repository.ts
│   │   │   └── ...repository.ts
│   │   └── seeders/               # Database Seeders
│   │       ├── index.ts           # Main seeder orchestrator
│   │       ├── permissions.seeder.ts
│   │       └── ...seeder.ts
│   │
│   ├── 🛠️ lib/                      # SHARED UTILITIES
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── utils/                  # Utility functions
│   │   │   ├── jwt.ts             # JWT token management
│   │   │   ├── response.ts        # Standardized API responses
│   │   │   ├── errorHandler.ts    # Error handling utilities
│   │   │   └── permissionCache.ts # Permission caching system
│   │   └── validation/            # Zod validation schemas
│   │       ├── auth.validation.ts
│   │       ├── user.validation.ts
│   │       └── ...validation.ts
│   │
│   ├── 🌐 presentation/             # PRESENTATION LAYER
│   │   ├── middleware/             # HTTP Middlewares
│   │   │   ├── auth.middleware.ts  # JWT authentication
│   │   │   └── permission.middleware.ts # Permission checking
│   │   ├── routes/                 # Route definitions
│   │   │   ├── routes.ts          # Main router
│   │   │   ├── auth.routes.ts     # Authentication routes
│   │   │   └── ...routes.ts       # Feature-specific routes
│   │   └── v1/                     # API Version 1
│   │       ├── controllers/        # HTTP Controllers
│   │       │   ├── auth.controller.ts
│   │       │   ├── user.controller.ts
│   │       │   └── ...controller.ts
│   │       └── mappers/            # Response mappers
│   │           ├── auth.mapper.ts
│   │           ├── user.mapper.ts
│   │           └── ...mapper.ts
│   │
│   └── index.ts                    # Application entry point
│
├── 📄 drizzle.config.ts            # Drizzle ORM configuration
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tsconfig.json               # TypeScript configuration
└── 📁 migrations/                  # Database migration files
```

## 🎯 Core Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication** dengan bcrypt password hashing
- **RBAC (Role-Based Access Control)** dengan permission granular
- **Permission Caching** untuk optimasi performa
- **Middleware-based Protection** untuk route security

### 👥 User Management

- CRUD operations untuk users dengan validation
- Password hashing otomatis
- Role assignment untuk users
- Query filtering dan pagination

### 🛡️ Role & Permission System

- Dynamic role creation dan management
- Granular permission system
- Role-permission assignment
- Cached permission checking untuk performa optimal

### 🗄️ Database Management

- **Type-safe** database operations dengan Drizzle ORM
- **Migration system** untuk version control database
- **Seeder system** untuk data default
- **Relationship management** antar entities

## 🔗 API Endpoints

### 🔑 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register user baru | ❌ |
| `POST` | `/api/v1/auth/login` | Login user | ❌ |

### 👤 Users

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| `GET` | `/api/v1/users` | Get all users | `users.view` |
| `GET` | `/api/v1/users/:id` | Get user by ID | `users.view` |
| `POST` | `/api/v1/users` | Create new user | `users.create` |
| `PUT` | `/api/v1/users/:id` | Update user | `users.update` |
| `DELETE` | `/api/v1/users/:id` | Delete user | `users.delete` |

### 🎭 Roles

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| `GET` | `/api/v1/roles` | Get all roles | `roles.view` |
| `GET` | `/api/v1/roles/:id` | Get role by ID | `roles.view` |
| `POST` | `/api/v1/roles` | Create new role | `roles.create` |
| `PUT` | `/api/v1/roles/:id` | Update role | `roles.update` |
| `DELETE` | `/api/v1/roles/:id` | Delete role | `roles.delete` |

### 🔒 Permissions

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| `GET` | `/api/v1/permissions` | Get all permissions | `permissions.view` |
| `GET` | `/api/v1/permissions/:id` | Get permission by ID | `permissions.view` |
| `POST` | `/api/v1/permissions` | Create new permission | `permissions.create` |
| `PUT` | `/api/v1/permissions/:id` | Update permission | `permissions.update` |
| `DELETE` | `/api/v1/permissions/:id` | Delete permission | `permissions.delete` |

## 📝 API Usage Examples

### Authentication

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "securepass123",
    "roleIds": [1]
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### User Management

```bash
# Get all users (dengan authentication)
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <your-jwt-token>"

# Create user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Jane Smith",
    "password": "password123",
    "roleIds": [2]
  }'

# Get users dengan filtering
curl -X GET "http://localhost:3000/api/v1/users?name=john&preload=true" \
  -H "Authorization: Bearer <your-jwt-token>"

# Pagination
curl -X GET "http://localhost:3000/api/v1/users?pageSize=10&cursor=5&direction=next" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🏗️ Architecture Principles

### 🎯 Dependency Rule

**Dependencies selalu mengarah ke dalam** - layer luar bergantung pada layer dalam, tidak sebaliknya:

```
Presentation → Application → Domain
     ↓              ↓          ↓
Infrastructure ←←←←←←←←←←← (hanya implement interfaces)
```

### 🔄 Layer Responsibilities

| Layer | Responsibility | Dependencies |
|-------|----------------|--------------|
| **Domain** | Business entities, rules, pure functions | None |
| **Application** | Use cases, repository interfaces, business orchestration | Domain only |
| **Infrastructure** | Database, external services, framework implementations | Application interfaces |
| **Presentation** | HTTP, controllers, middleware, routing | Application use cases |

### ✅ Benefits

- **🧪 Testability**: Setiap layer dapat ditest secara independen
- **🔄 Flexibility**: Mudah mengganti implementasi (DB, framework, dll)
- **📈 Scalability**: Architecture yang jelas memudahkan pengembangan tim
- **🛠️ Maintainability**: Separation of concerns yang jelas
- **🔒 Business Logic Protection**: Domain logic terlindungi dari perubahan teknis

## 🛠️ Advanced Features

### 🚀 Permission Caching System

Sistem caching permission yang intelligent untuk optimasi performa:

```typescript
// Auto-caching dengan TTL 2 menit
// Hanya cache user yang frequently accessed
// Max 100 users dalam memory
// Auto-cleanup expired entries
```

### 📊 Query Optimization Features

```typescript
// Support untuk berbagai query patterns:
- withPreload()        // Include relations
- withWhere(condition) // Conditional filtering  
- withPaginate()       // Cursor-based pagination
- withRawQuery()       // Custom SQL queries
```

### 🔍 Database Features

- **Indexes** pada kolom yang sering di-query
- **Relations** yang optimal dengan Drizzle
- **Batch operations** untuk seeding
- **Transaction support** untuk consistency

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server dengan hot reload |
| `npm run build` | Build untuk production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate migration files dari schema |
| `npm run db:push` | Push schema changes ke database |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio (GUI database explorer) |
| `npm run seed` | Run all database seeders |

## 🌍 Environment Configuration

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="24h"  # Support: 30m, 1h, 24h, 7d

# Server Configuration  
PORT=3000
NODE_ENV="development"

# CORS Configuration
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

## 📈 Performance Optimizations

- **Permission Caching**: In-memory cache dengan TTL untuk permission checks
- **Database Indexes**: Strategic indexing pada kolom yang frequently queried
- **Cursor-based Pagination**: Efficient pagination untuk large datasets
- **Batch Operations**: Optimized database operations untuk seeding
- **Connection Pooling**: Drizzle built-in connection pooling

## 🧪 Testing Strategy

Architecture ini memungkinkan testing pada setiap layer:

```typescript
// Domain Layer Testing
// ✅ Pure functions, easy to test

// Application Layer Testing  
// ✅ Mock repository interfaces

// Infrastructure Layer Testing
// ✅ Test database operations

// Presentation Layer Testing
// ✅ Mock use cases, test HTTP responses
```

## 🔧 Extensibility

Mudah untuk extend project ini:

### Menambah Entity Baru

1. **Domain**: Buat entity di `core/domain/`
2. **Application**: Buat repository interface & use cases
3. **Infrastructure**: Implement repository & schema
4. **Presentation**: Buat controller, routes, dan mapper

### Menambah Authentication Provider

1. Extend `auth.entity.ts`
2. Buat use case baru di `auth/`
3. Implement di infrastructure layer
4. Expose via routes

## 📚 Additional Resources

- **[Hono.js Documentation](https://hono.dev/)**
- **[Drizzle ORM Docs](https://orm.drizzle.team/)**
- **[Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
