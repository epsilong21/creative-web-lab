// Publica la exportación estática en la rama gh-pages del remoto "origin".
// Uso: npm run deploy
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const REPO = "creative-web-lab";
const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });

const remote = execSync("git remote get-url origin").toString().trim();

run("npx next build", { env: { ...process.env, PAGES_BASE_PATH: `/${REPO}` } });
// Sin .nojekyll, GitHub Pages ignora la carpeta _next.
writeFileSync("out/.nojekyll", "");

const inOut = { cwd: "out" };
run("git init -q -b gh-pages", inOut);
run("git add -A", inOut);
run('git commit -q -m "Deploy to GitHub Pages"', inOut);
run(`git push -f -q ${remote} gh-pages`, inOut);

console.log(`\nPublicado: https://epsilong21.github.io/${REPO}/`);
