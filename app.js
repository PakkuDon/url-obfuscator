require('dotenv').config()

const crypto = require('crypto')
const express = require('express')
const morgan = require('morgan')
const db = require('./db')

const app = express()

const PORT = process.env.PORT || 3000

app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send('Hello World')
})

app.get('/:id', (request, response) => {
  const hash = request.params.id

  db.query('SELECT * FROM links WHERE hash = $1', [hash])
    .then(result => {
      if (result.rows.length === 0) {
        response.sendStatus(404)
        return
      }
      const originalUrl = result.rows[0].link
      response.redirect(originalUrl)
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

app.post('/api/links', (request, response) => {
  const urlToTransform = request.body.url

  if (!urlToTransform) {
    response.sendStatus(400)
    return
  }

  const urlHash = crypto.createHash('sha512')
    .update(urlToTransform)
    .digest('hex')

  db.query(`
    INSERT INTO links
    (hash, link, created_at)
    VALUES ($1, $2, NOW())
  `, [urlHash, urlToTransform])
    .then(result => {
      response.status(201).json({
        url: urlToTransform,
        new_url: new URL(urlHash, `https://${request.hostname}`)
      })
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

app.listen(PORT, () => {
  console.log(`Listening at https://localhost:${PORT}`)
})