/**
 * Express Generator
 * Generates JavaScript/TypeScript + Express.js project structure
 */

import { BaseGenerator } from './base.generator.js';
import type { GeneratorOptions } from '../types/index.js';

export class ExpressGenerator extends BaseGenerator {
  protected readonly templateDir = 'js/express';
  protected readonly language = 'js';
  protected readonly framework = 'express';

  getAvailableOptions(): string[] {
    return ['orm', 'migrations', 'docker', 'tests'];
  }

  protected async generateOptionalFiles(
    targetPath: string,
    options: GeneratorOptions
  ): Promise<void> {
    // Generate ORM files if requested
    if (options.options?.orm) {
      // TODO: Add ORM-specific files (Prisma, TypeORM, etc.)
    }

    // Generate migration files if requested
    if (options.options?.migrations) {
      // TODO: Add migration setup
    }

    // Generate Docker files if requested
    if (options.options?.docker) {
      // TODO: Add Dockerfile and docker-compose.yml
    }

    // Generate test files if requested
    if (options.options?.tests) {
      // TODO: Add test setup (Jest, Vitest, etc.)
    }

    // Replace placeholders in copied files
    await this.replacePlaceholders(targetPath, {
      projectName: options.projectName,
    });
  }
}
