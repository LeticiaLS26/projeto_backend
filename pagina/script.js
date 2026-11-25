const API_URL = "http://localhost:3000";

const cardContainer = document.querySelector(".card-container");
const carrinhoView = document.querySelector("#carrinho-view");
const mensagemStatus = document.querySelector("#mensagem-status");

function mostrarMensagem(texto, isErro = false) {
  mensagemStatus.style.color = isErro ? "#c0392b" : "#27ae60";
  mensagemStatus.textContent = texto;
}

function montarCard(livro, index) {
  const classeDestaque = index === 0 ? " destaque" : "";
  return `
    <div class="card${classeDestaque}" id="${livro.id}">
      <h2>${livro.titulo}</h2>
      <p><strong>Autor:</strong> ${livro.autor}</p>
      <p>${livro.descricao}</p>
      <p class="preco">R$ ${livro.preco.toFixed(2)}</p>
      <button class="btn buy-now" data-id="${livro.id}">Buy Now</button>
    </div>
  `;
}

function renderizarCarrinho(itens) {
  if (itens.length === 0) {
    carrinhoView.innerHTML = "<p>O carrinho está vazio.</p>";
    return;
  }

  const totalGeral = itens.reduce((soma, item) => soma + item.subtotal, 0);

  carrinhoView.innerHTML = `
    <h3>Seu Carrinho</h3>
    <ul>
      ${itens
        .map(
          (item) => `
          <li style="margin-bottom: 8px;">
            <strong>${item.titulo}</strong> — Qtd: ${item.quantidade} × R$ ${item.preco.toFixed(2)} = 
            <strong>R$ ${item.subtotal.toFixed(2)}</strong>
            <button class="btn remover-item" data-id="${item.livroId}" style="margin-left: 8px;">Remover</button>
          </li>
        `
        )
        .join("")}
    </ul>
    <p><strong>Total do Carrinho: R$ ${totalGeral.toFixed(2)}</strong></p>
  `;
}

async function carregarLivros() {
  try {
    const res = await fetch(`${API_URL}/livros`);
    if (!res.ok) throw new Error("Falha ao buscar catálogo");
    const livros = await res.json();

    cardContainer.innerHTML = "";
    livros.forEach((livro, index) => {
      cardContainer.insertAdjacentHTML("beforeend", montarCard(livro, index));
    });
  } catch (err) {
    mostrarMensagem("Erro ao carregar livros: " + err.message, true);
  }
}

// 1. Adicionar ao carrinho (Buy Now)
cardContainer.addEventListener("click", async (evento) => {
  const btn = evento.target.closest(".buy-now");
  if (!btn) return;

  const res = await fetch(`${API_URL}/carrinho`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ livroId: btn.dataset.id, quantidade: 1 }),
  });

  const dados = await res.json();
  if (!res.ok) {
    return mostrarMensagem(dados.erro, true);
  }

  mostrarMensagem(`"${dados.item.titulo}" adicionado ao carrinho!`);
  if (carrinhoView.innerHTML !== "") {
    renderizarCarrinho(dados.carrinho);
  }
});

// 2. Ver carrinho (View Cart)
document.querySelector("#view-cart-btn").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/carrinho`);
  const itens = await res.json();

  if (!res.ok) {
    return mostrarMensagem(itens.erro || "Erro ao carregar carrinho", true);
  }

  mensagemStatus.textContent = "";
  renderizarCarrinho(itens);
});

// 3. Remover item do carrinho (Delegação no carrinhoView)
carrinhoView.addEventListener("click", async (evento) => {
  const btn = evento.target.closest(".remover-item");
  if (!btn) return;

  const res = await fetch(`${API_URL}/carrinho/${btn.dataset.id}`, {
    method: "DELETE",
  });

  const dados = await res.json();
  if (!res.ok) {
    return mostrarMensagem(dados.erro, true);
  }

  mostrarMensagem("Item removido do carrinho.");
  renderizarCarrinho(dados);
});

// 4. Finalizar compra (Checkout)
document.querySelector("#checkout-btn").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
  });

  const dados = await res.json();
  if (!res.ok) {
    return mostrarMensagem(`Erro no checkout: ${dados.erro}`, true);
  }

  carrinhoView.innerHTML = "";
  mostrarMensagem(`Pedido #${dados.numero} confirmado! Total pago: R$ ${dados.total.toFixed(2)}`);
});

carregarLivros();
