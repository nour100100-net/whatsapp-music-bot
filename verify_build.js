#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Verifying TypeScript compilation...\n');

try {
  const result = execSync('npx tsc --noEmit 2>&1', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('✅ Compilation successful!\n');
  console.log(result);
  process.exit(0);
} catch (e) {
  console.log('❌ Compilation errors:\n');
  console.log(e.stdout || e.message);
  process.exit(1);
}
