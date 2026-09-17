# Materiais (PDFs e imagens dos moldes)

Coloque aqui os arquivos dos moldes e dos bônus (Guia de Termos, Manual de
Costura, Guia de Boas-Vindas, etc.).

## Como funciona

Cada arquivo aqui é ligado ao título exato do molde através do mapa em
[`src/data/materiais.ts`](../../src/data/materiais.ts) — não importa o nome
do arquivo, contanto que o mapa aponte pra ele. Cada entrada tem:

- `file`: o arquivo real (o que os botões "Ver"/"Baixar" abrem).
- `cover`: a imagem usada como foto do card na seção de moldes. Se `file` for
  um PDF, a capa é a 1ª página renderizada como PNG e salva em `capas/`.

Fluxo pra adicionar ou trocar um material:

1. Solte o arquivo aqui (`.pdf`, `.png`, etc. — qualquer nome).
2. Me avise (ou peça pro Claude rodar o script de matching de novo) que eu:
   - ligo o arquivo ao título certo em `materiais.ts`;
   - se for PDF, gero a capa em `capas/` (renderizando a 1ª página);
   - aviso se algum título ficou sem arquivo correspondente.

Moldes sem entrada em `materiais.ts` aparecem no site com a tag "Em breve" e,
no lugar dos botões, mostram "Em preparação".

## Pasta `capas/`

Gerada automaticamente — não precisa editar. Guarda a imagem de capa de cada
PDF (1ª página, renderizada em PNG). Arquivos que já são imagem (`.png`) não
têm entrada aqui: a própria imagem já serve de capa.

## Status atual

`src/data/moldes.ts` só lista os moldes que já têm arquivo aqui — os itens
sem material foram removidos da lista (em vez de aparecer como "Em breve").
Hoje são 36 moldes, todos de "Bolsas e Necessaires". Quando você soltar mais
arquivos aqui, é só pedir pra eu adicionar os novos moldes correspondentes à
lista — inclusive os 6 itens de "Bônus" (Guia de Termos, Manual de Costura
Técnica, Guia de Boas-Vindas, Como Imprimir os Moldes, Catálogo Visual dos
Modelos, Índice Geral dos Modelos), que saíram da lista por não terem PDF
ainda.
