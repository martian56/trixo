/**
 * Utility functions for Trixo
 */

import path from 'path';
import fs from 'fs-extra';

/**
 * Validate project name
 */
export function validateProjectName(name: string): boolean {
  if (!name || !name.trim()) {
    return false;
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name)) {
    return false;
  }

  // Check for reserved names (Windows)
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
  ];
  if (reservedNames.includes(name.toUpperCase())) {
    return false;
  }

  return true;
}

/**
 * Get project name validation error message
 */
export function getProjectNameError(name: string): string | null {
  if (!name || !name.trim()) {
    return 'Project name cannot be empty';
  }

  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name)) {
    return 'Project name contains invalid characters';
  }

  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
  ];
  if (reservedNames.includes(name.toUpperCase())) {
    return 'Project name is a reserved name';
  }

  return null;
}

/**
 * Check if directory exists and is not empty
 */
export async function isDirectoryNotEmpty(dirPath: string): Promise<boolean> {
  if (!(await fs.pathExists(dirPath))) {
    return false;
  }

  const files = await fs.readdir(dirPath);
  return files.length > 0;
}

/**
 * Recursively replace placeholders in files
 */
export async function replaceInFiles(
  dirPath: string,
  replacements: Record<string, string>
): Promise<void> {
  const files = await fs.readdir(dirPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      await replaceInFiles(filePath, replacements);
    } else if (file.isFile()) {
      let content = await fs.readFile(filePath, 'utf-8');
      
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      await fs.writeFile(filePath, content, 'utf-8');
    }
  }
}

/**
 * Format project name to valid identifier
 */
export function formatProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '');
}
