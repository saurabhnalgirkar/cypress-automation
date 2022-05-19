# Introduction
Test specs are written for validating specific aspects of Mathworks pricing and licensing page, Mathworks landing page and search results page using Cypress outlined in the take home assignment.

# Pre-requisites
This project assumes following pre-requisites are installed
- Node.js
- Cypress (https://docs.cypress.io/guides/getting-started/installing-cypress#What-you-ll-learn)

# Instructions
The source `cypress/integration/src/` consists of three specs/scripts.
 - Task 01 and Task 02 : `pricing.and.licensing.spec.js`
 - Task 03 : `mathworks.landing.page.spec.js`
 - Task 04 : `matlab.search.spec.js`

Navigate to `cypress-automation` directory

Run `npx cypress open` in termnial which will launch the test runner

# Observations 
For `Task 03` which checks for broken links on mathorks landing page has a LinkedIn URL which returns a 999 status code. This is a non-standard status code which does not permit sending requests. The logic implemented in the `mathworks.landing.page.spec.js` is to get all links on the page and fail upon receving a client error response status code. This was overcome by setting (`failOnStatusCode: false `) and implementing a condition for failure.

For `Task 04b` which validates all breadcrumb_urls is currently failing in `matlab.search.spec.js` since in the 'response.docs' array, not all JSON objects have 'breadcrumb_url' parameter. It works for a few but not for others. If that's expected, the this might require a brute force approach and not an iterative approach which I implemented assuming that the doc index matches with link elements array in UI.

# Documentation
- https://www.cypress.io/
- https://docs.cypress.io/guides/core-concepts/introduction-to-cypress
- https://docs.cypress.io/guides/getting-started/writing-your-first-test
- https://github.com/cypress-io/cypress-example-recipes