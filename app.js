const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

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

// GET /livros (com filtro opcional ?autor=)
app.get("/livros", (req, res) => {
  const autor = req.query.autor;
  const lista = autor
    ? livros.filter((l) => l.autor.toLowerCase().includes(autor.toLowerCase()))
    : livros;
  res.json(lista);
});

// GET /livros/:id
app.get("/livros/:id", (req, res) => {
  const livro = livros.find((l) => l.id === req.params.id);
  if (!livro) {
    return res.status(404).json({ erro: "livro nao encontrado" });
  }
  res.json(livro);
});

// GET /carrinho
app.get("/carrinho", (req, res) => {
  res.json(montarItensCarrinho());
});

// POST /carrinho
app.post("/carrinho", (req, res) => {
  const dados = req.body;

  if (!dados.livroId || dados.quantidade === undefined) {
    return res.status(400).json({ erro: "faltam campos obrigatorios: livroId, quantidade" });
  }

  const livro = livros.find((l) => l.id === dados.livroId);
  if (!livro) {
    return res.status(400).json({ erro: "livro inexistente: " + dados.livroId });
  }

  if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
    return res.status(400).json({ erro: "quantidade deve ser um numero inteiro maior que zero" });
  }

  const existente = carrinho.find((c) => c.livroId === dados.livroId);
  if (existente) {
    existente.quantidade += dados.quantidade;
  } else {
    carrinho.push({
      livroId: dados.livroId,
      quantidade: dados.quantidade,
    });
  }

  const qtdAtual = existente ? existente.quantidade : dados.quantidade;
  const itemEnriquecido = {
    livroId: livro.id,
    titulo: livro.titulo,
    preco: livro.preco,
    quantidade: qtdAtual,
    subtotal: Number((livro.preco * qtdAtual).toFixed(2)),
  };

  res.status(201).json({
    item: itemEnriquecido,
    carrinho: montarItensCarrinho(),
  });
});

// DELETE /carrinho/:id
app.delete("/carrinho/:id", (req, res) => {
  const indice = carrinho.findIndex((c) => c.livroId === req.params.id);
  if (indice === -1) {
    return res.status(404).json({ erro: "item nao encontrado no carrinho: " + req.params.id });
  }

  carrinho.splice(indice, 1);
  res.status(200).json(montarItensCarrinho());
});

// POST /checkout
app.post("/checkout", (req, res) => {
  if (carrinho.length === 0) {
    return res.status(400).json({ erro: "carrinho vazio" });
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

  res.status(200).json(pedido);
});

// GET /pedidos
app.get("/pedidos", (req, res) => {
  res.json(pedidos);
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ erro: "rota inexistente" });
});

// Middleware de erro JSON
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "corpo nao e JSON valido" });
  }
  res.status(500).json({ erro: "falha interna" });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`XYZ Bookstore (Express) no ar em http://localhost:${PORTA}`);
});
