const { execSync } = require('child_process');

try {
  const result = execSync('npx tsc --noEmit', { 
    cwd: process.cwd(), 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('COMPILE_OK');
  process.exit(0);
} catch (e) {
  if (e.stdout) console.log('STDOUT:', e.stdout);
  if (e.stderr) console.log('STDERR:', e.stderr);
  console.log('COMPILE_ERROR:', e.message);
  process.exit(1);
}
