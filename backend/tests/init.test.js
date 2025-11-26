import fs from 'fs';
import path from 'path';

describe('Project Initialization', () => {
  const backendDir = process.cwd();

  test('should have a package.json file', () => {
    const packageJsonPath = path.join(backendDir, 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
  });

  test('should have a .env file', () => {
    const envPath = path.join(backendDir, '.env');
    expect(fs.existsSync(envPath)).toBe(true);
  });

  test('should have required dependencies in package.json', () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf-8'));
    const dependencies = packageJson.dependencies;
    
    const requiredDeps = [
      'express',
      'pg',
      'jsonwebtoken',
      'bcrypt',
      'express-validator',
      'cors',
      'helmet',
      'express-rate-limit',
      'dotenv'
    ];

    requiredDeps.forEach(dep => {
      expect(dependencies).toHaveProperty(dep);
    });
  });
});
