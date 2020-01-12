require('dotenv').config()

const crypto = require('crypto')
const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const marked = require('marked')
const LinkRepository = require('./repositories/LinkRepository')
const RedirectRepository = require('./repositories/RedirectRepository')

const app = express()
const linkRepository = new LinkRepository()
const redirectRepository = new RedirectRepository()
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3000

app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  fs.readFile('./README.md', 'utf8', (error, data) => {
    if (error) {
      response.sendStatus(500)
      return
    }

    response.render('index', { readme: marked(data) })
  })
})

app.get('/:id', (request, response) => {
  const hash = request.params.id

  linkRepository.findByHash(hash)
    .then(result => {
      if (result.rows.length === 0) {
        response.sendStatus(404)
        return
      }
      const resolvedLink = result.rows[0]
      const originalUrl = resolvedLink.link

      redirectRepository.create({ link_id: resolvedLink.id })
        .then(() => {
          response.redirect(originalUrl)
        })
        .catch(error => {
          console.error(error)
          response.sendStatus(500)
        })
    })
    .catch(error => {
      console.error(error)
      response.sendStatus(500)
    })
})

app.get('/:id/info', (request, response) => {
  const hash = request.params.id

  linkRepository.findByHash(hash)
  .then(linkQueryResult => {
    if (linkQueryResult.rows.length === 0) {
      response.sendStatus(404)
      return
    }
    const resolvedLink = linkQueryResult.rows[0]
    const originalUrl = resolvedLink.link

    redirectRepository.findByLinkId(resolvedLink.id)
      .then((redirectQueryResult) => {
        response.status(201).json({
          urlInfo: {
            original_url: originalUrl,
            obfuscated_url: new URL(resolvedLink.hash, `${request.protocol}://${request.hostname}`)
          },
          redirects: {
            count: redirectQueryResult.rows.length,
            last_visited_at: redirectQueryResult.rows[0] ? redirectQueryResult.rows[0].visited_at : null,
          },
        })
      })
      .catch(error => {
        console.error(error)
        response.sendStatus(500)
      })
  })
  .catch(error => {
    console.error(error)
    response.sendStatus(500)
  })
})

app.post('/api/links', (request, response) => {
  const urlToTransform = request.body.url
  const nonce = Math.random()

  if (!urlToTransform) {
    response.sendStatus(400)
    return
  }

  const urlHash = crypto.createHash('sha512')
    .update(urlToTransform + nonce)
    .digest('hex')

  linkRepository.create({ hash: urlHash, original_url: urlToTransform })
    .then(result => {
      const newUrl = new URL(urlHash, `${request.protocol}://${request.hostname}`)
      response.status(201).json({
        url: urlToTransform,
        new_url: newUrl,
        metadata_url: `${newUrl}/info`,
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