const http = require("node:http");

function enviar(res, status, corpo) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(corpo));
}

const livros = [
  {
    id: "sally-adventure-book",
    titulo: "Sally's SciFi Adventure",
    autor: "A. Writer",
    descricao: "This is an epic story of Sally and her dog Rex as they navigate through other worlds.",
    preco: 39.9,
  },
  {
    id: "dave-cooking-book",
    titulo: "Dave's Cooking Adventure",
    autor: "D. Chef",
    descricao: "This is the story of Dave as he learns to cook everything from pancakes to pasta, one recipe at a time.",
    preco: 29.5,
  },
];

const carrinho = [];
const pedidos = [];

function montarItensCarrinho() {
  return carrinho.map((c) => {
    const livro = livros.find((l) => l.id === c.livroId);
    return {
      ...c,
      titulo: livro.titulo,
      preco: livro.preco,
      subtotal: Number((livro.preco * c.quantidade).toFixed(2)),
    };
  });
}

const servidor = http.createServer((req, res) => {
  const [caminho, query] = req.url.split("?");
  const params = new URLSearchParams(query || "");
  const partes = caminho.split("/");

  // GET /livros (com filtro opcional ?autor=)
  if (caminho === "/livros" && req.method === "GET") {
    const autor = params.get("autor");
    const lista = autor
      ? livros.filter((l) => l.autor.toLowerCase().includes(autor.toLowerCase()))
      : livros;
    return enviar(res, 200, lista);
  }

  // GET /livros/:id
  if (partes[1] === "livros" && partes[2] && req.method === "GET") {
    const livro = livros.find((l) => l.id === partes[2]);
    if (livro) {
      return enviar(res, 200, livro);
    }
    return enviar(res, 404, { erro: "livro nao encontrado" });
  }

  // GET /carrinho (enriquecido com título, preço e subtotal)
  if (caminho === "/carrinho" && req.method === "GET") {
    return enviar(res, 200, montarItensCarrinho());
  }

  // POST /carrinho
  if (caminho === "/carrinho" && req.method === "POST") {
    let bruto = "";
    req.on("data", (pedaco) => {
      bruto += pedaco;
    });
    req.on("end", () => {
      let dados;
      try {
        dados = JSON.parse(bruto);
      } catch {
        return enviar(res, 400, { erro: "corpo nao e JSON valido" });
      }

      if (!dados.livroId || dados.quantidade === undefined) {
        return enviar(res, 400, { erro: "faltam campos obrigatorios: livroId, quantidade" });
      }

      const livro = livros.find((l) => l.id === dados.livroId);
      if (!livro) {
        return enviar(res, 400, { erro: "livro inexistente: " + dados.livroId });
      }

      if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
        return enviar(res, 400, { erro: "quantidade deve ser um numero inteiro maior que zero" });
      }

      const item = {
        livroId: dados.livroId,
        quantidade: dados.quantidade,
      };
      carrinho.push(item);

      return enviar(res, 201, { item, carrinho: montarItensCarrinho() });
    });
    return;
  }

  // POST /checkout
  if (caminho === "/checkout" && req.method === "POST") {
    if (carrinho.length === 0) {
      return enviar(res, 400, { erro: "carrinho vazio" });
    }

    const itens = montarItensCarrinho();
    const total = Number(itens.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2));
    const pedido = {
      numero: Date.now(),
      itens,
      total,
    };

    pedidos.push(pedido);
    carrinho.length = 0;

    return enviar(res, 200, pedido);
  }

  // GET /pedidos
  if (caminho === "/pedidos" && req.method === "GET") {
    return enviar(res, 200, pedidos);
  }

  // 404 para qualquer outra rota/método
  return enviar(res, 404, { erro: "rota inexistente" });
});

const PORTA = process.env.PORT || 3000;
servidor.listen(PORTA, () => {
  console.log(`XYZ Bookstore no ar em http://localhost:${PORTA}`);
});

console.log("XYZ Bookstore no ar em http://localhost:3000");
