# GitHub Workflows

This directory contains GitHub Actions workflows for the project.

## Available Workflows

### Component and Integration Tests (`test.yml`)

This workflow runs component and integration tests when code is pushed to the main branch or when a pull request is created against the main branch.

#### What it does:

1. Checks out the repository code
2. Sets up Node.js 22
3. Installs dependencies with `npm ci`
4. Runs component tests with `npm run test:components`
5. Runs integration tests with `npm run test:flows`
6. Uploads test results as artifacts

#### Excluded Tests:

- E2E tests are deliberately excluded from this workflow

#### Running Tests Manually:

- Component tests: `npm run test:components`
- Integration tests: `npm run test:flows`
- E2E tests: 
  - iOS: `npm run e2e:test:ios`
  - Android: `npm run e2e:test:android` 