// Custom server for Railway — explicitly binds to process.env.PORT
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev  = process.env.NODE_ENV !== "production"
const host = "0.0.0.0"
const port = parseInt(process.env.PORT || "3000", 10)

const app    = next({ dev, hostname: host, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  }).listen(port, host, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${host}:${port}`)
    console.log(`> NODE_ENV: ${process.env.NODE_ENV}`)
  })
})
