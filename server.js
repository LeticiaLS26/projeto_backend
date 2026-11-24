const http = require("node:http");

const livros = [
  {
    id: "sally-adventure-book",
    titulo: "As Aventuras de Sally",
    autor: "A. Writer",
    descricao: "Uma expedição que muda tudo.",
    preco: 39.9,
  },
  {
    id: "dave-cooking-book",
    titulo: "A Cozinha do Dave",
    autor: "D. Chef",
    descricao: "Receitas para quem queimou a primeira.",
    preco: 29.5,
  },
];

const servidor = http.createServer((req, res) => {
  const [caminho, query] = req.url.split("?");
  const params = new URLSearchParams(query || "");
  const partes = caminho.split("/");

  let corpo;
  let status = 200;

  if (caminho === "/") {
    corpo = JSON.stringify({ mensagem: "Bem-vindo a API da XYZ Bookstore" });
  } else if (caminho === "/livros") {
    const autor = params.get("autor");
    const resultado = autor
      ? livros.filter((l) => l.autor.toLowerCase().includes(autor.toLowerCase()))
      : livros;
    corpo = JSON.stringify(resultado);
  } else if (partes[1] === "livros" && partes[2]) {
    const livro = livros.find((l) => l.id === partes[2]);
    if (livro) {
      corpo = JSON.stringify(livro);
    } else {
      status = 404;
      corpo = JSON.stringify({ erro: "livro nao encontrado" });
    }
  } else if (caminho === "/carrinho") {
    corpo = JSON.stringify({ mensagem: "Rota do carrinho - em construcao" });
  } else {
    status = 404;
    corpo = JSON.stringify({ erro: "rota inexistente" });
  }

  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(corpo);
});

servidor.listen(3000);
console.log("XYZ Bookstore no ar em http://localhost:3000");
