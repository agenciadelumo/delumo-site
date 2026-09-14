# Rede Lius — proposta comercial

Rota: https://www.delumo.com.br/redelius (com e sem barra final).
Referência visual: `/propostadayro`. Conteúdo baseado na conversa compartilhada pelo cliente.

## Estado da demonstração

Pacote recebido: `C:/Users/agenc/Downloads/Lius_scorm (1).zip`, SCORM 1.2. O HTML de entrada é `demo/index.html`. O quiz original de três alternativas foi preservado, incluindo feedback, nova tentativa e resposta obrigatória.

`demo-config.js` está em modo `scorm`, com a demonstração extraída no iframe. A versão web funciona sem LMS usando o comportamento de prévia do exportador; não constitui homologação no Educere.

Vídeo otimizado de 3840×2160 / 212.838.145 bytes para 1920×1080 / 33.869.662 bytes, H.264/AAC, 25 fps, aproximadamente 130,774 s. O ZIP original permanece intacto. `preview.css` e `preview.js` adaptam legibilidade, português, teclado e altura do quiz no celular. O player e as decisões continuam no SDK fornecido.

- Vídeo simples: colocar o arquivo em `redelius/media/`, configurar `mode: 'video'`, `src: 'media/demo.mp4'` e, se disponível, a legenda WebVTT em `captions`. O player usa controles nativos, sem reprodução automática com áudio. Um MP4 simples não contém o quiz SCORM.
- SCORM: inspecionar e extrair o ZIP com validação dos caminhos. Identificar o HTML de lançamento no `imsmanifest.xml`; configurar `mode: 'scorm'` e o caminho relativo em `src`. Não apontar para o ZIP. Confirmar que o pacote suporta execução demonstrativa sem LMS; se exigir API SCORM, homologar um modo de prévia com o pacote real antes de ativá-lo. O iframe e a tela cheia estão preparados; este site não implementa um LMS nem persistência SCORM.
- O acompanhamento real de progresso, retomada e conclusão deve ser testado no LMS/Educere com a versão SCORM aceita. Os controles e o quiz do pacote são responsabilidade do player exportado; conferir após o recebimento.

## Validação ao inserir o material

1. Verificar nomes, limites individuais de arquivo e licença de publicação.
2. Conferir ambos os endereços da rota, carregamento de todos os assets e reprodução.
3. Testar controles, quiz, feedback, navegação por teclado, legendas e tela cheia em desktop/mobile.
4. Homologar a versão final no LMS/Educere, incluindo retomada e conclusão.

O material original anexado na outra conversa não acompanha o link compartilhado. Confirmar o roteiro e os protocolos com os anexos antes da produção do treinamento.
