# Salvamento público da proposta Castelinho Vivo

Qualquer visitante pode consultar e salvar os mesmos dados, sem chave ou login, conforme solicitado pelo responsável. O GitHub versiona o código; os preenchimentos ficam no Neon.

## Integração

- Banco exclusivo `castelinho-vivo` (`summer-base-23852023`), conectado à produção do projeto Vercel `delumo-site`.
- A única variável necessária é `CASTELINHO_DATABASE_URL`, secreta no servidor. Os antigos segredos de autenticação não são usados.
- Tabelas: `castelinho_proposals` e `castelinho_proposal_history`. Para reinstalação, aplicar `schema.sql`; no editor Vercel executar cada CREATE TABLE separadamente.
- API pública GET/PUT em `/api/castelinho`. O front-end não envia credenciais e não oferece login.

## Comportamento

Ao abrir a página, o navegador carrega a proposta do banco. Alterações são enviadas após 900 ms sem edição; o botão Salvar envia imediatamente. Uma cópia local permanece disponível quando a rede falha.

Cada escrita informa a revisão esperada. Transações no banco impedem sobrescrita silenciosa por uma versão antiga. Conflitos pausam o envio e permitem escolher entre carregar a versão online ou enviar os campos atuais. As versões anteriores permanecem no histórico.

Dados de formulário são validados no servidor e consultas são parametrizadas. O endpoint aceita alterações originadas das páginas Delumo, sem exigir identidade do visitante. Isto não identifica nem restringe os autores das edições públicas.

## Verificação

`node --test tests/castelinho-cloud.test.cjs` verifica acesso sem chave, validação dos 51 campos e rejeição de operações inválidas. `node --test tests/site-export.test.mjs` verifica a exportação após o build. A ativação inicial em 15/09/2026 confirmou gravação e recuperação no Neon; a revisão pública deve ser validada novamente sem cookies ou cabeçalhos de autenticação.
