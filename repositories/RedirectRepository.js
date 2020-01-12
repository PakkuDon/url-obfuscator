const db = require('../db')

class RedirectRepository {
  findByLinkId(linkId) {
    return db.query(`
      SELECT *
      FROM redirects
      WHERE link_id = $1
      ORDER BY visited_at DESC
    `, [linkId])
  }

  create(redirect) {
    return db.query(`
    INSERT INTO redirects
    (link_id, visited_at)
    VALUES ($1, NOW())
    `, [redirect.link_id])
  }
}

module.exports = RedirectRepository
