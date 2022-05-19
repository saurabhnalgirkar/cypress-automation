/// <reference types="cypress" />

describe('Mathworks Landing Page Validation', () => {
  
    it('Task 03 : Verify Broken Links on Mathworks landing page', function() {
  
      cy.visit('https://www.mathworks.com/')
  
      var brokenLinkStatusCodes = [400, 401, 403, 404, 405, 408, 409, 410, 412, 429, 500, 502, 503]
  
      cy.get('a[href]').each(link => {
  
        cy.request({
          url: link.prop('href'),
          failOnStatusCode: false 
        }).then((response) => {
          if (response.status == 200) {
            cy.log(response.status)
          } else if (brokenLinkStatusCodes.includes(response.status)) {
            cy.log(response.status)
            throw new Error("Link is broken")
          }
        })
      })

    })
  
  })
  
  
  
