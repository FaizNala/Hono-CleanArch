# Clean Architecture Backend with Hono.js + Drizzle + Supabase

Boilerplate backend menggunakan Clean Architecture dengan teknologi modern:
- **Hono.js** - Fast web framework for Edge
- **Drizzle ORM** - Type-safe SQL toolkit  
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **TypeScript** - Type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase or NeonDB account
- PostgreSQL database

### Installation

```bash
# Clone and install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Database Setup

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Drizzle Studio
npm run db:studio
```

### Development

```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
```

## 📁 Project Structure (Clean Architecture)

```
src/
├── core/                               # 🔵 BUSINESS LOGIC (Inner Layers)
│   ├── domain/                         # 🟡 ENTITIES LAYER
│   │   └── user.entity.ts              # Business entities & validation
│   │
│   └── application/                    # 🔵 USE CASES LAYER  
│       ├── repositories/               # Repository contracts
│       │   └── user.repository.ts
│       └── use-cases/                  # Business logic implementation
│           └── user/
│               ├── create-user.usecase.ts
│               ├── get-user-by-id.usecase.ts
│               └── get-all-users.usecase.ts
│
├── infrastructure/                     # 🌎 FRAMEWORKS & DRIVERS (Outer Layer)
│   ├── database/                       # Database configuration
│   │   ├── index.ts                    # DB connection
│   │   └── schema.ts                   # Drizzle schema
│   └── repositories/                   # Repository implementations
│       └── drizzle-user.repository.ts
│
└── presentation/                       # 🟢 INTERFACE ADAPTERS (Outer Layer)
    └── v1/
        ├── controllers/                # HTTP request handlers
        │   └── user.controller.ts
        └── routes/                     # API routes
            └── user.routes.ts
```

## 🔥 API Endpoints

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID  
- `POST /api/v1/users` - Create new user

### Example Requests

**Create User:**
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "name": "John Doe"}'
```

**Get All Users:**
```bash
curl http://localhost:3000/api/v1/users
```

## 🏗️ Clean Architecture Benefits

### 🎯 **Separation of Concerns**
- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Use cases and business rules orchestration  
- **Infrastructure Layer**: Database, external services implementation
- **Presentation Layer**: HTTP, controllers, routing

### 🔄 **Dependency Rule**
Dependencies point inward. Inner layers know nothing about outer layers.

### 🧪 **Testability**
Each layer can be tested independently with mocked dependencies.

### 🔧 **Flexibility**  
Easy to swap implementations (e.g., change from Drizzle to Prisma)

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server

# Database commands
npm run db:generate # Generate migration files
npm run db:push     # Push schema to database  
npm run db:migrate  # Run migrations
npm run db:studio   # Open Drizzle Studio
```

## 🌍 Environment Variables

```env
DATABASE_URL="postgresql://username:password@host:port/database"
PORT=3000
```

## 🛠️ Technologies Used

- **[Hono.js](https://hono.dev/)** - Ultra-fast web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Supabase](https://supabase.com/)** - PostgreSQL database
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript execution

## 📄 License

MIT License - feel free to use this boilerplate for your projects!