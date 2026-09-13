import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` doit correspondre au chemin de publication GitHub Pages
// (https://sebistarrr.github.io/LastOrbStandingTV/), sinon les assets sont
// cherchés à la racine du domaine et le sprite de la lance revient en 404.
// Renommer le dépôt change donc cette valeur : GitHub redirige les pages HTML
// de l'ancienne adresse, mais un `base` périmé fabrique des URL d'assets que
// rien ne sert — et le CI ne le verrait pas, `npm run build` compilant très
// bien un mauvais chemin.
export default defineConfig({
  base: '/LastOrbStandingTV/',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'assets' },
});
