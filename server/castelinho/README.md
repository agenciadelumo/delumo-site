# Salvamento online da proposta Castelinho Vivo

Código preparado para PostgreSQL/Neon e uma função Vercel em `/api/castelinho`.
O GitHub versiona código e imagens. Os preenchimentos ficam no banco, nunca em commits.
Sem as três variáveis abaixo, a API fica fechada e a proposta mantém o salvamento local.

## Ativação verificada em 15/09/2026

- Banco Neon exclusivo `castelinho-vivo` (`summer-base-23852023`), integrado à produção do projeto Vercel `delumo-site`.
- Tabelas da proposta e do histórico criadas. As três variáveis privadas estão configuradas na Vercel; nenhuma credencial faz parte deste repositório.
- Teste real: 51 campos gravados e recuperados em duas sessões autenticadas independentes; escrita com revisão antiga rejeitada (409), dados incompletos rejeitados (400) e leitura anônima rejeitada (401).
- O histórico foi mantido por revisão. O acesso do responsável usa a chave privada entregue localmente.

## Configuração para reinstalação

1. Escolher/criar um banco exclusivo para a proposta ou aprovar uma conexão com acesso restrito às duas tabelas abaixo. Não conectar automaticamente os bancos financeiros de outros aplicativos.
2. Aplicar `schema.sql` no banco escolhido. Usar conexão com TLS e papel com somente SELECT/INSERT/UPDATE em `castelinho_proposals` e SELECT/INSERT em `castelinho_proposal_history`.
3. Definir somente no ambiente Production do projeto Vercel `delumo-site`:
   - `CASTELINHO_DATABASE_URL`: conexão PostgreSQL com TLS (Neon exige `sslmode=require`).
   - `CASTELINHO_ACCESS_HASH`: SHA-256 hexadecimal de uma chave aleatória de pelo menos 32 bytes, codificada em base64url. Não usar uma senha humana curta. A chave original é entregue apenas ao responsável autorizado, fora do código, de URLs e de logs.
   - `CASTELINHO_SESSION_SECRET`: segredo aleatório independente, com pelo menos 32 bytes.
4. Publicar novamente. Entrar pela seção Projeto salvo online usando a chave original. Para acesso da equipe, definir primeiro os destinatários; esta versão usa uma chave compartilhada e não identifica individualmente cada editor.
5. Validar gravação real, recarregar em um segundo navegador/aparelho, testar conflito de duas sessões, histórico no banco e rejeição de acesso sem sessão. Repetir essas verificações ao reinstalar a integração.

## Comportamento

- Autossalvamento online após 900 ms sem alterações e botão Salvar imediato; mantém a cópia local.
- Sessão de sete dias em cookie HttpOnly, Secure e SameSite=Strict. Nenhuma chave fica no armazenamento local. Alterar o hash de acesso invalida as sessões.
- Validação dos 51 campos no servidor e consultas parametrizadas. Rascunhos incompletos podem ser salvos; os avisos numéricos do orçamento continuam na tela.
- Escritas serializadas em transação PostgreSQL; a revisão esperada impede sobrescrita silenciosa. Histórico completo por revisão nas tabelas da proposta.
- Conflitos pausam o envio e permitem carregar a versão online ou enviar os campos atuais. A versão anterior permanece no histórico.
- Falhas deixam aviso de envio pendente. Autossalvamento exige página aberta e rede disponível; ao voltar, alterações locais diferentes da versão online pedem escolha explícita.
- Cada aparelho carrega os dados ao entrar/reabrir ou clicar em Reconectar. Não é edição simultânea em tempo real.

## Verificação local

`node --test tests/castelinho-cloud.test.cjs` verifica configuração, chave, sessão, validação de campos e bloqueios da API. `node --test tests/site-export.test.mjs` verifica a exportação do site após build.
