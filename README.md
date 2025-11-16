# Trixo

> Multi-stack project scaffolder CLI tool

Generate professional project structures for multiple languages and frameworks with a single command.

## Features

- 🚀 **Multi-language support**: Python, JavaScript/TypeScript, Go, Rust
- 🎯 **Framework templates**: FastAPI, Django, Flask, Express, Gin, and more
- ⚙️ **Modular options**: Choose from ORM, migrations, Docker, testing, and more
- 📦 **Production-ready**: Includes best practices, configurations, and documentation
- 🔧 **Extensible**: Easy to add new languages, frameworks, and options

## Installation

```bash
npm install -g trixo
```

Or use with `npx`:

```bash
npx trixo my-project
```

## Usage

```bash
trixo [project-name]
```

### Example

```bash
# Interactive mode
trixo

# With project name
trixo my-fastapi-app
```

## Supported Stacks

### Python
- **FastAPI** - Modern, fast web framework with async support
  - SQLAlchemy ORM
  - Alembic migrations
  - Docker & Docker Compose
  - pytest testing
  - Structured logging
  - And more...

- **Django** (coming soon)
- **Flask** (coming soon)

### JavaScript/TypeScript
- **Express** (coming soon)

### Go
- **Gin** (coming soon)

## Quick Start

1. **Create a FastAPI project:**
   ```bash
   trixo my-api
   # Select: Python → FastAPI
   # Choose options: ORM, Migrations, Docker, Tests, etc.
   ```

2. **Navigate to your project:**
   ```bash
   cd my-api
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations (if enabled):**
   ```bash
   alembic upgrade head
   ```

6. **Start the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Project Structure

A typical FastAPI project generated with Trixo:

```
my-api/
├── app/
│   ├── api/          # API routes
│   ├── core/         # Configuration & logging
│   ├── db/           # Database models & session
│   └── main.py       # FastAPI application
├── tests/            # Test files
├── alembic/          # Database migrations
├── requirements.txt  # Python dependencies
├── Dockerfile        # Docker configuration
├── docker-compose.yml
└── README.md         # Project documentation
```

## Options

When generating a project, you can choose from various options:

- **ORM** - SQLAlchemy ORM for database operations
- **Migrations** - Alembic for database migrations
- **Docker** - Dockerfile for containerization
- **Docker Compose** - Multi-container setup with PostgreSQL
- **Testing** - pytest with async support
- **Environment Files** - .env configuration
- **Production Config** - Production-ready settings
- **Development Config** - Development settings
- **Linter** - ruff for code linting
- **Formatter** - black for code formatting
- **Pre-commit Hooks** - Git hooks for code quality
- **Logging** - Structured logging with structlog
- **Monitoring** - Health check endpoints
- **README** - Comprehensive documentation

## Development

```bash
# Clone the repository
git clone https://github.com/martian56/trixo.git
cd trixo

# Install dependencies
npm install

# Build
npm run build

# Run in development
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Fuad Alizada

