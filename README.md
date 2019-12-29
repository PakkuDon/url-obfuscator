# URL Obfuscator

Like Bitly, but less useful. Generates a redirect to the provided link.

Initially inspired by a terrible startup idea but later realised this was going to be quite similar to [another past side project](https://github.com/PakkuDon/LinkIt), so I stopped.

## API

```
GET /
```
- Returns this document

```
POST /api/links
```
- Generates a redirect link for the provided URL
- URL should be supplied in request body `url` parameter
- Example usage
```sh
curl http://localhost:3000/api/links \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com"}'
```
- Example output
```json
{
  "url": "https://example.com",
  "new_url": "http://localhost/a0e91d3a61a1208e445ad6f3b19c2e3ae36e4a36f3d4edc78828b52c1d9ddabec94ac291e4ea7f8f3609f1972451df7284ee90edf8875b42e42083eb0f352c97"
}
```

```
GET /:hash
```
- Redirects to original URL with matching hash if found
- Returns 404 if hash cannot be resolved to another URL

```
GET /:hash/info
```
- Returns meta information about original URL with matching hash
- Returns 404 if hash cannot be resolved to another URL

## Tech Stack
- Node.js
- ExpressJS
- PostgreSQL

## Local development
- Clone this repository

### Set up database
- Copy `.env.development` to `.env`
- Configure PostgreSQL credentials in `.env`
- Create PostgreSQL database. Database name should be the same as the value of `PGDATABASE` in `.env`
- Run commands from `db_create.sql` against database created in above step

### Set up server
- Run `yarn` to install dependencies
- Run `yarn start` to start web server