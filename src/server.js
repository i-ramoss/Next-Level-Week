const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")

// configuração de pasta pública
server.use(express.static("public"))

// habilitar o uso do require.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

// utilizando template engines
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

// rota para a página home
server.get("/", (require, response) => {
  return response.render("index.html")
})


// rota para a página de cadastro
server.get("/create-point", (require, response) => {

  // require.query: query string da URL
  // console.log(require.query)


  return response.render("create-point.html")
})


server.post("/savepoint", (require, response) => {

  // require.body: O corpo do nosso formulário
  // console.log(require.body)

  // inserir dados no banco de dados
  const query = `
    INSERT INTO places (
      image, 
      name,
      adress,
      adress2,
      state,
      city,
      items
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `

  const values = [
    require.body.image,
    require.body.name,
    require.body.adress,
    require.body.adress2,
    require.body.state,
    require.body.city,
    require.body.items
  ]

  function afterInsertData(err) {
    if (err) {
      console.log(err)
      return response.send("Erro no cadastro")
    }

    console.log("Cadastrado com sucesso")
    console.log(this)

    return response.render("create-point.html", { saved: true })
  }

  db.run(query, values, afterInsertData) // responsável por inserir os dados na tabela
})



// rota para a página de resultados de pesquisa
server.get("/search", (require, response) => {

  const search = require.query.search

  if (search == "") {

    // pesquisa vazia
    return response.render("search-results.html", { total: 0})
  }

  

  // pegar os dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err)
      return console.log(err)

    // total de elementos do array
    const total = rows.length

    // mostrar a página html com os dados do banco de dados
    return response.render("search-results.html", { places: rows, total})
  })
})

// ativar o servidor na porta 3000
server.listen(3000)