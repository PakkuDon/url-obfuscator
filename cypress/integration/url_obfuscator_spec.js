describe('URL Obfuscator', () => {
  describe('GET /', () => {
    it('returns API documentation', () => {
      cy.visit('/')
      cy.get('body')
        .should('contain', 'GET /')
        .should('contain', 'POST /api/links')
        .should('contain', 'GET /:hash')
        .should('contain', 'GET /:hash/info')
    })
  })

  describe('POST /api/links', () => {
    it('returns a JSON response', () => {
      cy.request('POST', '/api/links', { url: 'https://example.com' })
        .its('headers')
        .its('content-type')
        .should('contain', 'application/json')
    })

    it('returns a redirect to the original URL', () => {
      cy.request('POST', '/api/links', { url: 'https://example.com' })
        .its('body')
        .then(response => {
          cy.request({ url: response.new_url, followRedirect: false })
            .then(response => {
              expect(response.status).to.eq(302)
              expect(response.redirectedToUrl).to.include('https://example.com')
            })
        })
    })

    context('when given the same link', () => {
      it('generates a different URL for each request', () => {
        cy.request('POST', '/api/links', { url: 'https://example.com' })
          .its('body')
          .its('new_url')
          .then(firstResult => {
            cy.request('POST', '/api/links', { url: 'https://example.com' })
              .its('body')
              .then(response => {
                expect(response.new_url).not.to.eq(firstResult)
              })
          })
      })
    })
  })
})