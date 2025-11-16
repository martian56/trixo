/**
 * Generator Registry
 * Maps language/framework combinations to generator classes
 */

import type { Language, Framework } from '../types/index.js';
import { Language as Lang, PythonFramework, JavaScriptFramework } from '../types/index.js';
import type { IGenerator } from '../types/generator.interface.js';
import { FastAPIGenerator } from './fastapi.js';
import { ExpressGenerator } from './express.js';

type GeneratorConstructor = new () => IGenerator;

const generatorMap = new Map<string, GeneratorConstructor>();

// Register generators
generatorMap.set(`${Lang.PYTHON}:${PythonFramework.FASTAPI}`, FastAPIGenerator);
generatorMap.set(`${Lang.JAVASCRIPT}:${JavaScriptFramework.EXPRESS}`, ExpressGenerator);
// Add more generators as they're implemented

/**
 * Get generator instance for a language/framework combination
 */
export function getGenerator(language: Language, framework: Framework): IGenerator {
  const key = `${language}:${framework}`;
  const GeneratorClass = generatorMap.get(key);

  if (!GeneratorClass) {
    throw new Error(`No generator found for ${language}:${framework}`);
  }

  return new GeneratorClass();
}

/**
 * Check if a generator exists for a language/framework combination
 */
export function hasGenerator(language: Language, framework: Framework): boolean {
  const key = `${language}:${framework}`;
  return generatorMap.has(key);
}

/**
 * Register a new generator
 */
export function registerGenerator(
  language: Language,
  framework: Framework,
  GeneratorClass: GeneratorConstructor
): void {
  const key = `${language}:${framework}`;
  generatorMap.set(key, GeneratorClass);
}

