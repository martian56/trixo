/**
 * Python-specific options configuration
 * Defines available options for Python frameworks
 */

export interface PythonOption {
  key: string;
  name: string;
  description: string;
  default?: boolean;
  dependencies?: string[];
}

export const PYTHON_OPTIONS: Record<string, PythonOption> = {
  orm: {
    key: 'orm',
    name: 'ORM (SQLAlchemy)',
    description: 'Add SQLAlchemy ORM for database operations',
    default: false,
    dependencies: ['sqlalchemy'],
  },
  migrations: {
    key: 'migrations',
    name: 'Database Migrations (Alembic)',
    description: 'Add Alembic for database migrations',
    default: false,
    dependencies: ['alembic'],
  },
  docker: {
    key: 'docker',
    name: 'Docker Support',
    description: 'Add Dockerfile for containerization',
    default: false,
  },
  dockerCompose: {
    key: 'dockerCompose',
    name: 'Docker Compose',
    description: 'Add docker-compose.yml for multi-container setup',
    default: false,
  },
  tests: {
    key: 'tests',
    name: 'Testing Framework (pytest)',
    description: 'Add pytest for testing',
    default: true,
    dependencies: ['pytest', 'pytest-asyncio', 'httpx'],
  },
  envFiles: {
    key: 'envFiles',
    name: 'Environment Files (.env)',
    description: 'Add .env.example and environment configuration',
    default: true,
    dependencies: ['python-dotenv'],
  },
  prodConfig: {
    key: 'prodConfig',
    name: 'Production Configuration',
    description: 'Add production-ready settings and configurations',
    default: false,
  },
  devConfig: {
    key: 'devConfig',
    name: 'Development Configuration',
    description: 'Add development settings and hot-reload',
    default: true,
  },
  linter: {
    key: 'linter',
    name: 'Linter (ruff/flake8)',
    description: 'Add code linting with ruff or flake8',
    default: true,
    dependencies: ['ruff'],
  },
  formatter: {
    key: 'formatter',
    name: 'Code Formatter (black)',
    description: 'Add black for code formatting',
    default: true,
    dependencies: ['black'],
  },
  preCommit: {
    key: 'preCommit',
    name: 'Pre-commit Hooks',
    description: 'Add pre-commit hooks for code quality',
    default: false,
    dependencies: ['pre-commit'],
  },
  readme: {
    key: 'readme',
    name: 'README Documentation',
    description: 'Generate comprehensive README.md',
    default: true,
  },
  apiDocs: {
    key: 'apiDocs',
    name: 'API Documentation',
    description: 'Add OpenAPI/Swagger documentation setup',
    default: true,
  },
  logging: {
    key: 'logging',
    name: 'Structured Logging',
    description: 'Add structured logging configuration',
    default: true,
    dependencies: ['structlog'],
  },
  monitoring: {
    key: 'monitoring',
    name: 'Monitoring & Health Checks',
    description: 'Add health check endpoints and monitoring',
    default: false,
  },
};

/**
 * Get available options for Python projects
 */
export function getPythonOptions(): PythonOption[] {
  return Object.values(PYTHON_OPTIONS);
}

/**
 * Get option by key
 */
export function getPythonOption(key: string): PythonOption | undefined {
  return PYTHON_OPTIONS[key];
}

/**
 * Get default options (options that are enabled by default)
 */
export function getDefaultPythonOptions(): string[] {
  return Object.values(PYTHON_OPTIONS)
    .filter((opt) => opt.default === true)
    .map((opt) => opt.key);
}

