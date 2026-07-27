# bora. O turismo sem atravessador

Site onepage + protótipo navegável do app **bora.**, marketplace que conecta o turista diretamente ao Guia+Motorista: experiências no seu ritmo, preço transparente e pagamento retido até o passeio acontecer.

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Site onepage (apresentação completa do projeto, com o app rodando embutido) |
| `app.html` | Protótipo navegável do app do turista (funciona sozinho e dentro do onepage) |
| `projeto.html` | Documento de projeto completo (planejamento, stack, custos, regiões, roadmap) |

Site 100% estático, sem build, dependências ou backend. Basta servir os arquivos.

## Como publicar no GitHub (conta: delumo)

**Pelo navegador (mais fácil, ~3 min):**
1. Entre em github.com com sua conta **delumo**
2. Clique em **+** (canto superior direito) → **New repository**
3. Nome sugerido: `bora` (ou `bora-turismo`) → **Create repository**
4. Na página do repositório novo, clique em **uploading an existing file**
5. Arraste os 4 arquivos (`index.html`, `app.html`, `projeto.html`, `README.md`) → **Commit changes**

**Pelo terminal (se preferir):**
```bash
cd pasta-do-site
git init
git add .
git commit -m "bora. site onepage + app"
git branch -M main
git remote add origin https://github.com/delumo/bora.git
git push -u origin main
```

## Como fazer o deploy na Vercel (~2 min)

1. Entre em **vercel.com** e faça login com a conta do GitHub (delumo)
2. Clique em **Add New… → Project**
3. Selecione o repositório **bora** → **Import**
4. Framework Preset: **Other** (não precisa mudar mais nada, pois é um site estático)
5. Clique em **Deploy**

Pronto: a Vercel gera um endereço tipo `bora-delumo.vercel.app`. Todo push novo no GitHub atualiza o site automaticamente.

> Alternativa sem GitHub: em vercel.com, arraste a pasta inteira na tela de novo projeto (deploy por drag-and-drop).

## Antes de divulgar em produção

- Verificar disponibilidade da marca **bora** no INPI (classe de software/turismo) e do domínio (`.com.br` / `.app`)
- Trocar `seu-email@exemplo.com` no rodapé do `index.html` pelo contato real
- Os valores, notas, avaliações e "parcerias" exibidos no app são **ilustrativos** (protótipo conceitual)
- As fotos dos locais no app vêm do **Wikimedia Commons** (licenças CC BY / CC BY-SA), servidas via `Special:FilePath`, com créditos na tela Perfil do app. Antes do uso comercial definitivo, confira autor e licença na página de cada arquivo em commons.wikimedia.org. Fotos de estabelecimentos privados (bares, clubes) seguem estilizadas de propósito e devem vir dos próprios parceiros com autorização.
