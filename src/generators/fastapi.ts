/**
 * FastAPI Generator
 * Generates Python + FastAPI project structure with comprehensive options
 */

import path from 'path';
import fs from 'fs-extra';
import { BaseGenerator } from './base.generator.js';
import type { GeneratorOptions } from '../types/index.js';
import { getPythonOptions } from '../config/python-options.js';

export class FastAPIGenerator extends BaseGenerator {
  protected readonly templateDir = 'python/fastapi';
  protected readonly language = 'python';
  protected readonly framework = 'fastapi';

  getAvailableOptions(): string[] {
    return getPythonOptions().map((opt) => opt.key);
  }

  protected async generateOptionalFiles(
    targetPath: string,
    options: GeneratorOptions
  ): Promise<void> {
    const opts = options.options || {};

    // Generate requirements.txt with dependencies
    await this.generateRequirementsTxt(targetPath, opts);

    // Generate ORM files if requested
    if (opts.orm) {
      await this.generateORMFiles(targetPath, options.projectName);
    }

    // Generate migration files if requested
    if (opts.migrations) {
      await this.generateMigrationFiles(targetPath, options.projectName);
    }

    // Generate Docker files if requested
    if (opts.docker) {
      await this.generateDockerFiles(targetPath, options.projectName);
    }

    // Generate docker-compose if requested
    if (opts.dockerCompose) {
      await this.generateDockerCompose(targetPath, options.projectName, opts);
    }

    // Generate test files if requested
    if (opts.tests) {
      await this.generateTestFiles(targetPath, options.projectName);
    }

    // Generate environment files if requested
    if (opts.envFiles) {
      await this.generateEnvFiles(targetPath);
    }

    // Generate production config if requested
    if (opts.prodConfig) {
      await this.generateProdConfig(targetPath);
    }

    // Generate development config if requested
    if (opts.devConfig) {
      await this.generateDevConfig(targetPath);
    }

    // Generate linter config if requested
    if (opts.linter) {
      await this.generateLinterConfig(targetPath);
    }

    // Generate formatter config if requested
    if (opts.formatter) {
      await this.generateFormatterConfig(targetPath);
    }

    // Generate pre-commit config if requested
    if (opts.preCommit) {
      await this.generatePreCommitConfig(targetPath);
    }

    // Generate logging config if requested
    if (opts.logging) {
      await this.generateLoggingConfig(targetPath);
    }

    // Generate monitoring if requested
    if (opts.monitoring) {
      await this.generateMonitoring(targetPath);
    }

    // Generate README if requested
    if (opts.readme) {
      await this.generateREADME(targetPath, options.projectName, opts);
    }

    // Generate main.py with conditional features
    await this.generateMainPy(targetPath, options.projectName, opts);

    // Generate config.py with conditional features
    await this.generateConfigPy(targetPath, options.projectName, opts);

    // Replace placeholders in all files
    await this.replacePlaceholders(targetPath, {
      projectName: options.projectName,
      projectNameSnake: this.toSnakeCase(options.projectName),
      projectNameKebab: this.toKebabCase(options.projectName),
    });
  }

  private async generateMainPy(
    targetPath: string,
    projectName: string,
    opts: Record<string, any>
  ): Promise<void> {
    let mainPy = `"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
`;

    if (opts.logging) {
      mainPy += `from app.core.logging import setup_logging

# Setup logging
setup_logging()
`;
    }

    mainPy += `
app = FastAPI(
    title="${projectName}",
    description="A FastAPI application",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
`;

    if (opts.monitoring) {
      mainPy += `
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
`;
    }

    mainPy += `
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to ${projectName}"}

# Import API routes
# from app.api import router
# app.include_router(router, prefix="/api/v1")
`;

    await fs.writeFile(path.join(targetPath, 'app', 'main.py'), mainPy, 'utf-8');
  }

  private async generateConfigPy(
    targetPath: string,
    projectName: string,
    opts: Record<string, any>
  ): Promise<void> {
    let configPy = `"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "${projectName}"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
`;

    if (opts.orm) {
      configPy += `    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/dbname"
    
`;
    }

    configPy += `    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
`;

    await fs.writeFile(path.join(targetPath, 'app', 'core', 'config.py'), configPy, 'utf-8');
  }

  private async generateRequirementsTxt(targetPath: string, opts: Record<string, any>): Promise<void> {
    const requirements: string[] = [
      'fastapi>=0.104.1',
      'uvicorn[standard]>=0.24.0',
      'pydantic-settings>=2.1.0',
    ];

    // Add optional dependencies based on selected options
    const pythonOptions = getPythonOptions();
    for (const option of pythonOptions) {
      if (opts[option.key] && option.dependencies) {
        requirements.push(...option.dependencies.map((dep) => `${dep}>=0.0.0`));
      }
    }

    // Always add python-dotenv if envFiles is enabled (default)
    if (opts.envFiles !== false) {
      if (!requirements.some((r) => r.includes('python-dotenv'))) {
        requirements.push('python-dotenv>=1.0.0');
      }
    }

    // Add SQLAlchemy if ORM is enabled
    if (opts.orm) {
      if (!requirements.some((r) => r.includes('sqlalchemy'))) {
        requirements.push('sqlalchemy>=2.0.23');
      }
    }

    // Add Alembic if migrations is enabled
    if (opts.migrations) {
      if (!requirements.some((r) => r.includes('alembic'))) {
        requirements.push('alembic>=1.12.1');
      }
    }

    // Add pytest if tests is enabled
    if (opts.tests !== false) {
      if (!requirements.some((r) => r.includes('pytest'))) {
        requirements.push('pytest>=7.4.3');
        requirements.push('pytest-asyncio>=0.21.1');
        requirements.push('httpx>=0.25.2');
      }
    }

    // Sort and deduplicate
    const uniqueRequirements = Array.from(new Set(requirements)).sort();

    await fs.writeFile(
      path.join(targetPath, 'requirements.txt'),
      uniqueRequirements.join('\n') + '\n',
      'utf-8'
    );
  }

  private async generateORMFiles(targetPath: string, _projectName: string): Promise<void> {
    const dbDir = path.join(targetPath, 'app', 'db');
    await fs.ensureDir(dbDir);

    // Create database models file
    const modelsContent = `"""
Database models
"""
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class BaseModel(Base):
    """Base model with common fields"""
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
`;

    await fs.writeFile(path.join(dbDir, 'models.py'), modelsContent, 'utf-8');

    // Create database session file
    const sessionContent = `"""
Database session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`;

    await fs.writeFile(path.join(dbDir, 'session.py'), sessionContent, 'utf-8');

    // Create __init__.py
    await fs.writeFile(
      path.join(dbDir, '__init__.py'),
      'from app.db.models import Base, BaseModel\nfrom app.db.session import get_db, SessionLocal\n',
      'utf-8'
    );
  }

  private async generateMigrationFiles(targetPath: string, _projectName: string): Promise<void> {
    const migrationsDir = path.join(targetPath, 'alembic');
    await fs.ensureDir(migrationsDir);
    await fs.ensureDir(path.join(migrationsDir, 'versions'));

    // Create alembic.ini (will be generated by alembic init, but we'll create a basic one)
    const alembicIni = `[alembic]
script_location = alembic
prepend_sys_path = .
sqlalchemy.url = driver://user:pass@localhost/dbname

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
`;

    await fs.writeFile(path.join(targetPath, 'alembic.ini'), alembicIni, 'utf-8');

    // Create env.py for alembic
    const envPy = `from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from app.core.config import settings
from app.db.models import Base

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
`;

    await fs.writeFile(path.join(migrationsDir, 'env.py'), envPy, 'utf-8');

    // Create script.py.mako template
    const scriptMako = `"""${'${up_revision}'}
${'${down_revision}'}
${'${branch_labels}'}
${'${depends_on}'}

Revision ID: ${'${rev}'}
Revises: ${'${down_revision}'}
Create Date: ${'${create_date}'}

"""
from alembic import op
import sqlalchemy as sa
${'${imports}'}

# revision identifiers, used by Alembic.
revision = ${'${repr(rev)'}
down_revision = ${'${repr(down_revision)'}
branch_labels = ${'${repr(branch_labels)'}
depends_on = ${'${repr(depends_on)'}


def upgrade() -> None:
    ${'${upgrades}'}


def downgrade() -> None:
    ${'${downgrades}'}
`;

    await fs.writeFile(path.join(migrationsDir, 'script.py.mako'), scriptMako, 'utf-8');
  }

  private async generateDockerFiles(targetPath: string, _projectName: string): Promise<void> {
    const dockerfile = `FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
`;

    await fs.writeFile(path.join(targetPath, 'Dockerfile'), dockerfile, 'utf-8');

    // Create .dockerignore
    const dockerignore = `__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis
.DS_Store
*.swp
*.swo
*~
.idea
.vscode
`;

    await fs.writeFile(path.join(targetPath, '.dockerignore'), dockerignore, 'utf-8');
  }

  private async generateDockerCompose(
    targetPath: string,
    projectName: string,
    opts: Record<string, any>
  ): Promise<void> {
    const hasDb = opts.orm || opts.migrations;
    
    const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=true
    env_file:
      - .env
    volumes:
      - .:/app
    ${hasDb ? 'depends_on:\n      - db' : ''}
    restart: unless-stopped

${hasDb ? `  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${this.toSnakeCase(projectName)}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:` : ''}
`;

    await fs.writeFile(path.join(targetPath, 'docker-compose.yml'), dockerCompose, 'utf-8');
  }

  private async generateTestFiles(targetPath: string, _projectName: string): Promise<void> {
    const testsDir = path.join(targetPath, 'tests');
    await fs.ensureDir(testsDir);

    // Create pytest.ini
    const pytestIni = `[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
`;

    await fs.writeFile(path.join(targetPath, 'pytest.ini'), pytestIni, 'utf-8');

    // Create conftest.py
    const conftest = `"""
Pytest configuration and fixtures
"""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.fixture
async def client():
    """Create test client"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
`;

    await fs.writeFile(path.join(testsDir, 'conftest.py'), conftest, 'utf-8');

    // Create test_main.py
    const testMain = `"""
Tests for main application
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root(client: AsyncClient):
    """Test root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    """Test health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
`;

    await fs.writeFile(path.join(testsDir, 'test_main.py'), testMain, 'utf-8');

    // Create __init__.py
    await fs.writeFile(path.join(testsDir, '__init__.py'), '', 'utf-8');
  }

  private async generateEnvFiles(targetPath: string): Promise<void> {
    const envExample = `# Application Settings
DEBUG=True
ENVIRONMENT=development

# Server Settings
HOST=0.0.0.0
PORT=8000

# Database Settings (if using ORM)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Security
SECRET_KEY=your-secret-key-here
`;

    await fs.writeFile(path.join(targetPath, '.env.example'), envExample, 'utf-8');
  }

  private async generateProdConfig(targetPath: string): Promise<void> {
    const configDir = path.join(targetPath, 'app', 'config');
    await fs.ensureDir(configDir);

    const prodConfig = `"""
Production configuration
"""
from app.core.config import Settings


class ProductionSettings(Settings):
    """Production settings"""
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Add production-specific settings here
`;

    await fs.writeFile(path.join(configDir, 'production.py'), prodConfig, 'utf-8');
  }

  private async generateDevConfig(targetPath: string): Promise<void> {
    // Dev config is usually handled in main.py with reload
    // But we can add a dev-specific config file if needed
    const configDir = path.join(targetPath, 'app', 'config');
    await fs.ensureDir(configDir);

    const devConfig = `"""
Development configuration
"""
from app.core.config import Settings


class DevelopmentSettings(Settings):
    """Development settings"""
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Add development-specific settings here
`;

    await fs.writeFile(path.join(configDir, 'development.py'), devConfig, 'utf-8');
  }

  private async generateLinterConfig(targetPath: string): Promise<void> {
    // Ruff configuration (modern Python linter)
    const ruffToml = `[lint]
select = ["E", "F", "I", "N", "W", "UP"]
ignore = []

line-length = 100
target-version = "py311"

[lint.per-file-ignores]
"__init__.py" = ["F401"]
`;

    await fs.writeFile(path.join(targetPath, 'ruff.toml'), ruffToml, 'utf-8');
  }

  private async generateFormatterConfig(targetPath: string): Promise<void> {
    // Black configuration
    const pyprojectToml = path.join(targetPath, 'pyproject.toml');
    let pyprojectContent = '';

    if (await fs.pathExists(pyprojectToml)) {
      pyprojectContent = await fs.readFile(pyprojectToml, 'utf-8');
    }

    const blackConfig = `
[tool.black]
line-length = 100
target-version = ['py311']
include = '\\.pyi?$'
`;

    if (!pyprojectContent.includes('[tool.black]')) {
      await fs.appendFile(pyprojectToml, blackConfig, 'utf-8');
    }
  }

  private async generatePreCommitConfig(targetPath: string): Promise<void> {
    const preCommitConfig = `.pre-commit-config.yaml`;
    const content = `repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-json
      - id: check-toml
      - id: check-merge-conflict

  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.8
    hooks:
      - id: ruff
        args: [--fix]
`;

    await fs.writeFile(path.join(targetPath, preCommitConfig), content, 'utf-8');
  }

  private async generateLoggingConfig(targetPath: string): Promise<void> {
    const loggingDir = path.join(targetPath, 'app', 'core');
    await fs.ensureDir(loggingDir);

    const loggingConfig = `"""
Logging configuration
"""
import structlog
from structlog.stdlib import LoggerFactory


def setup_logging():
    """Configure structured logging"""
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
`;

    await fs.writeFile(path.join(loggingDir, 'logging.py'), loggingConfig, 'utf-8');
  }

  private async generateMonitoring(_targetPath: string): Promise<void> {
    // Add health check endpoint (already in main.py template)
    // Add monitoring middleware if needed
  }

  private async generateREADME(
    targetPath: string,
    projectName: string,
    opts: Record<string, any>
  ): Promise<void> {
    const features = [];
    if (opts.orm) features.push('- SQLAlchemy ORM');
    if (opts.migrations) features.push('- Alembic migrations');
    if (opts.docker) features.push('- Docker support');
    if (opts.dockerCompose) features.push('- Docker Compose');
    if (opts.tests) features.push('- pytest testing');
    if (opts.linter) features.push('- Code linting (ruff)');
    if (opts.formatter) features.push('- Code formatting (black)');
    if (opts.logging) features.push('- Structured logging');

    const readme = `# ${projectName}

A FastAPI application generated with Trixo.

## Features

${features.length > 0 ? features.join('\n') : '- FastAPI framework'}

## Getting Started

### Prerequisites

- Python 3.11+
- pip

### Installation

1. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

${opts.migrations ? `4. Run database migrations:
\`\`\`bash
alembic upgrade head
\`\`\`` : ''}

### Running the Application

**Development:**
\`\`\`bash
uvicorn app.main:app --reload
\`\`\`

**Production:**
\`\`\`bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
\`\`\`

${opts.docker ? `### Docker

**Build:**
\`\`\`bash
docker build -t ${this.toKebabCase(projectName)} .
\`\`\`

**Run:**
\`\`\`bash
docker run -p 8000:8000 ${this.toKebabCase(projectName)}
\`\`\`

${opts.dockerCompose ? `### Docker Compose

\`\`\`bash
docker-compose up
\`\`\`` : ''}` : ''}

${opts.tests ? `### Testing

\`\`\`bash
pytest
\`\`\`` : ''}

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

\`\`\`
${projectName}/
├── app/
│   ├── api/          # API routes
│   ├── core/         # Core configuration
│   ├── db/           # Database models and session
│   └── main.py       # Application entry point
├── tests/            # Test files
├── requirements.txt  # Python dependencies
└── README.md         # This file
\`\`\`

## License

ISC
`;

    await fs.writeFile(path.join(targetPath, 'README.md'), readme, 'utf-8');
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/[^a-z0-9_]/g, '_');
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
      .replace(/[^a-z0-9-]/g, '-');
  }
}
