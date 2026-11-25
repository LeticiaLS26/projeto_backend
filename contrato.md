# Contrato da API — XYZ Bookstore

**Base URL:** `http://localhost:3000`  
**Formato padrão:** `application/json; charset=utf-8`

## Estrutura dos Recursos
- **Livro:** `{ id, titulo, autor, descricao, preco }`
- **Item do Carrinho:** `{ livroId, titulo, preco, quantidade, subtotal }`
- **Pedido:** `{ numero, itens, total }`

## Endpoints

| # | Rota | Método | Body | OK (Sucesso) | Erros | Auditoria |
|---|---|---|---|---|---|---|
| 1 | `/livros` | `GET` | — | `200` `[{ id, titulo, autor, descricao, preco }]` | — | ✔ auditado |
| 2 | `/livros?autor=X` | `GET` | — | `200` `[{filtrados}]` (pode retornar `[]`) | — | ✔ auditado |
| 3 | `/livros/:id` | `GET` | — | `200` `{ id, titulo, autor, descricao, preco }` | `404` `{ erro: "livro nao encontrado" }` | ✔ auditado |
| 4 | `/carrinho` | `GET` | — | `200` `[{ livroId, titulo, preco, quantidade, subtotal }]` | — | ✔ auditado |
| 5 | `/carrinho` | `POST` | `{ livroId, quantidade }` | `201` `{ item, carrinho }` (`item` enriquecido com `titulo`, `preco`, `subtotal`) | `400` `{ erro }` (campo ausente, `livroId` inexistente, `quantidade` inválida ou JSON malformado) | ✔ auditado *(ajustado)* |
| 6 | `/checkout` | `POST` | — | `200` `{ numero, itens, total }` (zera o carrinho) | `400` `{ erro: "carrinho vazio" }` | ✔ auditado |
| 7 | `/pedidos` | `GET` | — | `200` `[{ numero, itens, total }]` | — | ✔ auditado |

| 8 | `/carrinho/:id` | `DELETE` | — | `200` `[{ livroId, titulo, preco, quantidade, subtotal }]` (carrinho restante) | `404` `{ erro: "item nao encontrado no carrinho" }` | ✔ auditado |

