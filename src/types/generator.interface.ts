/**
 * Generator Interface
 * All generators must implement this interface
 */

import type { GeneratorOptions } from './index.js';

export interface IGenerator {
  /**
   * Generate the project structure
   */
  generate(options: GeneratorOptions): Promise<void>;

  /**
   * Get the template directory path for this generator
   */
  getTemplatePath(): string;

  /**
   * Get available options/modules for this generator
   */
  getAvailableOptions(): string[];
}

