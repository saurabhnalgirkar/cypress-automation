/// <reference types="cypress" />

describe('Mathworks Search Page Validation', () => {

    beforeEach(() => {
        cy.visit('https://www.mathworks.com/search.html?c%255B%255D=entire_site&c[]=entire_site&q=matlab&page=1')
      })

    const resultsUrl = "https://www.mathworks.com/searchresults/results?page=1&rows=10&facet.limit=100&c%5B%5D=entire_site&facets=&sort=score+desc&site_domain=www&site_language=en&fl=asset_id%2C+subcollection%2C+asset_type%2C+asset_type_name%2C+id%2C+asset_language%2C+url%2C+updated_at%2C+thumbnail%2C+title_*%2C+primary_header_*%2C+meta_description_*%2C+answers_count%2C+author%2C+blog_title%2C+blog_title_url%2C+breadcrumb_display%2C+breadcrumb_url%2C+byline_text%2C+caption_language%2C+comments_count%2C+community_tag%2C+companion_materials%2C+company_name%2C+copyright%2C+course_level_facet%2C+downloads%2C+fixed_in%2C+hardware-support-custom-tags%2C+hardware-support-vendor%2C+instructor_led_description_*%2C+instructor_led_topic%2C+instructor_led_certification%2C+pub_date%2C+publisher%2C+rating%2C+ratings_count%2C+secondary_header_*%2C+status%2C+tag%2C+tag_url%2C+title%2C+vendor_display%2C+video_duration%2C+views_count%2C+votes_count%2C+workaround&q=matlab"
    const resultsLabel = ".search_results_label"
    const topRightTotalResults = "#result_summary_top > .add_font_color_mediumgray > .add_margin_0"
    const allBreadcrumbUrlsOnFirstPage = "div[id='results_container'] p[class='search_result_title'] a"

    it('Task 04a : Compare Total Results Count On UI With numFound Value In API', function() {

        cy.get(resultsLabel).invoke('text')
        .then((resultsLabelText) => {
          cy.intercept('GET', resultsUrl, ($requset) => {
            $requset.reply(($response) => {
              expect($response.statusCode).to.equal(200) // to make sure the request was successful
              expect(resultsLabelText).contains($response.body.response.numFound) // to make sure the price actually matches the response captured 
            })
          }).as('totalResults')
          cy.visit('https://www.mathworks.com/search.html?c%255B%255D=entire_site&c[]=entire_site&q=matlab&page=1')
          cy.wait('@totalResults')
        })

        cy.get(topRightTotalResults).invoke('text')
        .then((topRightResultsLabelText) => {
          cy.intercept('GET', resultsUrl, ($requset) => {
            $requset.reply(($response) => {
              expect($response.statusCode).to.equal(200) // to make sure the request was successful
              expect(topRightResultsLabelText).contains($response.body.response.numFound) // to make sure the price actually matches the response captured 
            })
          }).as('topRightResultsLabel')
      
          cy.visit('https://www.mathworks.com/search.html?c%255B%255D=entire_site&c[]=entire_site&q=matlab&page=1')
          cy.wait('@topRightResultsLabel')
        })

    })

    it('Task 04b : Compare Search Result Urls On UI With Url Attribute In API', function() {

        // Verify Links are not broken
        cy.get(allBreadcrumbUrlsOnFirstPage).each(link => {
            cy.log(link.prop('href'))
            cy.request({
                url: link.prop('href'),
                failOnStatusCode: false
              }).then((response) => {
                expect(response.status).to.equal(200)
            })
        })

        // Verify url attribute captured from the UI match values in API response
        cy.get(allBreadcrumbUrlsOnFirstPage).each((link, indexNumber) => {
            cy.request({
                method: 'GET',
                url: resultsUrl
            }).then((response) => {
                expect(response.status).to.equal(200)
                cy.log(response.body.response.docs[indexNumber].url)
                expect(link.prop('href')).contains(response.body.response.docs[indexNumber].url)
            })
        })

    })

  })
  
  
  
