# Playwright Test Data Module

Reusable test data for Playwright and other automation projects.

## Installation

Install directly from GitHub in any Node.js project:

```
npm install git+https://github.com/your-username/playwright-test-data-module.git
```

## Usage

```js
const { authTokenData } = require('playwright-test-data-module');
console.log(authTokenData);
```

## Adding More Test Data

- Place additional test data files in the `test-data/` directory.
- Export them from `index.js` for easy access.
