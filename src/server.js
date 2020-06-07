const express = require("express")
const server = express()

// configuração de pasta pública
server.use(express.static("public"))

// utilizando template engines
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

server.get("/", (require, response) => {
  return response.render("index.html")
})

server.get("/create-point", (require, response) => {
  return response.render("create-point.html")
})

server.get("/search", (require, response) => {
  return response.render("search-results.html")
})

server.listen(3000)