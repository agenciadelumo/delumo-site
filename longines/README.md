# Longines — livro digital

Apresentação ilustrada de 15 páginas em `/longines/`, com navegação por teclado, índice, ampliação, leitura em texto e transição de virar página. Os destaques das missões e medalhas mudam de cor e pulsam ao receber o ponteiro ou o foco do teclado. No celular, o toque abre a descoberta. A opção de reduzir animações e a preferência do sistema são respeitadas.

Identidade: floresta `#102E27`, verde-limão `#89F336`, laranja `#FF8938` e papel `#F4F0E4`. O logotipo está em `assets/longines-logo.svg`: letras personalizadas em vetor e símbolo ilustrado em 3D com transparência. A marca reage ao cursor com movimento do mascote e da folha, além de mudar a cor das letras. Slogan: **Brincar, explorar e aprender com a natureza.**

As páginas vetoriais são carregadas sob demanda, com imagens de reserva. As fotos são composições conceituais do parque e o conteúdo apresenta uma proposta de jogo. Este livro não executa o jogo nem envia certificados por e-mail.

## Publicação

O empacotamento do site copia esta pasta para `dist/longines`, preservando as demais páginas e aplicações. A pasta não depende de um serviço adicional. Inicie um servidor HTTP na raiz do repositório e abra `/longines/` para visualizar; abrir diretamente pelo protocolo de arquivos não é suportado.

O PDF disponível para download preserva a versão ilustrada aprovada. As animações, o novo logotipo e os acentos vibrantes pertencem à versão online.

## Som e voz

`assets/floresta-aventura.mp3` é uma composição instrumental original de 48 segundos com notas suaves e atmosfera sintética de floresta. Começa apenas pelo botão Som da aventura, em 15% do volume. O visitante pode pausar e ajustar o volume.

A narração está preparada, mas permanece oculta até haver arquivos de voz. As falas por página estão em `narration-texts.json`. `narration.json` relaciona os arquivos publicados; nenhum segredo vai para ele. Quando há narração, a música diminui a 35% do volume escolhido durante a fala e recupera o volume ao terminar. Ao virar a página, a fala anterior é interrompida.

Direção da personagem: menina tatu-bola, voz feminina jovem em português brasileiro, acolhedora e curiosa, com dicção natural. Evitar voz de bebê, excesso de agudos, caricatura e ritmo de locução publicitária. Primeira candidata para teste: Lívia Moreira, catálogo conectado, descrita como brasileira, jovem, amigável e natural. O identificador 611 é do catálogo conectado e **não** é um Voice ID nativo do ElevenLabs; confirmar a voz na conta antes de configurar.

Configure `ELEVENLABS_API_KEY` e `LONGINES_VOICE_ID` apenas no ambiente privado. Opcional: `LONGINES_VOICE_LABEL`. Execute `node scripts/generate-longines-narration.mjs --page=1` para produzir a amostra, ou sem a opção de página para as 15 narrações. A geração é uma etapa explícita e não roda automaticamente em cada publicação. Após validar a voz, publique os MP3s e o manifesto atualizado. Não coloque a chave no HTML, no manifesto, em argumentos da linha de comando ou no GitHub.

Crédito institucional: denominação da secretaria conferida no portal municipal em 9 de outubro de 2026: https://www.pmerechim.rs.gov.br/secretaria/6/secretaria-municipal-de-cultura-e-esporte . O rodapé não atribui gestão do parque ou parceria à secretaria.
