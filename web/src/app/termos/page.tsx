import type { Metadata } from 'next';
import { legal } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Condições de uso do site, dos jogos e das demonstrações da Delumo.',
  alternates: { canonical: '/termos' },
};

export default function TermsPage() {
  return <main id="main">
    <section className="inner-hero"><div className="container"><p className="eyebrow">CONDIÇÕES DE USO</p><h1>Termos de Uso</h1></div></section>
    <section className="section page-simple"><article className="container privacy-copy">
      <p>Estes Termos regem o uso do site <strong>delumo.com.br</strong>, dos jogos e das demonstrações publicados pela Delumo ({legal.company}, CNPJ {legal.cnpj}, {legal.address}). Ao usar o site, você concorda com estas condições.</p>

      <h2>1. O que oferecemos</h2>
      <p>O site apresenta os serviços da Delumo (treinamentos, gamificação, projetos 3D, plataformas e experiências imersivas), projetos realizados e jogos educativos que funcionam diretamente no navegador, sem instalação.</p>

      <h2>2. Uso permitido</h2>
      <ul>
        <li>Use o site e os jogos para fins pessoais, educativos ou de avaliação dos nossos serviços.</li>
        <li>Não tente acessar áreas restritas sem autorização, explorar falhas, sobrecarregar os servidores ou copiar o conteúdo em massa.</li>
        <li>Propostas comerciais publicadas em endereços específicos são destinadas aos respectivos clientes e não devem ser divulgadas sem autorização.</li>
      </ul>

      <h2>3. Propriedade intelectual</h2>
      <p>Textos, imagens, vídeos, personagens, jogos, marcas e códigos do site pertencem à Delumo ou aos seus clientes e parceiros, que autorizaram a publicação. É proibido reproduzir, modificar ou distribuir esse conteúdo sem autorização por escrito, exceto o compartilhamento de links.</p>

      <h2>4. Links e serviços de terceiros</h2>
      <p>O site pode levar a páginas de clientes, ao WhatsApp, ao YouTube e a outros serviços. Esses serviços têm termos e políticas próprios, pelos quais a Delumo não responde.</p>

      <h2>5. Segurança e golpes</h2>
      <p>A Delumo <strong>nunca pede senhas, dados bancários ou pagamentos pelo site</strong>. Pagamentos de serviços são feitos somente mediante proposta e contrato formais. Se receber um pedido suspeito em nosso nome, não responda e avise a equipe pelo e-mail <a className="text-link" href={`mailto:${legal.email}`}>{legal.email}</a>.</p>

      <h2>6. Disponibilidade e responsabilidade</h2>
      <p>Trabalhamos para manter o site e os jogos disponíveis e funcionando, mas eles podem passar por manutenção ou instabilidades. O conteúdo tem caráter informativo e pode ser atualizado sem aviso. A Delumo não responde por danos causados por uso indevido do site ou por falhas de equipamentos e conexões do usuário.</p>

      <h2>7. Privacidade</h2>
      <p>O tratamento de dados pessoais segue a nossa <a className="text-link" href="/privacidade">Política de Privacidade</a>, em conformidade com a LGPD.</p>

      <h2>8. Lei aplicável e foro</h2>
      <p>Estes Termos seguem as leis brasileiras. Fica eleito o foro da Comarca de Erechim/RS, ressalvado o direito do consumidor de escolher o foro do seu domicílio.</p>

      <p><strong>Última atualização:</strong> {legal.updated}.</p>
    </article></section>
  </main>;
}
