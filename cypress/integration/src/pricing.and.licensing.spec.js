/// <reference types="cypress" />

describe('Mathworks Pricing and Licensing Validation', () => {

  // Element Selectors
  const matlabLink = "div[id='content_container'] div[class='container'] h2 > a[class='product_name']"
  const perpetualLicenseText = ".col-sm-5.standard-tab > .add_margin_40_xs > .panel > .panel-body > :nth-child(1) > .price_show > :nth-child(1) > label > .h3 > .h4"
  const perpetualLicensePrice = ".col-sm-5.standard-tab > .add_margin_40_xs > .panel > .panel-body > :nth-child(1) > .price_show > :nth-child(1) > label > .h3 > .price"
  const annualLicenseText = ".col-sm-5.standard-tab > .add_margin_40_xs > .panel > .panel-body > :nth-child(1) > .price_show > :nth-child(2) > label > .h3 > .h4"
  const annualLicensePrice = ".col-sm-5.standard-tab > .add_margin_40_xs > .panel > .panel-body > :nth-child(1) > .price_show > :nth-child(2) > label > .h3 > .price-annual"
  const buyNowButton = ".col-sm-5.standard-tab > .add_margin_40_xs > .panel > .panel-body > .buy_now_button > .buy-now"

  beforeEach(() => {
    cy.visit('https://www.mathworks.com/pricing-licensing.html?prodcode=ML')
  })

  it('Task 01 : Validate Matlab Product Details Box', function() {

    cy.get(matlabLink).invoke('attr', 'href').should('eq', 'https://www.mathworks.com/products/matlab.html')

    // Validate perpetual license text
    cy.get(perpetualLicenseText).should('contain.text', 'Perpetual license')

    // Validate perpetual license price
    cy.get(perpetualLicensePrice).should('contain.text', 'USD 2,200')

    // Validate annual license text
    cy.get(annualLicenseText).should('contain.text', 'Annual license')

    // Validate annual license price
    cy.get(annualLicensePrice).should('contain.text', 'USD 880')

    // Buy Now button is not equal to 'https://www.mathworks.com/store/link/products/standard/ML' but rather is '/store/link/products/standard/ML'
    cy.get(buyNowButton).invoke('attr', 'href').should('eq', '/store/link/products/standard/ML')

    // Navigate to the page by clicking on buy now button and validate resolved URL
    cy.get(buyNowButton).click()
    cy.url().should('eq', 'https://www.mathworks.com/store/link/products/standard/ML')
    
  })

  it('Task 02 : Compare Pricing Value Displayed on UI', function() {

    // Validate the price coming from the API
    cy.request({
      method: 'GET',
      url: 'https://www.mathworks.com/content/mathworks/www/en/pricing-licensing/jcr:content.product.json?baseCode=ML'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.commercial.price).to.equal('USD 2,200')
      expect(response.body.commercialAnnual.price).to.equal('USD 880')
    })

    // Validate perpetual license price coming from API and compare it with UI
    cy.get(perpetualLicensePrice).invoke('text')
    .then((perpetualPrice) => {
      cy.intercept('GET', 'https://www.mathworks.com/content/mathworks/www/en/pricing-licensing/jcr:content.product.json?baseCode=ML', ($requset) => {
        $requset.reply(($response) => {
          expect($response.statusCode).to.equal(200) // to make sure the request was successful
          expect($response.body.commercial.price).to.equal(perpetualPrice) // to make sure the price actually matches the response captured 
        })
      }).as('getPerpetualPriceForLicenses')
  
      cy.visit('https://www.mathworks.com/pricing-licensing.html?prodcode=ML')
      cy.wait('@getPerpetualPriceForLicenses')
    })

    // Validate annual license price and compare it with UI
    cy.get(annualLicensePrice).invoke('text')
    .then((annualPrice) => {
      cy.intercept('GET', 'https://www.mathworks.com/content/mathworks/www/en/pricing-licensing/jcr:content.product.json?baseCode=ML', ($requset) => {
        $requset.reply(($response) => {
          expect($response.statusCode).to.equal(200) // to make sure the request was successful
          expect($response.body.commercialAnnual.price).to.equal(annualPrice) // to make sure the price on UI actually matches the response captured 
        })
      }).as('getAnnualPriceForLicenses')
  
      cy.visit('https://www.mathworks.com/pricing-licensing.html?prodcode=ML')
      cy.wait('@getAnnualPriceForLicenses')
    })

  })

})


