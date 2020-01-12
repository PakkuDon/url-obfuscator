const db = require('../db')

class LinkRepository {
  findByHash(hash) {
    return db.query('SELECT * FROM links WHERE hash = $1', [hash])
  }

  create(link) {
    return db.query(`
      INSERT INTO links
      (hash, link, created_at)
      VALUES ($1, $2, NOW())
    `, [link.hash, link.original_url])
  }
}

module.exports = LinkRepository
