/**
 * Built-in detection rules — short, sweet, effective.
 *
 * Detection strategies per rule:
 *   match.files       – marker file / directory existence
 *   match.extensions  – file extension presence
 *   match.contentPatterns – substring / regex inside a file
 *   dependencies      – package name in manifest (npm/pip/docker/go/ruby/rust/php)
 *   dotenv            – env-var prefix in .env files
 */

import { Rule } from './types';

/* ------------------------------------------------------------------ */
/*  Helper: shorthand for npm dependency                              */
/* ------------------------------------------------------------------ */
const npm = (name: string | RegExp) => ({ type: 'npm' as const, name });
const pip = (name: string | RegExp) => ({ type: 'python' as const, name });
const docker = (name: string | RegExp) => ({ type: 'docker' as const, name });
const gomod = (name: string | RegExp) => ({ type: 'golang' as const, name });
const gem = (name: string | RegExp) => ({ type: 'ruby' as const, name });
const cargo = (name: string | RegExp) => ({ type: 'rust' as const, name });
const composer = (name: string | RegExp) => ({ type: 'php' as const, name });

export const rules: Rule[] = [

  // ═══════════════════════════════════════════════════════════════════
  //  LANGUAGES
  // ═══════════════════════════════════════════════════════════════════
  { id: 'typescript', name: 'TypeScript', type: 'language', match: { files: ['tsconfig.json'], extensions: ['.ts', '.tsx'] } },
  { id: 'javascript', name: 'JavaScript', type: 'language', match: { extensions: ['.js', '.jsx', '.mjs', '.cjs'] } },
  { id: 'python', name: 'Python', type: 'language', match: { files: ['requirements.txt', 'setup.py', 'pyproject.toml', 'Pipfile'], extensions: ['.py'] } },
  { id: 'rust', name: 'Rust', type: 'language', match: { files: ['Cargo.toml'], extensions: ['.rs'] } },
  { id: 'go', name: 'Go', type: 'language', match: { files: ['go.mod', 'go.sum'], extensions: ['.go'] } },
  { id: 'java', name: 'Java', type: 'language', match: { files: ['pom.xml', 'build.gradle', 'build.gradle.kts'], extensions: ['.java'] } },
  { id: 'csharp', name: 'C#', type: 'language', match: { extensions: ['.cs', '.csproj', '.sln'] } },
  { id: 'ruby', name: 'Ruby', type: 'language', match: { files: ['Gemfile', 'Rakefile'], extensions: ['.rb'] } },
  { id: 'php', name: 'PHP', type: 'language', match: { files: ['composer.json'], extensions: ['.php'] } },
  { id: 'swift', name: 'Swift', type: 'language', match: { files: ['Package.swift'], extensions: ['.swift'] } },
  { id: 'kotlin', name: 'Kotlin', type: 'language', match: { extensions: ['.kt', '.kts'] } },
  { id: 'elixir', name: 'Elixir', type: 'language', match: { files: ['mix.exs'], extensions: ['.ex', '.exs'] } },
  { id: 'dart', name: 'Dart', type: 'language', match: { files: ['pubspec.yaml'], extensions: ['.dart'] } },
  { id: 'scala', name: 'Scala', type: 'language', match: { files: ['build.sbt'], extensions: ['.scala'] } },
  { id: 'cplusplus', name: 'C++', type: 'language', match: { files: ['CMakeLists.txt', 'Makefile'], extensions: ['.cpp', '.cxx', '.cc', '.hpp'] } },
  { id: 'c', name: 'C', type: 'language', match: { extensions: ['.c', '.h'] } },
  { id: 'lua', name: 'Lua', type: 'language', match: { extensions: ['.lua'] } },
  { id: 'r', name: 'R', type: 'language', match: { extensions: ['.R', '.Rmd'] } },
  { id: 'haskell', name: 'Haskell', type: 'language', match: { files: ['stack.yaml', 'cabal.project'], extensions: ['.hs'] } },
  { id: 'perl', name: 'Perl', type: 'language', match: { extensions: ['.pl', '.pm'] } },
  { id: 'bash', name: 'Bash', type: 'language', match: { extensions: ['.sh', '.bash'] } },
  { id: 'scss', name: 'SCSS', type: 'language', match: { extensions: ['.scss', '.sass'] } },
  { id: 'css', name: 'CSS', type: 'language', match: { extensions: ['.css'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  UI FRAMEWORKS (view layer)
  // ═══════════════════════════════════════════════════════════════════
  { id: 'react', name: 'React', type: 'ui_framework', dependencies: [npm('react')] },
  { id: 'vue', name: 'Vue', type: 'ui_framework', match: { extensions: ['.vue'] }, dependencies: [npm('vue')] },
  { id: 'angular', name: 'Angular', type: 'ui_framework', match: { files: ['angular.json'] }, dependencies: [npm('@angular/core')] },
  { id: 'svelte', name: 'Svelte', type: 'ui_framework', match: { extensions: ['.svelte'] }, dependencies: [npm('svelte')] },
  { id: 'solid', name: 'SolidJS', type: 'ui_framework', dependencies: [npm('solid-js')] },
  { id: 'preact', name: 'Preact', type: 'ui_framework', dependencies: [npm('preact')] },
  { id: 'htmx', name: 'htmx', type: 'ui_framework', dependencies: [npm('htmx.org')] },
  { id: 'alpine', name: 'Alpine.js', type: 'ui_framework', dependencies: [npm('alpinejs')] },
  { id: 'lit', name: 'Lit', type: 'ui_framework', dependencies: [npm('lit')] },
  { id: 'ember', name: 'Ember.js', type: 'ui_framework', dependencies: [npm('ember-source')] },
  { id: 'qwik', name: 'Qwik', type: 'ui_framework', dependencies: [npm('@builder.io/qwik')] },
  { id: 'stencil', name: 'Stencil', type: 'ui_framework', dependencies: [npm('@stencil/core')] },

  // ═══════════════════════════════════════════════════════════════════
  //  FRAMEWORKS (full-stack / backend)
  // ═══════════════════════════════════════════════════════════════════
  { id: 'nextjs', name: 'Next.js', type: 'framework', match: { files: ['next.config.js', 'next.config.mjs', 'next.config.ts'] }, dependencies: [npm('next')] },
  { id: 'nuxt', name: 'Nuxt', type: 'framework', match: { files: ['nuxt.config.js', 'nuxt.config.ts'] }, dependencies: [npm('nuxt')] },
  { id: 'sveltekit', name: 'SvelteKit', type: 'framework', dependencies: [npm('@sveltejs/kit')] },
  { id: 'remix', name: 'Remix', type: 'framework', dependencies: [npm('@remix-run/node'), npm('@remix-run/react')] },
  { id: 'astro', name: 'Astro', type: 'framework', match: { files: ['astro.config.mjs', 'astro.config.ts'] }, dependencies: [npm('astro')] },
  { id: 'express', name: 'Express', type: 'framework', dependencies: [npm('express')] },
  { id: 'fastify', name: 'Fastify', type: 'framework', dependencies: [npm('fastify')] },
  { id: 'nestjs', name: 'NestJS', type: 'framework', dependencies: [npm('@nestjs/core')] },
  { id: 'hono', name: 'Hono', type: 'framework', dependencies: [npm('hono')] },
  { id: 'koa', name: 'Koa', type: 'framework', dependencies: [npm('koa')] },
  { id: 'adonis', name: 'AdonisJS', type: 'framework', dependencies: [npm('@adonisjs/core')] },
  { id: 'elysia', name: 'Elysia', type: 'framework', dependencies: [npm('elysia')] },
  { id: 'blitz', name: 'Blitz.js', type: 'framework', dependencies: [npm('blitz')] },
  { id: 'redwood', name: 'RedwoodJS', type: 'framework', dependencies: [npm('@redwoodjs/core')] },
  { id: 'meteor', name: 'Meteor', type: 'framework', match: { files: ['.meteor'] } },
  { id: 'django', name: 'Django', type: 'framework', match: { files: ['manage.py'] }, dependencies: [pip('django'), pip('Django')] },
  { id: 'flask', name: 'Flask', type: 'framework', dependencies: [pip('flask'), pip('Flask')] },
  { id: 'fastapi', name: 'FastAPI', type: 'framework', dependencies: [pip('fastapi')] },
  { id: 'rails', name: 'Ruby on Rails', type: 'framework', match: { files: ['config/routes.rb', 'bin/rails'] }, dependencies: [gem('rails')] },
  { id: 'laravel', name: 'Laravel', type: 'framework', match: { files: ['artisan'] }, dependencies: [composer('laravel/framework')] },
  { id: 'symfony', name: 'Symfony', type: 'framework', dependencies: [composer('symfony/framework-bundle')] },
  { id: 'spring', name: 'Spring', type: 'framework', match: { contentPatterns: [
    { file: 'pom.xml', patterns: ['spring-boot', 'spring-framework'] },
    { file: 'build.gradle', patterns: ['spring-boot', 'spring-framework'] },
  ] } },
  { id: 'dotnet', name: '.NET / ASP.NET', type: 'framework', match: { files: ['appsettings.json', 'Startup.cs', 'Program.cs'], extensions: ['.csproj'] } },
  { id: 'tauri', name: 'Tauri', type: 'framework', match: { files: ['src-tauri'] }, dependencies: [npm('@tauri-apps/cli')] },
  { id: 'electron', name: 'Electron', type: 'framework', dependencies: [npm('electron')] },

  // ═══════════════════════════════════════════════════════════════════
  //  UI LIBRARIES
  // ═══════════════════════════════════════════════════════════════════
  { id: 'tailwind', name: 'Tailwind CSS', type: 'ui', match: { files: ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs'] }, dependencies: [npm('tailwindcss')] },
  { id: 'shadcn', name: 'shadcn/ui', type: 'ui', match: { files: ['components.json'] } },
  { id: 'materialui', name: 'Material UI', type: 'ui', dependencies: [npm('@mui/material')] },
  { id: 'chakra', name: 'Chakra UI', type: 'ui', dependencies: [npm('@chakra-ui/react')] },
  { id: 'antd', name: 'Ant Design', type: 'ui', dependencies: [npm('antd')] },
  { id: 'radix', name: 'Radix UI', type: 'ui', dependencies: [npm('@radix-ui/react-dialog'), npm('@radix-ui/themes')] },
  { id: 'headlessui', name: 'Headless UI', type: 'ui', dependencies: [npm('@headlessui/react')] },
  { id: 'bootstrap', name: 'Bootstrap', type: 'ui', dependencies: [npm('bootstrap'), npm('react-bootstrap')] },
  { id: 'daisyui', name: 'daisyUI', type: 'ui', dependencies: [npm('daisyui')] },
  { id: 'mantine', name: 'Mantine', type: 'ui', dependencies: [npm('@mantine/core')] },
  { id: 'heroui', name: 'HeroUI', type: 'ui', dependencies: [npm('@heroui/react')] },
  { id: 'd3', name: 'D3.js', type: 'ui', dependencies: [npm('d3')] },
  { id: 'storybook', name: 'Storybook', type: 'ui', match: { files: ['.storybook'] }, dependencies: [npm('storybook'), npm('@storybook/react')] },

  // ═══════════════════════════════════════════════════════════════════
  //  SSG (Static Site Generators)
  // ═══════════════════════════════════════════════════════════════════
  { id: 'gatsby', name: 'Gatsby', type: 'ssg', dependencies: [npm('gatsby')] },
  { id: 'hugo', name: 'Hugo', type: 'ssg', match: { files: ['hugo.toml', 'hugo.yaml', 'config.toml'] } },
  { id: 'jekyll', name: 'Jekyll', type: 'ssg', match: { files: ['_config.yml'] }, dependencies: [gem('jekyll')] },
  { id: 'docusaurus', name: 'Docusaurus', type: 'ssg', dependencies: [npm('@docusaurus/core')] },
  { id: 'vitepress', name: 'VitePress', type: 'ssg', dependencies: [npm('vitepress')] },
  { id: 'vuepress', name: 'VuePress', type: 'ssg', dependencies: [npm('vuepress')] },
  { id: 'eleventy', name: 'Eleventy', type: 'ssg', match: { files: ['.eleventy.js', 'eleventy.config.js'] }, dependencies: [npm('@11ty/eleventy')] },
  { id: 'mkdocs', name: 'MkDocs', type: 'ssg', match: { files: ['mkdocs.yml'] }, dependencies: [pip('mkdocs')] },
  { id: 'hexo', name: 'Hexo', type: 'ssg', dependencies: [npm('hexo')] },
  { id: 'mintlify', name: 'Mintlify', type: 'ssg', match: { files: ['mint.json'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  BUILDERS / BUNDLERS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'vite', name: 'Vite', type: 'builder', match: { files: ['vite.config.js', 'vite.config.ts'] }, dependencies: [npm('vite')] },
  { id: 'webpack', name: 'Webpack', type: 'builder', match: { files: ['webpack.config.js', 'webpack.config.ts'] }, dependencies: [npm('webpack')] },
  { id: 'esbuild', name: 'esbuild', type: 'builder', dependencies: [npm('esbuild')] },
  { id: 'rollup', name: 'Rollup', type: 'builder', match: { files: ['rollup.config.js', 'rollup.config.ts'] }, dependencies: [npm('rollup')] },
  { id: 'swc', name: 'SWC', type: 'builder', dependencies: [npm('@swc/core')] },
  { id: 'babel', name: 'Babel', type: 'builder', match: { files: ['babel.config.js', '.babelrc', 'babel.config.json'] }, dependencies: [npm('@babel/core')] },
  { id: 'parcel', name: 'Parcel', type: 'builder', dependencies: [npm('parcel')] },
  { id: 'turborepo', name: 'Turborepo', type: 'builder', match: { files: ['turbo.json'] }, dependencies: [npm('turbo')] },
  { id: 'nx', name: 'Nx', type: 'builder', match: { files: ['nx.json'] }, dependencies: [npm('nx')] },
  { id: 'rspack', name: 'Rspack', type: 'builder', dependencies: [npm('@rspack/core')] },

  // ═══════════════════════════════════════════════════════════════════
  //  LINTERS / FORMATTERS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'eslint', name: 'ESLint', type: 'linter', match: { files: ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', 'eslint.config.js', 'eslint.config.mjs', 'eslint.config.ts'] }, dependencies: [npm('eslint')] },
  { id: 'prettier', name: 'Prettier', type: 'linter', match: { files: ['.prettierrc', '.prettierrc.json', '.prettierrc.js', 'prettier.config.js', 'prettier.config.mjs'] }, dependencies: [npm('prettier')] },
  { id: 'biome', name: 'Biome', type: 'linter', match: { files: ['biome.json', 'biome.jsonc'] }, dependencies: [npm('@biomejs/biome')] },
  { id: 'stylelint', name: 'Stylelint', type: 'linter', match: { files: ['.stylelintrc', '.stylelintrc.json'] }, dependencies: [npm('stylelint')] },
  { id: 'oxlint', name: 'oxlint', type: 'linter', dependencies: [npm('oxlint')] },
  { id: 'rubocop', name: 'RuboCop', type: 'linter', match: { files: ['.rubocop.yml'] }, dependencies: [gem('rubocop')] },

  // ═══════════════════════════════════════════════════════════════════
  //  TESTING
  // ═══════════════════════════════════════════════════════════════════
  { id: 'jest', name: 'Jest', type: 'test', match: { files: ['jest.config.js', 'jest.config.ts', 'jest.config.mjs'] }, dependencies: [npm('jest')] },
  { id: 'vitest', name: 'Vitest', type: 'test', match: { files: ['vitest.config.ts', 'vitest.config.js'] }, dependencies: [npm('vitest')] },
  { id: 'mocha', name: 'Mocha', type: 'test', dependencies: [npm('mocha')] },
  { id: 'cypress', name: 'Cypress', type: 'test', match: { files: ['cypress.config.js', 'cypress.config.ts', 'cypress'] }, dependencies: [npm('cypress')] },
  { id: 'playwright', name: 'Playwright', type: 'test', match: { files: ['playwright.config.ts', 'playwright.config.js'] }, dependencies: [npm('@playwright/test'), npm('playwright'), pip('playwright')] },
  { id: 'puppeteer', name: 'Puppeteer', type: 'test', dependencies: [npm('puppeteer')] },
  { id: 'selenium', name: 'Selenium', type: 'test', dependencies: [npm('selenium-webdriver'), pip('selenium'), gem('selenium-webdriver')] },
  { id: 'testing-library', name: 'Testing Library', type: 'test', dependencies: [npm('@testing-library/react'), npm('@testing-library/jest-dom')] },
  { id: 'pytest', name: 'pytest', type: 'test', dependencies: [pip('pytest')] },
  { id: 'phpunit', name: 'PHPUnit', type: 'test', match: { files: ['phpunit.xml', 'phpunit.xml.dist'] }, dependencies: [composer('phpunit/phpunit')] },
  { id: 'k6', name: 'k6', type: 'test', dependencies: [npm('k6')] },

  // ═══════════════════════════════════════════════════════════════════
  //  VALIDATION
  // ═══════════════════════════════════════════════════════════════════
  { id: 'zod', name: 'Zod', type: 'validation', dependencies: [npm('zod')] },
  { id: 'joi', name: 'Joi', type: 'validation', dependencies: [npm('joi')] },
  { id: 'yup', name: 'Yup', type: 'validation', dependencies: [npm('yup')] },
  { id: 'valibot', name: 'Valibot', type: 'validation', dependencies: [npm('valibot')] },
  { id: 'typebox', name: 'TypeBox', type: 'validation', dependencies: [npm('@sinclair/typebox')] },
  { id: 'ajv', name: 'Ajv', type: 'validation', dependencies: [npm('ajv')] },

  // ═══════════════════════════════════════════════════════════════════
  //  ORM / DATA ACCESS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'prisma', name: 'Prisma', type: 'orm', match: { files: ['schema.prisma', 'prisma/schema.prisma'] }, dependencies: [npm('prisma'), npm('@prisma/client')] },
  { id: 'drizzle', name: 'Drizzle', type: 'orm', dependencies: [npm('drizzle-orm')] },
  { id: 'typeorm', name: 'TypeORM', type: 'orm', dependencies: [npm('typeorm')] },
  { id: 'sequelize', name: 'Sequelize', type: 'orm', match: { files: ['.sequelizerc'] }, dependencies: [npm('sequelize')] },
  { id: 'knex', name: 'Knex', type: 'orm', dependencies: [npm('knex')] },
  { id: 'kysely', name: 'Kysely', type: 'orm', dependencies: [npm('kysely')] },
  { id: 'mongoose', name: 'Mongoose', type: 'orm', dependencies: [npm('mongoose')] },
  { id: 'sqlalchemy', name: 'SQLAlchemy', type: 'orm', dependencies: [pip('SQLAlchemy'), pip('sqlalchemy')] },
  { id: 'gorm', name: 'GORM', type: 'orm', dependencies: [gomod('gorm.io/gorm')] },
  { id: 'diesel', name: 'Diesel', type: 'orm', match: { files: ['diesel.toml'] }, dependencies: [cargo('diesel')] },
  { id: 'doctrine', name: 'Doctrine', type: 'orm', dependencies: [composer('doctrine/orm')] },

  // ═══════════════════════════════════════════════════════════════════
  //  CI / CD
  // ═══════════════════════════════════════════════════════════════════
  { id: 'github-actions', name: 'GitHub Actions', type: 'ci', match: { files: ['.github/workflows'] } },
  { id: 'gitlab-ci', name: 'GitLab CI', type: 'ci', match: { files: ['.gitlab-ci.yml'] } },
  { id: 'jenkins', name: 'Jenkins', type: 'ci', match: { files: ['Jenkinsfile'] } },
  { id: 'circleci', name: 'CircleCI', type: 'ci', match: { files: ['.circleci/config.yml', '.circleci'] } },
  { id: 'travis', name: 'Travis CI', type: 'ci', match: { files: ['.travis.yml'] } },
  { id: 'azure-pipelines', name: 'Azure Pipelines', type: 'ci', match: { files: ['azure-pipelines.yml'] } },
  { id: 'bitbucket-pipelines', name: 'Bitbucket Pipelines', type: 'ci', match: { files: ['bitbucket-pipelines.yml'] } },
  { id: 'appveyor', name: 'AppVeyor', type: 'ci', match: { files: ['appveyor.yml', '.appveyor.yml'] } },
  { id: 'dependabot', name: 'Dependabot', type: 'ci', match: { files: ['.github/dependabot.yml'] } },
  { id: 'renovate', name: 'Renovate', type: 'ci', match: { files: ['renovate.json', 'renovate.json5', '.renovaterc', '.renovaterc.json'] } },
  { id: 'codecov', name: 'Codecov', type: 'ci', match: { files: ['codecov.yml', '.codecov.yml'] } },
  { id: 'sonarcloud', name: 'SonarCloud', type: 'ci', match: { files: ['sonar-project.properties'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  CLOUD PROVIDERS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'aws', name: 'AWS', type: 'cloud', match: { files: ['serverless.yml', 'samconfig.toml', 'template.yaml', 'cdk.json'] }, dependencies: [npm('aws-sdk'), npm('@aws-sdk/client-s3'), pip('boto3')] , dotenv: ['AWS_'] },
  { id: 'gcp', name: 'Google Cloud', type: 'cloud', dependencies: [npm('@google-cloud/storage'), npm('@google-cloud/pubsub'), pip('google-cloud-storage')], dotenv: ['GOOGLE_CLOUD_', 'GCP_', 'GCLOUD_'] },
  { id: 'azure', name: 'Azure', type: 'cloud', dependencies: [npm('@azure/storage-blob'), npm('@azure/identity')], dotenv: ['AZURE_'] },
  { id: 'firebase', name: 'Firebase', type: 'cloud', match: { files: ['firebase.json', '.firebaserc'] }, dependencies: [npm('firebase'), npm('firebase-admin')], dotenv: ['FIREBASE_'] },
  { id: 'cloudflare', name: 'Cloudflare', type: 'cloud', match: { files: ['wrangler.toml', 'wrangler.json'] }, dependencies: [npm('wrangler'), npm('@cloudflare/workers-types')] },
  { id: 'supabase', name: 'Supabase', type: 'cloud', match: { files: ['supabase'] }, dependencies: [npm('@supabase/supabase-js')], dotenv: ['SUPABASE_', 'NEXT_PUBLIC_SUPABASE_'] },
  { id: 'heroku', name: 'Heroku', type: 'cloud', match: { files: ['Procfile', 'app.json'] } },
  { id: 'flyio', name: 'Fly.io', type: 'cloud', match: { files: ['fly.toml'] } },
  { id: 'railway', name: 'Railway', type: 'cloud', match: { files: ['railway.json', 'railway.toml'] } },
  { id: 'dokku', name: 'Dokku', type: 'cloud', match: { files: ['DOKKU_SCALE'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  HOSTING
  // ═══════════════════════════════════════════════════════════════════
  { id: 'vercel', name: 'Vercel', type: 'hosting', match: { files: ['vercel.json', '.vercel'] }, dependencies: [npm('@vercel/analytics')] },
  { id: 'netlify', name: 'Netlify', type: 'hosting', match: { files: ['netlify.toml', '_redirects'] } },
  { id: 'github-pages', name: 'GitHub Pages', type: 'hosting', match: { files: ['CNAME'] } },
  { id: 'docker', name: 'Docker', type: 'hosting', match: { files: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml', 'compose.yaml', 'compose.yml', '.dockerignore'] } },
  { id: 'kubernetes', name: 'Kubernetes', type: 'hosting', match: { files: ['k8s', 'kubernetes', 'skaffold.yaml'] } },
  { id: 'digitalocean', name: 'DigitalOcean', type: 'hosting', match: { files: ['.do/app.yaml'] }, dotenv: ['DIGITALOCEAN_'] },
  { id: 'render', name: 'Render', type: 'hosting', match: { files: ['render.yaml'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  IAC (Infrastructure as Code)
  // ═══════════════════════════════════════════════════════════════════
  { id: 'terraform', name: 'Terraform', type: 'iac', match: { extensions: ['.tf'], files: ['main.tf', 'terraform.tfvars'] } },
  { id: 'pulumi', name: 'Pulumi', type: 'iac', match: { files: ['Pulumi.yaml', 'Pulumi.yml'] }, dependencies: [npm('@pulumi/pulumi'), pip('pulumi')] },
  { id: 'ansible', name: 'Ansible', type: 'iac', match: { files: ['ansible.cfg', 'playbook.yml'] }, dependencies: [pip('ansible')] },
  { id: 'helm', name: 'Helm', type: 'iac', match: { files: ['Chart.yaml'] } },
  { id: 'terragrunt', name: 'Terragrunt', type: 'iac', match: { files: ['terragrunt.hcl'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  DATABASES
  // ═══════════════════════════════════════════════════════════════════
  { id: 'postgresql', name: 'PostgreSQL', type: 'db', dependencies: [npm('pg'), npm('postgres'), pip('psycopg2'), pip('psycopg'), docker('postgres')], dotenv: ['POSTGRES_', 'PG_', 'DATABASE_URL'] },
  { id: 'mysql', name: 'MySQL', type: 'db', dependencies: [npm('mysql'), npm('mysql2'), pip('mysqlclient'), pip('PyMySQL'), docker('mysql')], dotenv: ['MYSQL_'] },
  { id: 'mongodb', name: 'MongoDB', type: 'db', dependencies: [npm('mongodb'), pip('pymongo'), pip('motor'), docker('mongo')], dotenv: ['MONGO_', 'MONGODB_'] },
  { id: 'redis', name: 'Redis', type: 'db', dependencies: [npm('redis'), npm('ioredis'), pip('redis'), docker('redis'), gomod('github.com/redis/go-redis')], dotenv: ['REDIS_'] },
  { id: 'sqlite', name: 'SQLite', type: 'db', match: { extensions: ['.sqlite', '.db'] }, dependencies: [npm('better-sqlite3'), npm('sqlite3'), pip('aiosqlite')] },
  { id: 'elasticsearch', name: 'Elasticsearch', type: 'db', dependencies: [npm('@elastic/elasticsearch'), pip('elasticsearch'), docker('elasticsearch')], dotenv: ['ELASTIC_', 'ELASTICSEARCH_'] },
  { id: 'neo4j', name: 'Neo4j', type: 'db', dependencies: [npm('neo4j-driver'), pip('neo4j'), docker('neo4j')] },
  { id: 'cassandra', name: 'Cassandra', type: 'db', dependencies: [npm('cassandra-driver'), pip('cassandra-driver'), docker('cassandra')] },
  { id: 'clickhouse', name: 'ClickHouse', type: 'db', dependencies: [npm('@clickhouse/client'), docker('clickhouse/clickhouse-server'), pip('clickhouse-connect')] },
  { id: 'influxdb', name: 'InfluxDB', type: 'db', dependencies: [npm('@influxdata/influxdb-client'), docker('influxdb')] },
  { id: 'mssql', name: 'Microsoft SQL Server', type: 'db', dependencies: [npm('mssql'), npm('tedious'), docker('mcr.microsoft.com/mssql/server')] },
  { id: 'mariadb', name: 'MariaDB', type: 'db', dependencies: [npm('mariadb'), docker('mariadb')] },
  { id: 'couchbase', name: 'Couchbase', type: 'db', dependencies: [npm('couchbase'), docker('couchbase')] },
  { id: 'dynamodb', name: 'DynamoDB', type: 'db', dependencies: [npm('@aws-sdk/client-dynamodb'), npm('dynamoose')], dotenv: ['DYNAMODB_'] },
  { id: 'cockroachdb', name: 'CockroachDB', type: 'db', dependencies: [docker('cockroachdb/cockroach')] },
  { id: 'surrealdb', name: 'SurrealDB', type: 'db', dependencies: [npm('surrealdb.js'), docker('surrealdb/surrealdb')] },
  { id: 'duckdb', name: 'DuckDB', type: 'db', dependencies: [npm('duckdb'), pip('duckdb')] },
  { id: 'neondb', name: 'Neon', type: 'db', dependencies: [npm('@neondatabase/serverless')], dotenv: ['NEON_'] },
  { id: 'planetscale', name: 'PlanetScale', type: 'db', dependencies: [npm('@planetscale/database')], dotenv: ['PLANETSCALE_'] },
  { id: 'turso', name: 'Turso', type: 'db', dependencies: [npm('@libsql/client')], dotenv: ['TURSO_'] },
  { id: 'meilisearch', name: 'Meilisearch', type: 'db', dependencies: [npm('meilisearch'), docker('getmeili/meilisearch')] },
  { id: 'typesense', name: 'Typesense', type: 'db', dependencies: [npm('typesense'), docker('typesense/typesense')] },
  { id: 'algolia', name: 'Algolia', type: 'db', dependencies: [npm('algoliasearch')], dotenv: ['ALGOLIA_'] },

  // ── Vector DBs ──
  { id: 'pinecone', name: 'Pinecone', type: 'db', dependencies: [npm('@pinecone-database/pinecone'), pip('pinecone-client')], dotenv: ['PINECONE_'] },
  { id: 'chromadb', name: 'ChromaDB', type: 'db', dependencies: [npm('chromadb'), pip('chromadb')] },
  { id: 'qdrant', name: 'Qdrant', type: 'db', dependencies: [npm('@qdrant/js-client-rest'), pip('qdrant-client')] },
  { id: 'milvus', name: 'Milvus', type: 'db', dependencies: [npm('@zilliz/milvus2-sdk-node'), pip('pymilvus')] },
  { id: 'weaviate', name: 'Weaviate', type: 'db', dependencies: [npm('weaviate-ts-client'), pip('weaviate-client')] },

  // ═══════════════════════════════════════════════════════════════════
  //  QUEUE / MESSAGING
  // ═══════════════════════════════════════════════════════════════════
  { id: 'rabbitmq', name: 'RabbitMQ', type: 'queue', dependencies: [npm('amqplib'), pip('pika'), docker('rabbitmq')], dotenv: ['RABBITMQ_'] },
  { id: 'kafka', name: 'Apache Kafka', type: 'queue', dependencies: [npm('kafkajs'), pip('kafka-python'), docker('confluentinc/cp-kafka')], dotenv: ['KAFKA_'] },
  { id: 'bullmq', name: 'BullMQ', type: 'queue', dependencies: [npm('bullmq'), npm('bull')] },
  { id: 'sqs', name: 'AWS SQS', type: 'queue', dependencies: [npm('@aws-sdk/client-sqs')], dotenv: ['SQS_'] },
  { id: 'nats', name: 'NATS', type: 'queue', dependencies: [npm('nats'), docker('nats')] },
  { id: 'celery', name: 'Celery', type: 'queue', dependencies: [pip('celery')] },
  { id: 'pubsub', name: 'Google Pub/Sub', type: 'queue', dependencies: [npm('@google-cloud/pubsub')] },

  // ═══════════════════════════════════════════════════════════════════
  //  STORAGE
  // ═══════════════════════════════════════════════════════════════════
  { id: 's3', name: 'AWS S3', type: 'storage', dependencies: [npm('@aws-sdk/client-s3'), pip('boto3')], dotenv: ['S3_', 'AWS_S3_'] },
  { id: 'cloudflare-r2', name: 'Cloudflare R2', type: 'storage', dependencies: [npm('@cloudflare/r2')] },
  { id: 'cloudinary', name: 'Cloudinary', type: 'storage', dependencies: [npm('cloudinary')], dotenv: ['CLOUDINARY_'] },
  { id: 'minio', name: 'MinIO', type: 'storage', dependencies: [npm('minio'), docker('minio/minio')] },

  // ═══════════════════════════════════════════════════════════════════
  //  AI / ML
  // ═══════════════════════════════════════════════════════════════════
  { id: 'openai', name: 'OpenAI', type: 'ai', dependencies: [npm('openai'), pip('openai'), gomod('github.com/sashabaranov/go-openai')], dotenv: ['OPENAI_'] },
  { id: 'anthropic', name: 'Anthropic', type: 'ai', dependencies: [npm('@anthropic-ai/sdk'), pip('anthropic')], dotenv: ['ANTHROPIC_'] },
  { id: 'google-ai', name: 'Google AI / Gemini', type: 'ai', dependencies: [npm('@google/generative-ai'), pip('google-generativeai')], dotenv: ['GOOGLE_AI_', 'GEMINI_'] },
  { id: 'cohere', name: 'Cohere', type: 'ai', dependencies: [npm('cohere-ai'), pip('cohere')], dotenv: ['COHERE_'] },
  { id: 'huggingface', name: 'Hugging Face', type: 'ai', dependencies: [npm('@huggingface/inference'), pip('transformers'), pip('huggingface_hub')], dotenv: ['HUGGINGFACE_', 'HF_'] },
  { id: 'replicate', name: 'Replicate', type: 'ai', dependencies: [npm('replicate'), pip('replicate')], dotenv: ['REPLICATE_'] },
  { id: 'langchain', name: 'LangChain', type: 'ai', dependencies: [npm('langchain'), pip('langchain')], dotenv: ['LANGCHAIN_'] },
  { id: 'llamaindex', name: 'LlamaIndex', type: 'ai', dependencies: [npm('llamaindex'), pip('llama-index')] },
  { id: 'vercel-ai', name: 'Vercel AI SDK', type: 'ai', dependencies: [npm('ai'), npm('@ai-sdk/openai')] },
  { id: 'ollama', name: 'Ollama', type: 'ai', dependencies: [npm('ollama'), pip('ollama')], dotenv: ['OLLAMA_'] },
  { id: 'mistral', name: 'Mistral AI', type: 'ai', dependencies: [npm('@mistralai/mistralai'), pip('mistralai')], dotenv: ['MISTRAL_'] },
  { id: 'groq', name: 'Groq', type: 'ai', dependencies: [npm('groq-sdk'), pip('groq')], dotenv: ['GROQ_'] },
  { id: 'deepseek', name: 'DeepSeek', type: 'ai', dependencies: [npm('deepseek'), pip('deepseek')], dotenv: ['DEEPSEEK_'] },
  { id: 'xai', name: 'xAI', type: 'ai', dependencies: [npm('@x-ai/sdk')], dotenv: ['XAI_'] },
  { id: 'elevenlabs', name: 'ElevenLabs', type: 'ai', dependencies: [npm('elevenlabs'), pip('elevenlabs')], dotenv: ['ELEVENLABS_'] },
  { id: 'tensorflow', name: 'TensorFlow', type: 'ai', dependencies: [npm('@tensorflow/tfjs'), pip('tensorflow')] },
  { id: 'pytorch', name: 'PyTorch', type: 'ai', dependencies: [pip('torch'), pip('pytorch')] },
  { id: 'aws-bedrock', name: 'AWS Bedrock', type: 'ai', dependencies: [npm('@aws-sdk/client-bedrock-runtime')], dotenv: ['BEDROCK_'] },
  { id: 'azure-openai', name: 'Azure OpenAI', type: 'ai', dependencies: [npm('@azure/openai')], dotenv: ['AZURE_OPENAI_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  ANALYTICS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'google-analytics', name: 'Google Analytics', type: 'analytics', dependencies: [npm('react-ga'), npm('react-ga4')], dotenv: ['GA_', 'GOOGLE_ANALYTICS_'] },
  { id: 'posthog', name: 'PostHog', type: 'analytics', dependencies: [npm('posthog-js'), npm('posthog-node'), pip('posthog')], dotenv: ['POSTHOG_', 'NEXT_PUBLIC_POSTHOG_'] },
  { id: 'segment', name: 'Segment', type: 'analytics', dependencies: [npm('@segment/analytics-next'), npm('analytics-node')], dotenv: ['SEGMENT_'] },
  { id: 'mixpanel', name: 'Mixpanel', type: 'analytics', dependencies: [npm('mixpanel'), npm('mixpanel-browser')], dotenv: ['MIXPANEL_'] },
  { id: 'amplitude', name: 'Amplitude', type: 'analytics', dependencies: [npm('@amplitude/analytics-browser'), npm('@amplitude/analytics-node')], dotenv: ['AMPLITUDE_'] },
  { id: 'plausible', name: 'Plausible', type: 'analytics', dependencies: [npm('plausible-tracker')], dotenv: ['PLAUSIBLE_'] },
  { id: 'hotjar', name: 'Hotjar', type: 'analytics', dependencies: [npm('@hotjar/browser')] },
  { id: 'fathom', name: 'Fathom', type: 'analytics', dependencies: [npm('fathom-client')], dotenv: ['FATHOM_'] },
  { id: 'vercel-analytics', name: 'Vercel Analytics', type: 'analytics', dependencies: [npm('@vercel/analytics')] },

  // ═══════════════════════════════════════════════════════════════════
  //  MONITORING / OBSERVABILITY
  // ═══════════════════════════════════════════════════════════════════
  { id: 'sentry', name: 'Sentry', type: 'monitoring', match: { files: ['.sentryclirc'] }, dependencies: [npm('@sentry/node'), npm('@sentry/browser'), npm('@sentry/react'), npm('@sentry/nextjs'), pip('sentry-sdk'), cargo('sentry'), gem('sentry-ruby')], dotenv: ['SENTRY_'] },
  { id: 'datadog', name: 'Datadog', type: 'monitoring', dependencies: [npm('dd-trace'), pip('ddtrace')], dotenv: ['DD_', 'DATADOG_'] },
  { id: 'newrelic', name: 'New Relic', type: 'monitoring', match: { files: ['newrelic.js', 'newrelic.yml'] }, dependencies: [npm('newrelic'), pip('newrelic')], dotenv: ['NEW_RELIC_', 'NEWRELIC_'] },
  { id: 'opentelemetry', name: 'OpenTelemetry', type: 'monitoring', dependencies: [npm('@opentelemetry/api'), npm('@opentelemetry/sdk-node'), pip('opentelemetry-api')], dotenv: ['OTEL_'] },
  { id: 'prometheus', name: 'Prometheus', type: 'monitoring', dependencies: [npm('prom-client'), docker('prom/prometheus')] },
  { id: 'grafana', name: 'Grafana', type: 'monitoring', dependencies: [docker('grafana/grafana')], dotenv: ['GRAFANA_'] },
  { id: 'logrocket', name: 'LogRocket', type: 'monitoring', dependencies: [npm('logrocket')], dotenv: ['LOGROCKET_'] },
  { id: 'bugsnag', name: 'Bugsnag', type: 'monitoring', dependencies: [npm('@bugsnag/js'), npm('@bugsnag/react')], dotenv: ['BUGSNAG_'] },
  { id: 'rollbar', name: 'Rollbar', type: 'monitoring', dependencies: [npm('rollbar'), pip('rollbar')], dotenv: ['ROLLBAR_'] },
  { id: 'pagerduty', name: 'PagerDuty', type: 'monitoring', dependencies: [npm('@pagerduty/pdjs')], dotenv: ['PAGERDUTY_'] },
  { id: 'betterstack', name: 'Better Stack', type: 'monitoring', dependencies: [npm('@logtail/node')], dotenv: ['LOGTAIL_', 'BETTERSTACK_'] },
  { id: 'honeybadger', name: 'Honeybadger', type: 'monitoring', dependencies: [npm('@honeybadger-io/js')], dotenv: ['HONEYBADGER_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  AUTH
  // ═══════════════════════════════════════════════════════════════════
  { id: 'auth0', name: 'Auth0', type: 'auth', dependencies: [npm('@auth0/nextjs-auth0'), npm('auth0'), npm('@auth0/auth0-react')], dotenv: ['AUTH0_'] },
  { id: 'clerk', name: 'Clerk', type: 'auth', dependencies: [npm('@clerk/nextjs'), npm('@clerk/clerk-react')], dotenv: ['CLERK_', 'NEXT_PUBLIC_CLERK_'] },
  { id: 'nextauth', name: 'NextAuth.js / Auth.js', type: 'auth', dependencies: [npm('next-auth'), npm('@auth/core')] },
  { id: 'supabase-auth', name: 'Supabase Auth', type: 'auth', dependencies: [npm('@supabase/auth-helpers-nextjs'), npm('@supabase/ssr')] },
  { id: 'firebase-auth', name: 'Firebase Auth', type: 'auth', dependencies: [npm('firebase/auth'), npm('@react-firebase/auth')] },
  { id: 'okta', name: 'Okta', type: 'auth', dependencies: [npm('@okta/okta-react'), npm('@okta/okta-auth-js')], dotenv: ['OKTA_'] },
  { id: 'kinde', name: 'Kinde', type: 'auth', dependencies: [npm('@kinde-oss/kinde-auth-nextjs')], dotenv: ['KINDE_'] },
  { id: 'better-auth', name: 'Better Auth', type: 'auth', dependencies: [npm('better-auth')] },
  { id: 'logto', name: 'Logto', type: 'auth', dependencies: [npm('@logto/next')], dotenv: ['LOGTO_'] },
  { id: 'cognito', name: 'AWS Cognito', type: 'auth', dependencies: [npm('@aws-sdk/client-cognito-identity-provider')], dotenv: ['COGNITO_'] },
  { id: 'keycloak', name: 'Keycloak', type: 'auth', dependencies: [npm('keycloak-js'), docker('keycloak/keycloak')], dotenv: ['KEYCLOAK_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  PAYMENT
  // ═══════════════════════════════════════════════════════════════════
  { id: 'stripe', name: 'Stripe', type: 'payment', dependencies: [npm('stripe'), npm('@stripe/stripe-js'), pip('stripe'), gem('stripe'), gomod('github.com/stripe/stripe-go')], dotenv: ['STRIPE_'] },
  { id: 'paypal', name: 'PayPal', type: 'payment', dependencies: [npm('@paypal/checkout-server-sdk'), npm('@paypal/react-paypal-js')], dotenv: ['PAYPAL_'] },
  { id: 'paddle', name: 'Paddle', type: 'payment', dependencies: [npm('@paddle/paddle-js')], dotenv: ['PADDLE_'] },
  { id: 'lemon-squeezy', name: 'Lemon Squeezy', type: 'payment', dependencies: [npm('@lemonsqueezy/lemonsqueezy.js')], dotenv: ['LEMONSQUEEZY_'] },
  { id: 'razorpay', name: 'Razorpay', type: 'payment', dependencies: [npm('razorpay')], dotenv: ['RAZORPAY_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  NOTIFICATION / EMAIL
  // ═══════════════════════════════════════════════════════════════════
  { id: 'sendgrid', name: 'SendGrid', type: 'notification', dependencies: [npm('@sendgrid/mail')], dotenv: ['SENDGRID_'] },
  { id: 'resend', name: 'Resend', type: 'notification', dependencies: [npm('resend')], dotenv: ['RESEND_'] },
  { id: 'mailgun', name: 'Mailgun', type: 'notification', dependencies: [npm('mailgun.js'), npm('mailgun-js')], dotenv: ['MAILGUN_'] },
  { id: 'twilio', name: 'Twilio', type: 'notification', dependencies: [npm('twilio'), pip('twilio')], dotenv: ['TWILIO_'] },
  { id: 'postmark', name: 'Postmark', type: 'notification', dependencies: [npm('postmark')], dotenv: ['POSTMARK_'] },
  { id: 'ses', name: 'AWS SES', type: 'notification', dependencies: [npm('@aws-sdk/client-ses')], dotenv: ['SES_'] },
  { id: 'novu', name: 'Novu', type: 'notification', dependencies: [npm('@novu/node')], dotenv: ['NOVU_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  CMS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'strapi', name: 'Strapi', type: 'cms', dependencies: [npm('@strapi/strapi')] },
  { id: 'sanity', name: 'Sanity', type: 'cms', dependencies: [npm('@sanity/client'), npm('sanity')], dotenv: ['SANITY_', 'NEXT_PUBLIC_SANITY_'] },
  { id: 'contentful', name: 'Contentful', type: 'cms', dependencies: [npm('contentful')], dotenv: ['CONTENTFUL_'] },
  { id: 'wordpress', name: 'WordPress', type: 'cms', match: { files: ['wp-config.php', 'wp-content'] } },
  { id: 'payload-cms', name: 'Payload CMS', type: 'cms', dependencies: [npm('payload')] },
  { id: 'ghost', name: 'Ghost', type: 'cms', dependencies: [npm('@tryghost/content-api')] },
  { id: 'datocms', name: 'DatoCMS', type: 'cms', dependencies: [npm('react-datocms')], dotenv: ['DATOCMS_', 'DATO_'] },
  { id: 'storyblok', name: 'Storyblok', type: 'cms', dependencies: [npm('@storyblok/react')], dotenv: ['STORYBLOK_'] },
  { id: 'directus', name: 'Directus', type: 'cms', dependencies: [npm('@directus/sdk')] },
  { id: 'keystone', name: 'Keystone', type: 'cms', dependencies: [npm('@keystone-6/core')] },
  { id: 'shopify', name: 'Shopify', type: 'cms', dependencies: [npm('@shopify/shopify-api'), npm('@shopify/hydrogen')], dotenv: ['SHOPIFY_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  SECURITY
  // ═══════════════════════════════════════════════════════════════════
  { id: 'snyk', name: 'Snyk', type: 'security', match: { files: ['.snyk'] } },
  { id: 'vault', name: 'HashiCorp Vault', type: 'security', dependencies: [npm('node-vault'), docker('hashicorp/vault')], dotenv: ['VAULT_'] },
  { id: 'infisical', name: 'Infisical', type: 'security', match: { files: ['.infisical.json'] }, dependencies: [npm('@infisical/sdk')], dotenv: ['INFISICAL_'] },
  { id: 'gitguardian', name: 'GitGuardian', type: 'security', match: { files: ['.gitguardian.yml'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  AUTOMATION
  // ═══════════════════════════════════════════════════════════════════
  { id: 'puppeteer-auto', name: 'Puppeteer', type: 'automation', dependencies: [npm('puppeteer')] },
  { id: 'playwright-auto', name: 'Playwright', type: 'automation', dependencies: [npm('playwright'), pip('playwright')] },
  { id: 'n8n', name: 'n8n', type: 'automation', dependencies: [npm('n8n'), docker('n8nio/n8n')] },
  { id: 'inngest', name: 'Inngest', type: 'automation', dependencies: [npm('inngest')] },
  { id: 'temporal', name: 'Temporal', type: 'automation', dependencies: [npm('@temporalio/client'), pip('temporalio')] },
  { id: 'trigger-dev', name: 'Trigger.dev', type: 'automation', dependencies: [npm('@trigger.dev/sdk')] },

  // ═══════════════════════════════════════════════════════════════════
  //  SAAS / MISC TOOLS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'socketio', name: 'Socket.IO', type: 'tool', dependencies: [npm('socket.io'), npm('socket.io-client')] },
  { id: 'trpc', name: 'tRPC', type: 'tool', dependencies: [npm('@trpc/server'), npm('@trpc/client')] },
  { id: 'graphql', name: 'GraphQL', type: 'tool', dependencies: [npm('graphql'), npm('@apollo/client'), npm('urql')] },
  { id: 'openapi', name: 'OpenAPI', type: 'tool', match: { files: ['openapi.yaml', 'openapi.json', 'swagger.yaml', 'swagger.json'] } },
  { id: 'grpc', name: 'gRPC', type: 'tool', dependencies: [npm('@grpc/grpc-js'), pip('grpcio')] },
  { id: 'mcp', name: 'Model Context Protocol', type: 'tool', dependencies: [npm('@modelcontextprotocol/sdk'), pip('mcp')] },
  { id: 'react-email', name: 'React Email', type: 'tool', dependencies: [npm('@react-email/components'), npm('react-email')] },
  { id: 'launchdarkly', name: 'LaunchDarkly', type: 'saas', dependencies: [npm('@launchdarkly/node-server-sdk')], dotenv: ['LAUNCHDARKLY_'] },
  { id: 'figma', name: 'Figma', type: 'saas', dependencies: [npm('figma-api')], dotenv: ['FIGMA_'] },

  // ═══════════════════════════════════════════════════════════════════
  //  PACKAGE MANAGERS
  // ═══════════════════════════════════════════════════════════════════
  { id: 'npm', name: 'npm', type: 'package_manager', match: { files: ['package-lock.json'] } },
  { id: 'yarn', name: 'Yarn', type: 'package_manager', match: { files: ['yarn.lock'] } },
  { id: 'pnpm', name: 'pnpm', type: 'package_manager', match: { files: ['pnpm-lock.yaml', 'pnpm-workspace.yaml'] } },
  { id: 'bun-pkg', name: 'Bun', type: 'package_manager', match: { files: ['bun.lockb', 'bunfig.toml'] } },
  { id: 'cargo-pkg', name: 'Cargo', type: 'package_manager', match: { files: ['Cargo.lock'] } },
  { id: 'pip', name: 'pip', type: 'package_manager', match: { files: ['requirements.txt'] } },
  { id: 'poetry', name: 'Poetry', type: 'package_manager', match: { files: ['poetry.lock'] }, dependencies: [pip('poetry')] },
  { id: 'pipenv', name: 'Pipenv', type: 'package_manager', match: { files: ['Pipfile.lock'] } },
  { id: 'bundler', name: 'Bundler', type: 'package_manager', match: { files: ['Gemfile.lock'] } },
  { id: 'composer-pkg', name: 'Composer', type: 'package_manager', match: { files: ['composer.lock'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  RUNTIME
  // ═══════════════════════════════════════════════════════════════════
  { id: 'nodejs', name: 'Node.js', type: 'runtime', match: { files: ['package.json', '.nvmrc', '.node-version'] } },
  { id: 'deno', name: 'Deno', type: 'runtime', match: { files: ['deno.json', 'deno.jsonc', 'deno.lock'] } },
  { id: 'bun-rt', name: 'Bun', type: 'runtime', match: { files: ['bun.lockb', 'bunfig.toml'] } },

  // ═══════════════════════════════════════════════════════════════════
  //  APP / INFRASTRUCTURE IMAGES
  // ═══════════════════════════════════════════════════════════════════
  { id: 'nginx', name: 'Nginx', type: 'app', match: { files: ['nginx.conf'] }, dependencies: [docker('nginx')] },
  { id: 'caddy', name: 'Caddy', type: 'app', match: { files: ['Caddyfile'] }, dependencies: [docker('caddy')] },
  { id: 'traefik', name: 'Traefik', type: 'app', dependencies: [docker('traefik')] },
  { id: 'kong', name: 'Kong', type: 'app', dependencies: [docker('kong')] },
  { id: 'haproxy', name: 'HAProxy', type: 'app', dependencies: [docker('haproxy')] },
  { id: 'vault-app', name: 'HashiCorp Vault', type: 'app', dependencies: [docker('hashicorp/vault')] },
  { id: 'consul', name: 'Consul', type: 'app', dependencies: [docker('consul')] },
  { id: 'zookeeper', name: 'Zookeeper', type: 'app', dependencies: [docker('zookeeper')] },
  { id: 'kibana', name: 'Kibana', type: 'app', dependencies: [docker('kibana')] },
];

