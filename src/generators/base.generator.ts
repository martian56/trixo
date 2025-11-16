/**
 * Base Generator Class
 * Provides common functionality for all generators
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import type { IGenerator } from '../types/generator.interface.js';
import type { GeneratorOptions } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export abstract class BaseGenerator implements IGenerator {
  protected abstract readonly templateDir: string;
  protected abstract readonly language: string;
  protected abstract readonly framework: string;

  /**
   * Get the template directory path
   * Works both in development and when installed as npm package
   */
  getTemplatePath(): string {
    // Try to resolve from package installation first
    // When installed, templates are at node_modules/trixo/templates
    // When running from source, templates are at project root
    const possiblePaths = [
      path.resolve(__dirname, '../../templates'), // Development/source
      path.resolve(__dirname, '../templates'),   // Installed package
      path.resolve(process.cwd(), 'node_modules/trixo/templates'), // Installed in project
    ];

    // Return the first path that exists, or default to development path
    for (const templatePath of possiblePaths) {
      if (fs.existsSync(templatePath)) {
        return path.join(templatePath, this.templateDir);
      }
    }

    // Fallback to development path
    return path.join(possiblePaths[0], this.templateDir);
  }

  /**
   * Generate the project structure
   */
  async generate(options: GeneratorOptions): Promise<void> {
    const templatePath = this.getTemplatePath();
    const targetPath = path.resolve(process.cwd(), options.targetPath);

    // Check if template exists
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    // Check if target directory already exists
    if (await fs.pathExists(targetPath)) {
      throw new Error(`Directory ${options.targetPath} already exists`);
    }

    // Create target directory
    await fs.ensureDir(targetPath);

    // Copy template files
    await this.copyTemplate(templatePath, targetPath, options);

    // Generate additional files based on options
    await this.generateOptionalFiles(targetPath, options);
  }

  /**
   * Copy template files to target directory
   */
  protected async copyTemplate(
    sourcePath: string,
    targetPath: string,
    _options: GeneratorOptions
  ): Promise<void> {
    await fs.copy(sourcePath, targetPath, {
      filter: (src) => {
        // Skip hidden files and directories
        const basename = path.basename(src);
        return !basename.startsWith('.') || basename === '.gitignore';
      },
    });
  }

  /**
   * Generate optional files based on project options
   * Override in subclasses to add framework-specific optional files
   */
  protected async generateOptionalFiles(
    _targetPath: string,
    _options: GeneratorOptions
  ): Promise<void> {
    // Override in subclasses
  }

  /**
   * Get available options/modules for this generator
   * Override in subclasses to return specific options
   */
  getAvailableOptions(): string[] {
    return ['orm', 'migrations', 'docker', 'tests'];
  }

  /**
   * Replace placeholders in all files recursively
   */
  protected async replacePlaceholders(
    dirPath: string,
    replacements: Record<string, string>
  ): Promise<void> {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        await this.replacePlaceholders(filePath, replacements);
      } else if (file.isFile()) {
        try {
          let content = await fs.readFile(filePath, 'utf-8');
          
          for (const [key, value] of Object.entries(replacements)) {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
          }

          await fs.writeFile(filePath, content, 'utf-8');
        } catch (error) {
          // Skip binary files or files that can't be read as text
          continue;
        }
      }
    }
  }
}

