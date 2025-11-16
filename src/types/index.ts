/**
 * Type definitions for Trixo
 */

export enum Language {
  PYTHON = 'python',
  JAVASCRIPT = 'js',
  GO = 'go',
  RUST = 'rust',
}

export enum PythonFramework {
  FASTAPI = 'fastapi',
  DJANGO = 'django',
  FLASK = 'flask',
}

export enum JavaScriptFramework {
  EXPRESS = 'express',
}

export enum GoFramework {
  GIN = 'gin',
}

export enum RustFramework {
  // Add Rust frameworks as needed
  DEFAULT = 'default',
}

export type Framework = PythonFramework | JavaScriptFramework | GoFramework | RustFramework;

export interface ProjectConfig {
  projectName: string;
  language: Language;
  framework: Framework;
  options?: ProjectOptions;
}

export interface ProjectOptions {
  // Database & ORM
  orm?: boolean;
  migrations?: boolean;
  
  // Infrastructure
  docker?: boolean;
  dockerCompose?: boolean;
  
  // Testing
  tests?: boolean;
  testFramework?: 'pytest' | 'unittest';
  
  // Environment
  envFiles?: boolean;
  prodConfig?: boolean;
  devConfig?: boolean;
  
  // Code Quality
  linter?: boolean;
  formatter?: boolean;
  preCommit?: boolean;
  
  // Documentation
  readme?: boolean;
  apiDocs?: boolean;
  
  // Additional features
  logging?: boolean;
  monitoring?: boolean;
  
  [key: string]: boolean | string | undefined;
}

export interface GeneratorOptions {
  projectName: string;
  targetPath: string;
  options?: ProjectOptions;
}

export interface LanguageConfig {
  name: string;
  value: Language;
  frameworks: FrameworkConfig[];
}

export interface FrameworkConfig {
  name: string;
  value: Framework;
  generator: string; // Path to generator module
}

