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
})