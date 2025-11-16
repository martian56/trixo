#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { getGenerator, hasGenerator } from './generators/registry.js';

program
  .name('trixo')
  .description('Multi-stack project scaffolder')
  .version('1.0.0')
  .argument('[project-name]', 'Project name')
  .action(async (initialProjectName?: string) => {
    try {
      // Step 1: Get project name
      const { promptProjectName } = await import('./prompts/index.js');
      const projectName = initialProjectName || await promptProjectName();

      // Step 2: Get language and framework
      const { promptLanguage, promptFramework } = await import('./prompts/index.js');
      const language = await promptLanguage();
      const framework = await promptFramework(language);

      // Step 3: Check if generator exists
      if (!hasGenerator(language, framework)) {
        console.error(
          chalk.red(
            `\nError: Generator not found for ${language}:${framework}`
          )
        );
        process.exit(1);
      }

      // Step 4: Get generator and its available options
      const generator = getGenerator(language, framework);
      const availableOptions = generator.getAvailableOptions();

      // Step 5: Prompt for optional features
      const { promptOptions } = await import('./prompts/index.js');
      const options = availableOptions.length > 0
        ? await promptOptions(availableOptions, language)
        : {};

      // Step 6: Display scaffolding message
      console.log(chalk.green(`\nScaffolding project in ${projectName}...`));

      // Step 7: Generate project
      await generator.generate({
        projectName,
        targetPath: projectName,
        options: Object.keys(options).length > 0 ? options : undefined,
      });

      console.log(chalk.green(`\n✓ Project scaffolded successfully!`));
      console.log(chalk.dim(`\nNext steps:`));
      console.log(chalk.dim(`  cd ${projectName}`));
      
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`\nError: ${error.message}`));
      } else {
        console.error(chalk.red(`\nUnexpected error occurred`));
      }
      process.exit(1);
    }
  });

program.parse();
