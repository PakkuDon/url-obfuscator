const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  query: (queryString, params) => (
    pool.query(queryString, params)
  )
}
