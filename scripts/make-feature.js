const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const featurePath = process.argv[2];

if (!featurePath) {
  console.error('Uso: node scripts/make-feature.js caminho/da/feature');
  process.exit(1);
}

const fullPath = path.join('src/app/features', featurePath);
const featureName = path.basename(featurePath);

console.log(`🚀 Criando estrutura para a feature: ${featureName}...`);

const subFolders = ['components', 'pages', 'services', 'models'];
subFolders.forEach((folder) => {
  const dir = path.join(fullPath, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('📦 Gerando Page Component...');
execSync(
  `ng generate component features/${featurePath}/pages/${featureName}-list --skip-tests --inline-style`,
  { stdio: 'inherit' },
);

console.log('📡 Gerando Service...');
execSync(`ng generate service features/${featurePath}/services/${featureName} --skip-tests`, {
  stdio: 'inherit',
});

const routesContent = `import { Routes } from '@angular/router';

export const ${featureName.toUpperCase()}_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/${featureName}-list/${featureName}-list.component').then(m => m.${capitalize(featureName)}ListComponent)
  }
];
`;

fs.writeFileSync(path.join(fullPath, `${featureName}.routes.ts`), routesContent);

const indexContent = `export * from './services/${featureName}.service';
export * from './${featureName}.routes';
`;
fs.writeFileSync(path.join(fullPath, 'index.ts'), indexContent);

console.log(`✅ Feature ${featureName} criada com sucesso em ${fullPath}`);

function capitalize(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
