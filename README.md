# Site Delumo — delumo.com.br

Site multi-páginas da Delumo: treinamentos empresariais gamificados e imersivos.

## Estrutura

```
delumo-site/
├── index.html                 (home)
├── sobre.html                 (história + método em 5 etapas + parceria)
├── contato.html               (formulário + FAQ)
├── 404.html                   (página de erro personalizada)
├── sitemap.xml / robots.txt   (SEO)
├── servicos/  play.html · 360.html · avatar.html
├── cases/     conquistahnk.html · metatrade.html · incerti.html · esblight.html
├── blog/      index.html + 3 artigos
└── assets/    css/ · js/ · img/ (fotos com rostos desfocados, logotipos, favicon)
```

## Publicar (GitHub → Vercel → domínio)

1. **GitHub**: New repository → arraste TODOS os arquivos e pastas → Commit.
2. **Vercel**: Add New Project → Import → framework "Other" → Deploy.
3. **Domínio**: Vercel → Settings → Domains → `delumo.com.br` e `www.delumo.com.br`.
   No registro.br → Editar zona DNS: registro **A** @ = `76.76.21.21` e **CNAME** www = `cname.vercel-dns.com`
   (confirme os valores exatos exibidos pela Vercel). HTTPS é automático.

## ⚠️ Antes de publicar — 3 ajustes seus

1. **WhatsApp**: troque o número de exemplo `5554999999999` pelo seu.
   Busque por `wa.me/5554999999999` (aparece em todas as páginas) e substitua.
2. **Formulário de contato**: usa o FormSubmit (grátis). No PRIMEIRO envio,
   o serviço manda um e-mail de ativação para contato@delumo.com.br — clique
   em "Activate" uma única vez e os envios passam a chegar normalmente.
3. **Depoimentos (home)**: os 3 cards estão com texto entre [colchetes].
   Peça as frases aos clientes e substitua no index.html.

## Recursos implementados

Páginas por case e por linha de serviço · Sobre com método em 5 etapas
(diagnóstico → roteiro → produção → lançamento → medição) · parceria
Realizações Humanas · blog com 3 artigos · FAQ · formulário funcional ·
depoimentos · contadores animados · seção "para quem é" · WhatsApp flutuante ·
animações ao rolar · menu mobile · header inteligente · 404 · favicon,
sitemap, robots e schema.org.

Vídeo do MetaTrade: player oficial do YouTube, autoplay mudo + botão de som.
Fotos com pessoas: rostos desfocados automaticamente.
