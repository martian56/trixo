/**
 * Language and Framework Configuration
 * Add new languages and frameworks here
 */

import type { LanguageConfig } from '../types/index.js';
import { Language, PythonFramework, JavaScriptFramework, GoFramework } from '../types/index.js';

export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  [Language.PYTHON]: {
    name: 'Python',
    value: Language.PYTHON,
    frameworks: [
      {
        name: 'FastAPI',
        value: PythonFramework.FASTAPI,
        generator: 'fastapi',
      },
      {
        name: 'Django',
        value: PythonFramework.DJANGO,
        generator: 'django',
      },
      {
        name: 'Flask',
        value: PythonFramework.FLASK,
        generator: 'flask',
      },
    ],
  },
  [Language.JAVASCRIPT]: {
    name: 'JavaScript/TypeScript',
    value: Language.JAVASCRIPT,
    frameworks: [
      {
        name: 'Express',
        value: JavaScriptFramework.EXPRESS,
        generator: 'express',
      },
    ],
  },
  [Language.GO]: {
    name: 'Go',
    value: Language.GO,
    frameworks: [
      {
        name: 'Gin',
        value: GoFramework.GIN,
        generator: 'gin',
      },
    ],
  },
  [Language.RUST]: {
    name: 'Rust',
    value: Language.RUST,
    frameworks: [
      {
        name: 'Default',
        value: 'default' as any,
        generator: 'rust',
      },
    ],
  },
};

/**
 * Get language config by language enum
 */
export function getLanguageConfig(language: Language): LanguageConfig {
  return LANGUAGE_CONFIGS[language];
}

/**
 * Get all available languages as choices for inquirer
 */
export function getLanguageChoices() {
  return Object.values(LANGUAGE_CONFIGS).map((config) => ({
    name: config.name,
    value: config.value,
  }));
}

/**
 * Get framework choices for a specific language
 */
export function getFrameworkChoices(language: Language) {
  const config = LANGUAGE_CONFIGS[language];
  return config.frameworks.map((fw) => ({
    name: fw.name,
    value: fw.value,
  }));
}

