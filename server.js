const http = require("node:http");

const livros = [{
    titulo: "O corvo",
    autor: "Edgar Allan Poe",
    preco: 69.90
}];

http.createServer((req, res) => {
    let corpo, status = 200;
    if (req.url === "/") {
        corpo = "Bem-vindo a API da XYZ Bookstore";
    } else if (req.url === "/livros") {
        corpo = JSON.stringify(livros);
    } else if (req.url === "/carrinho") {
        corpo = "Rota do carrinho - em construcao.";
    } else {
        status = 404;
        corpo = JSON.stringify({ erro: "rota inexistente" });
    }

    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end("<h1>XYZ Bookstore</h1><p>Livraria.</p>");
}).listen(3000);

//console.log("XYZ Bookstore no ar em http://localhost:3000/livros");

