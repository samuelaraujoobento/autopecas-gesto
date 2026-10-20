# AutoPeças Gesto

Sistema de controle de estoque para lojas de autopeças, feito com React, Vite e Tailwind CSS.

## O que faz

- Cadastro, edição e exclusão de peças (com validação de SKU duplicado)
- Ajuste rápido de quantidade com os botões de mais e menos
- Resumo com total de peças, unidades, valor em estoque e itens para repor
- Busca por nome ou SKU, filtro por categoria e filtro de reposição
- Exportação da lista filtrada para CSV (abre no Excel)
- Dados salvos no navegador (localStorage)

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Publicar no Vercel

1. Envie o projeto para o GitHub.
2. No Vercel, clique em **Add New > Project** e importe o repositório.
3. O Vercel detecta o Vite sozinho (build: `npm run build`, saída: `dist`). Clique em **Deploy**.
