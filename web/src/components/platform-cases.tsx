import { ArrowUpRight } from 'lucide-react';
import { Icon, SectionHeading } from './brand';

const cases = [
  {
    name: 'Allmac360', image: '/media/site-allmac.webp', href: 'https://allmac360.com',
    title: 'Produtos, formação e suporte no mesmo ecossistema.',
    description: 'A plataforma reúne máquinas e peças, formação técnica e serviços de manutenção. Uma navegação integrada ajuda clientes a encontrar soluções e oferece à equipe referências para orientar o atendimento e o pós-venda.',
    features: [
      ['Catálogo técnico', 'Máquinas, equipamentos e peças organizados para consulta e apoio comercial.'],
      ['Allmac Academy', 'Cursos e formação técnica para operadores e programadores de máquinas.'],
      ['Allmac Protect', 'Apresentação dos planos de manutenção, diagnóstico e suporte especializado.'],
    ],
    links: [['Conheça a Allmac360', 'https://allmac360.com'], ['Allmac Academy', 'https://allmac360.com/servicos/allmac-academy'], ['Allmac Protect', 'https://allmac360.com/servicos/allmac-protect']],
  },
  {
    name: 'ESB Light', image: '/media/site-esblight.webp', href: 'https://esblight.com.br',
    title: 'Da apresentação da marca ao apoio à equipe.',
    description: 'O site institucional conecta produtos, aplicações e cases a recursos de capacitação e apoio interno. A informação técnica serve tanto à jornada do cliente quanto à preparação dos profissionais que atendem, especificam e vendem.',
    features: [
      ['Portfólio e cases', 'Produtos, fichas técnicas e aplicações para apoiar a escolha e a argumentação.'],
      ['AcademiaESB', 'Trilhas de conhecimento com acesso individual e acompanhamento da aprendizagem.'],
      ['Ferramentas internas', 'Uma central de agentes especializados para apoiar demandas comerciais, de licitações e jurídicas.'],
    ],
    links: [['Conheça a ESB Light', 'https://esblight.com.br'], ['AcademiaESB', 'https://www.esblight.com.br/academiaesb'], ['Central de agentes', 'https://www.esblight.com.br/agentes']],
  },
];

export default function PlatformCases() {
  return <section className="section platform-cases" id="cases-plataformas"><div className="container">
    <SectionHeading label="PLATAFORMAS EM AÇÃO" title={<>O site apresenta.<br/><em>A plataforma conecta.</em></>}><p>Projetos que aproximam a presença digital, o conhecimento e as ferramentas usadas no dia a dia da empresa.</p></SectionHeading>
    {cases.map(item => <article className="platform-case" key={item.name}>
      <a className="platform-case-preview" href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${item.name}`}><img src={item.image} alt={`Tela do site ${item.name}`} width="1440" height="1000" loading="lazy"/></a>
      <div className="platform-case-copy"><p className="eyebrow">{item.name}</p><h3>{item.title}</h3><p>{item.description}</p>
        <dl>{item.features.map(([title,text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
        <div className="platform-case-links">{item.links.map(([label,href]) => <a className="text-link" href={href} key={href} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={16}/></a>)}</div>
      </div>
    </article>)}
    <div className="platform-agents" id="agentes-esblight">
      <SectionHeading label="AGENTES ESPECIALIZADOS" title={<>Conhecimento disponível.<br/><em>Apoio para decidir.</em></>}><p>Na ESB Light, a central reúne três especialistas digitais. Cada agente tem um foco, com demandas direcionadas à sua área de atuação.</p></SectionHeading>
      <figure className="agents-capture"><a href="https://www.esblight.com.br/agentes" target="_blank" rel="noopener noreferrer" aria-label="Abrir a central de agentes da ESB Light"><img src="/media/esblight-agentes.webp" alt="Captura da Central de Agentes ESB Light com Rafael, Helena e Alberto" width="1265" height="1140" loading="lazy"/></a><figcaption>Central de Agentes ESB Light <a className="text-link" href="https://www.esblight.com.br/agentes" target="_blank" rel="noopener noreferrer">Visitar a central<ArrowUpRight size={16}/></a></figcaption></figure>
      <div className="agent-roles">{[
        ['Store','Rafael','Apoio comercial','Consulta a produtos, aplicações e fichas técnicas, com apoio à construção de argumentos de venda.'],
        ['Search','Helena','Licitações','Organização de editais, requisitos, checklists e evidências para apoiar a análise da equipe.'],
        ['ShieldCheck','Alberto','Apoio jurídico','Assistência na preparação e revisão preliminar de contratos, notificações e minutas.'],
      ].map(([icon,name,role,text]) => <article key={name}><Icon name={icon}/><h3>{name}<span>{role}</span></h3><p>{text}</p></article>)}</div>
      <p className="agent-responsibility">Os agentes apoiam o trabalho dos profissionais. Decisões técnicas, comerciais e jurídicas exigem revisão dos responsáveis, e o acesso às ferramentas segue as permissões de cada ambiente.</p>
    </div>
  </div></section>;
}
