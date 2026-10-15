import type { Metadata } from 'next';
import { contact } from '@/data/content';
import { legal } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Delumo trata dados pessoais no site, nos jogos e nas plataformas, de acordo com a LGPD (Lei 13.709/2018).',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacyPage() {
  return <main id="main">
    <section className="inner-hero"><div className="container"><p className="eyebrow">LGPD · LEI 13.709/2018</p><h1>Política de Privacidade</h1></div></section>
    <section className="section page-simple"><article className="container privacy-copy">
      <p>Esta Política explica, de forma clara, quais dados pessoais a Delumo trata quando você visita o site <strong>delumo.com.br</strong>, joga um dos nossos jogos na web ou fala com a nossa equipe, para que servem, por quanto tempo ficam guardados e como você pode exercer os seus direitos previstos na Lei Geral de Proteção de Dados Pessoais (LGPD).</p>

      <h2>1. Quem é a controladora</h2>
      <table><tbody>
        <tr><th>Nome fantasia</th><td>{legal.brand}</td></tr>
        <tr><th>Razão social</th><td>{legal.company}</td></tr>
        <tr><th>CNPJ</th><td>{legal.cnpj}</td></tr>
        <tr><th>Endereço</th><td>{legal.address}</td></tr>
        <tr><th>Encarregado pelo tratamento de dados (DPO)</th><td>{legal.dpo}</td></tr>
        <tr><th>Canal de privacidade</th><td><a className="text-link" href={`mailto:${legal.email}?subject=Privacidade%20%E2%80%93%20LGPD`}>{legal.email}</a></td></tr>
      </tbody></table>

      <h2>2. O que o site não faz</h2>
      <ul>
        <li>O site <strong>não pede senhas</strong> nem dados bancários ou de cartão. Se alguém pedir isso em nome da Delumo, não informe e avise a nossa equipe.</li>
        <li>Não usamos cookies de publicidade, pixels de redes sociais nem ferramentas de rastreamento de comportamento.</li>
        <li>Não vendemos nem alugamos dados pessoais.</li>
      </ul>

      <h2>3. Dados tratados, finalidades e bases legais</h2>
      <table>
        <thead><tr><th>Situação</th><th>Dados</th><th>Finalidade</th><th>Base legal (LGPD)</th></tr></thead>
        <tbody>
          <tr><td>Navegação no site</td><td>Endereço IP, data e hora, página acessada, navegador e sistema (registros de acesso)</td><td>Segurança, prevenção de fraudes, disponibilidade e diagnóstico do serviço</td><td>Cumprimento de obrigação legal (art. 7º, II — Marco Civil da Internet, art. 15) e legítimo interesse (art. 7º, IX)</td></tr>
          <tr><td>Formulário de contato</td><td>Nome, empresa e mensagem que você digitar</td><td>Montar a mensagem que <strong>você</strong> envia pelo WhatsApp. O site não grava esses dados.</td><td>Procedimentos preliminares a contrato, a seu pedido (art. 7º, V)</td></tr>
          <tr><td>Atendimento por WhatsApp ou e-mail</td><td>Nome, telefone, e-mail e o conteúdo da conversa</td><td>Responder, preparar propostas e prestar os serviços contratados</td><td>Execução de contrato ou procedimentos preliminares (art. 7º, V) e legítimo interesse (art. 7º, IX)</td></tr>
          <tr><td>Jogos e experiências na web (como Castelinho Vivo e Longines)</td><td>Nenhum dado pessoal. Apenas preferências técnicas salvas no seu próprio aparelho (por exemplo, se uma dica já foi exibida)</td><td>Funcionamento do jogo</td><td>Não há tratamento de dados pessoais</td></tr>
          <tr><td>Vídeos incorporados</td><td>Dados técnicos enviados ao YouTube somente quando você toca em “Assistir”</td><td>Exibir o vídeo (usamos o modo de privacidade aprimorada do YouTube)</td><td>Legítimo interesse (art. 7º, IX)</td></tr>
          <tr><td>Plataformas contratadas por empresas clientes (áreas de treinamento e gestão)</td><td>Dados de cadastro e de uso definidos em contrato com a empresa cliente</td><td>Prestar o serviço contratado</td><td>Nessas plataformas a Delumo atua como <strong>operadora</strong>, seguindo as instruções da empresa cliente, que é a controladora</td></tr>
        </tbody>
      </table>

      <h2>4. Crianças e adolescentes</h2>
      <p>Os jogos educativos da Delumo podem ser usados por crianças e adolescentes. Eles <strong>não coletam nome, foto, voz, localização nem qualquer outro dado pessoal</strong>, não têm cadastro, chat ou publicidade. Atendemos ao melhor interesse da criança e do adolescente, conforme o art. 14 da LGPD e o Estatuto da Criança e do Adolescente.</p>

      <h2>5. Cookies e armazenamento local</h2>
      <p>O site institucional não usa cookies próprios de rastreamento. Alguns recursos usam armazenamento técnico essencial no seu navegador (como o cache do jogo e o registro de que uma dica já foi lida). Esses dados ficam somente no seu aparelho e podem ser apagados a qualquer momento nas configurações do navegador. Serviços de terceiros (como o YouTube, quando você inicia um vídeo) podem usar tecnologias próprias, conforme as políticas deles.</p>

      <h2>6. Compartilhamento e transferência internacional</h2>
      <p>Compartilhamos dados apenas com fornecedores necessários para o funcionamento do site e do atendimento, que se comprometem com a proteção dos dados:</p>
      <ul>
        <li><strong>Vercel</strong> e <strong>GitHub</strong> (hospedagem do site e dos jogos);</li>
        <li><strong>WhatsApp/Meta</strong> e <strong>Google</strong> (atendimento e e-mail);</li>
        <li>autoridades públicas, quando houver obrigação legal ou ordem judicial.</li>
      </ul>
      <p>Alguns desses fornecedores mantêm servidores fora do Brasil. Nesses casos, a transferência internacional ocorre com base nas garantias previstas no art. 33 da LGPD, como cláusulas contratuais e normas corporativas dos fornecedores.</p>

      <h2>7. Por quanto tempo guardamos</h2>
      <ul>
        <li>Registros de acesso ao site: <strong>6 meses</strong>, como exige o Marco Civil da Internet;</li>
        <li>Conversas e propostas comerciais: enquanto durar o relacionamento e por até <strong>5 anos</strong> depois, para cumprir obrigações legais e defender direitos;</li>
        <li>Dados de plataformas de clientes: pelo prazo definido no contrato com a empresa cliente.</li>
      </ul>

      <h2>8. Segurança</h2>
      <p>O site usa conexão criptografada (HTTPS com certificado SSL/TLS e HSTS), cabeçalhos de segurança e acesso restrito aos sistemas. Nenhum sistema é totalmente imune a incidentes; se ocorrer um incidente que possa trazer risco relevante, comunicaremos os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD), como determina a lei.</p>

      <h2>9. Seus direitos</h2>
      <p>Pelo art. 18 da LGPD, você pode pedir a qualquer momento, sem custo:</p>
      <ul>
        <li>confirmação de que tratamos seus dados e acesso a eles;</li>
        <li>correção de dados incompletos, inexatos ou desatualizados;</li>
        <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
        <li>portabilidade dos dados a outro fornecedor;</li>
        <li>eliminação dos dados tratados com o seu consentimento e informação sobre com quem eles foram compartilhados;</li>
        <li>revogação do consentimento, quando ele for a base legal;</li>
        <li>revisão de decisões tomadas unicamente com base em tratamento automatizado.</li>
      </ul>
      <p>Para exercer esses direitos, escreva para <a className="text-link" href={`mailto:${legal.email}?subject=Direitos%20do%20titular%20%E2%80%93%20LGPD`}>{legal.email}</a> ou fale pelo WhatsApp <a className="text-link" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">{contact.phone}</a>. Respondemos em até <strong>15 dias</strong>. Você também pode apresentar reclamação à ANPD (<a className="text-link" href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">gov.br/anpd</a>).</p>

      <h2>10. Alterações desta Política</h2>
      <p>Esta Política pode ser atualizada para refletir mudanças nos serviços ou na legislação. A versão vigente fica sempre nesta página, com a data da última atualização.</p>
      <p>Veja também os <a className="text-link" href="/termos">Termos de Uso</a>.</p>
      <p><strong>Última atualização:</strong> {legal.updated}.</p>
    </article></section>
  </main>;
}
