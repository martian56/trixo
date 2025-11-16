/**
 * Interactive prompts for Trixo CLI
 */

import inquirer from 'inquirer';
import type { Language, Framework, ProjectOptions } from '../types/index.js';
import { getLanguageChoices, getFrameworkChoices } from '../config/languages.js';
import { validateProjectName, getProjectNameError } from '../utils/index.js';

export interface PromptResult {
  projectName: string;
  language: Language;
  framework: Framework;
  options?: ProjectOptions;
}

/**
 * Prompt for project name
 */
export async function promptProjectName(initialName?: string): Promise<string> {
  if (initialName && validateProjectName(initialName)) {
    return initialName;
  }

  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: initialName,
      validate: (input: string) => {
        const error = getProjectNameError(input);
        return error || true;
      },
    },
  ]);

  return name;
}

/**
 * Prompt for language selection
 */
export async function promptLanguage(): Promise<Language> {
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Select a language:',
      choices: getLanguageChoices(),
    },
  ]);

  return language as Language;
}

/**
 * Prompt for framework selection based on language
 */
export async function promptFramework(language: Language): Promise<Framework> {
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: getFrameworkChoices(language),
    },
  ]);

  return framework as Framework;
}

/**
 * Prompt for optional project features
 */
export async function promptOptions(
  availableOptions: string[],
  language?: string
): Promise<ProjectOptions> {
  if (availableOptions.length === 0) {
    return {};
  }

  // Get option details if Python
  let optionDetails: Map<string, { name: string; description?: string }> = new Map();
  if (language === 'python') {
    const { getPythonOptions } = await import('../config/python-options.js');
    const pythonOptions = getPythonOptions();
    for (const opt of pythonOptions) {
      optionDetails.set(opt.key, {
        name: opt.name,
        description: opt.description,
      });
    }
  }

  const choices = availableOptions.map((opt) => {
    const details = optionDetails.get(opt);
    return {
      name: details
        ? `${details.name}${details.description ? ` - ${details.description}` : ''}`
        : formatOptionName(opt),
      value: opt,
    };
  });

  const { options } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: 'Select additional features:',
      choices,
    },
  ]);

  const result: ProjectOptions = {};
  for (const option of options) {
    result[option] = true;
  }

  return result;
}

/**
 * Format option name for display
 */
function formatOptionName(option: string): string {
  const formatted: Record<string, string> = {
    orm: 'ORM (Object-Relational Mapping)',
    migrations: 'Database Migrations',
    docker: 'Docker Support',
    tests: 'Test Setup',
  };

  return formatted[option] || option.charAt(0).toUpperCase() + option.slice(1);
}

/**
 * Run all prompts and return complete project configuration
 */
export async function runPrompts(
  initialProjectName?: string,
  availableOptions: string[] = ['orm', 'migrations', 'docker', 'tests']
): Promise<PromptResult> {
  const projectName = await promptProjectName(initialProjectName);
  const language = await promptLanguage();
  const framework = await promptFramework(language);

  // Prompt for options if available
  const options = availableOptions.length > 0 
    ? await promptOptions(availableOptions)
    : {};

  return {
    projectName,
    language,
    framework,
    options: Object.keys(options).length > 0 ? options : undefined,
  };
}

