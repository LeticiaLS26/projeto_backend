// 1. ACHAR e MUDAR
const titulo = document.querySelector("#titulo");
const statusEl = document.querySelector("#status");
const contadorEl = document.querySelector("#contador");
const listaLivros = document.querySelector("#lista-livros");

titulo.textContent = "XYZ Bookstore (Ensaio DOM)";
statusEl.textContent = "Pronto para selecionar livros.";

// Dados locais (mesmo formato da API)
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
  {
    id: "it-a-coisa",
    titulo: "It: A Coisa",
    autor: "Stephen King",
    descricao: "Um grupo de amigos enfrenta uma entidade maligna em Derry.",
    preco: 79.9,
  },
];

// 2. GERAR: transformar array de objetos em HTML
listaLivros.innerHTML = livros
  .map(
    (l) => `
    <li>
      <strong>${l.titulo}</strong> — R$ ${l.preco.toFixed(2)}
      <button class="buy-now" data-id="${l.id}">Buy Now</button>
    </li>
  `
  )
  .join("");

// 3. OUVIR: delegação de eventos no container pai (<ul>)
let total = 0;

listaLivros.addEventListener("click", (evento) => {
  const btn = evento.target.closest(".buy-now");
  if (!btn) return; // Ignora cliques fora do botão

  total++;
  const idLivro = btn.dataset.id;

  console.log("clicou:", idLivro);
  statusEl.textContent = `Último clicado: ${idLivro}`;
  contadorEl.textContent = `Cliques no carrinho: ${total}`;
});
