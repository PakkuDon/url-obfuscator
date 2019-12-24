require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const app = express()

const PORT = process.env.PORT || 3000

app.use(morgan('combined'))

app.get('/', (request, response) => {
  response.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Listening at https://localhost:${PORT}`)
})