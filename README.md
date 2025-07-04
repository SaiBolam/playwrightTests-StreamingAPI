### TO run there Playwright test we need to access the APIS and Mock server 
### Also we need to start the Mockserver prior to strating playwright tests 
### Access the API's and Mock Server from here -

#### Install Playwright & Select Configurations follow below instructions
- npm init playwright@latest

Playwright will download the browsers needed as well as create the following files.

- node_modules
- playwright.config.js
- package.json
- package-lock.json
- tests/
    example.spec.js
- tests-examples/
    demo-todo-app.spec.js

#### dotenv Package Installation Command
- npm install dotenv --save

#### csv-parse Package Installation Command
- npm install csv-parse

#### faker-js plugin for test data generation
- npm install @faker-js/faker --save-dev

#### luxon plugin for custom dates
- npm install --save luxon

## Playwright Important Commands

  npx playwright install
   - Install Browsers manually.
    
  npx playwright test
   - Runs the end-to-end tests.

  npx playwright test --ui
   - Starts the interactive UI mode.

  npx playwright test --project=chromium
   - Runs the tests only on Desktop Chrome.

  npx playwright test example
  -  Runs the tests in a specific file.

  npx playwright test --debug
  - Runs the tests in debug mode.

  npx playwright codegen
- Auto generate tests with Codegen.

To start your tests begin by typing:

    npx playwright test

###  TO views your test executions as Report we need to install and use Allure Report 
- Step1: Install Allure Report  via command-line tool
  ### npm install --save-dev allure-commandline
  
- Step2: Install the Allure Playwright adapter.
  ### npm install --save-dev allure-playwright

- Step3: Add below config in playwright.config.js file.
  ### reporter:[
  ### ['html'],
  ### ['allure-playwright']
  ### ],

- Step4: Run Playwright tests.
  ### npx playwright test

- Step5: Generate Allure Report
  ### npx allure serve allure-results