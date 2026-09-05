export const contact = {
  name: 'Guto Luz',
  phone: '(54) 98130-2517',
  email: 'agenciadelumo@gmail.com',
  whatsapp: 'https://wa.me/5554981302517?text=Ol%C3%A1%2C%20Guto!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Delumo.',
  address: 'Rua Anita Garibaldi, 1473, Bela Vista, Erechim, RS',
};

export type Solution = {
  slug: string; number: string; name: string; short: string; icon: string;
  intro: string; description: string; image: string; imageAlt: string;
  applications: string[]; deliverables: string[]; outcome: string;
};

export const solutions: Solution[] = [
  {
    slug: 'treinamentos', number: '01', name: 'Treinamentos e trilhas', short: 'Conhecimento que faz parte da rotina.', icon: 'GraduationCap',
    intro: 'Pessoas preparadas para os desafios reais da sua empresa.',
    description: 'Transformamos o conhecimento da sua operação em treinamentos claros, contextualizados e reutilizáveis. Cada trilha conecta objetivos de aprendizagem, conteúdos curtos, situações práticas e avaliações para acompanhar a evolução por função.',
    image: '/assets/img/treinamento-metatrade.jpg', imageAlt: 'Aplicação presencial de uma experiência de treinamento MetaTrade com realidade virtual',
    applications: ['RH, cultura e integração de novos colaboradores', 'Produtos, atendimento, negociação e vendas', 'Liderança, comunicação, feedback e colaboração', 'Processos, rotinas administrativas e orientação sobre segurança'],
    deliverables: ['Diagnóstico e trilha de conhecimento por função', 'Roteiros, videoaulas, avatares de IA e materiais de apoio', 'Estudos de caso, simulações e atividades práticas', 'Avaliações, acompanhamento e ciclos de atualização'],
    outcome: 'O conteúdo certo, na sequência certa e em um formato que a equipe consegue aplicar.',
  },
  {
    slug: 'gamificacao', number: '02', name: 'Gamificação', short: 'Metas que movimentam o seu time.', icon: 'Gamepad2',
    intro: 'Transforme a estratégia em missões que fazem sentido.',
    description: 'Criamos games corporativos que conectam o comportamento esperado às metas do negócio. Narrativa, desafios, pontuação, reconhecimento e feedback dão visibilidade à evolução individual e coletiva.',
    image: '/media/conquista.webp', imageAlt: 'Tela do jogo ConquistaHNK com territórios, pontos de venda e indicadores',
    applications: ['Campanhas de incentivo comercial', 'Execução e presença no ponto de venda', 'Integração e desafios de aprendizagem', 'Engajamento de equipes e redes de revendas'],
    deliverables: ['Conceito, identidade e regras do game', 'Missões, níveis, pontos e rankings', 'Painéis por equipe, região ou unidade', 'Integrações e acompanhamento conforme o projeto'],
    outcome: 'Uma experiência que traduz indicadores em ações e mostra ao time onde avançar.',
  },
  {
    slug: 'projetos-3d', number: '03', name: 'Projetos especiais 3D', short: 'Ideias que ganham forma e contexto.', icon: 'Box',
    intro: 'Apresente o que ainda precisa ser visto, explorado ou compreendido.',
    description: 'Desenvolvemos ambientes, produtos e experiências digitais em 3D para explicar processos, demonstrar soluções e antecipar decisões. A tecnologia é escolhida de acordo com a experiência, o dispositivo e o objetivo de cada projeto.',
    image: '/media/metatrade.webp', imageAlt: 'Ambiente de ponto de venda do projeto imersivo MetaTrade',
    applications: ['Simulação de pontos de venda e espaços comerciais', 'Visualização de produtos e soluções técnicas', 'Demonstrações de processos e operação', 'Apresentações interativas e experiências para eventos'],
    deliverables: ['Conceito visual, roteiro de navegação e cenários', 'Modelagem, materiais, iluminação e composição', 'Interações, pontos de informação e demonstrações', 'Otimização para os dispositivos definidos no projeto'],
    outcome: 'Uma representação visual que ajuda a entender, treinar e decidir com mais contexto.',
  },
  {
    slug: 'plataformas', number: '04', name: 'Plataformas inteligentes', short: 'Tecnologia conectada ao seu negócio.', icon: 'PanelsTopLeft',
    intro: 'Seu site pode ser o começo de uma operação mais inteligente.',
    description: 'Desenvolvemos sites e plataformas sob medida em Next.js, com navegação objetiva e integrações que aproximam conteúdo, atendimento e operação. Do catálogo técnico às trilhas de ensino, cada ferramenta atende a uma necessidade concreta da empresa.',
    image: '/media/plataformas.webp', imageAlt: 'Visão de um projeto digital desenvolvido pela Delumo',
    applications: ['Sites institucionais, catálogos e páginas para campanhas', 'Ambientes de ensino com trilhas de conhecimento integradas', 'Áreas de clientes, parceiros e equipes', 'Agentes de IA, bases de conhecimento e automação de atendimento'],
    deliverables: ['Arquitetura da informação e experiência de navegação', 'Desenvolvimento em Next.js e layout responsivo', 'SEO técnico, conteúdo estruturado e otimização de carregamento', 'Integrações, métricas e eventos de conversão definidos no escopo'],
    outcome: 'Uma base digital preparada para campanhas, busca orgânica e evolução contínua.',
  },
  {
    slug: 'imersao', number: '05', name: 'Experiências imersivas', short: 'Aprender e explorar de dentro da cena.', icon: 'ScanEye',
    intro: 'Leve as pessoas para dentro da experiência.',
    description: 'Criamos tours 360°, ambientes navegáveis e experiências de realidade virtual que aproximam pessoas de lugares, produtos e situações de trabalho. O visitante explora, observa detalhes e encontra informações no contexto em que elas fazem sentido.',
    image: '/assets/img/treinamento-metatrade.jpg', imageAlt: 'Participantes exploram um treinamento imersivo da Delumo com óculos de realidade virtual',
    applications: ['Onboarding e visitas virtuais à empresa', 'Treinamento de execução no ponto de venda', 'Apresentações comerciais e showrooms virtuais', 'Cultura, turismo e experiências de marca'],
    deliverables: ['Roteiro e organização dos ambientes', 'Captura ou produção das cenas e pontos interativos', 'Vídeos, avatares e conteúdos integrados à navegação', 'Acesso em navegador e suporte a VR conforme a experiência'],
    outcome: 'Mais proximidade com o ambiente real, mesmo à distância.',
  },
];

export const trainingGroups = [
  { name: 'Integração e cultura', icon: 'Users', title: 'O primeiro passo com mais clareza.', text: 'Cultura, conduta, rotinas da função e apresentação da empresa em uma jornada que pode ser revisitada.', modules: ['Boas-vindas e propósito', 'Cultura e conduta', 'Rotina da função', 'Prática e acompanhamento'] },
  { name: 'Vendas e produtos', icon: 'Target', title: 'Conhecimento técnico que chega ao cliente.', text: 'Portfólio, aplicação, abordagem e negociação conectados a situações reais de atendimento e execução comercial.', modules: ['Conhecer o portfólio', 'Entender a necessidade', 'Simular o atendimento', 'Aplicar e receber feedback'] },
  { name: 'Liderança e pessoas', icon: 'MessagesSquare', title: 'Competências para trabalhar melhor em equipe.', text: 'Comunicação, feedback, autogestão, tomada de decisão e colaboração desenvolvidos com casos e exercícios do dia a dia.', modules: ['Autoconhecimento', 'Comunicação e escuta', 'Conversas e decisões', 'Plano de desenvolvimento'] },
  { name: 'Processos e operação', icon: 'Workflow', title: 'Um padrão claro para cada atividade.', text: 'Rotinas administrativas, sistemas, procedimentos e conscientização sobre segurança apresentados com contexto e exemplos.', modules: ['Entender o processo', 'Observar a execução', 'Praticar a atividade', 'Verificar a compreensão'] },
];

export const methods = [
  { icon: 'Users', title: 'Andragogia', text: 'Aprendizagem de adultos conectada à experiência e às necessidades do trabalho.' },
  { icon: 'RefreshCw', title: 'Aprendizagem experiencial', text: 'Vivenciar, refletir, compreender e aplicar. O ciclo de Kolb orienta experiências práticas.' },
  { icon: 'Layers', title: 'Taxonomia de Bloom', text: 'Objetivos que avançam da compreensão à aplicação, análise e criação.' },
  { icon: 'Timer', title: 'Microlearning', text: 'Conteúdos curtos e objetivos que cabem na rotina e facilitam a revisão.' },
  { icon: 'Puzzle', title: 'Aprendizagem por problemas', text: 'Casos, escolhas e simulações para desenvolver raciocínio em situações reais.' },
  { icon: 'ChartNoAxesCombined', title: 'Avaliação e feedback', text: 'Verificação de compreensão e aplicação para orientar os próximos passos.' },
];

export const process = [
  { title: 'Entender', text: 'Público, rotina, desafios e objetivos do negócio.' },
  { title: 'Desenhar', text: 'Escopo, trilha, experiência e indicadores de sucesso.' },
  { title: 'Desenvolver', text: 'Conteúdo, design, tecnologia e revisão com a sua equipe.' },
  { title: 'Colocar em prática', text: 'Testes, implantação e acompanhamento da experiência.' },
  { title: 'Evoluir', text: 'Aprendizados, ajustes e novas possibilidades.' },
];

export const websiteCases = [
  { slug: 'supreme', title: 'Supreme Lubrificantes', category: 'Site e catálogo técnico', image: '/media/site-supreme.webp', url: 'https://www.supremelub.com.br', domain: 'supremelub.com.br', text: 'Portfólio organizado por aplicação, fichas técnicas e conteúdo para apoiar a jornada comercial.' },
  { slug: 'allmac360', title: 'Allmac360', category: 'Soluções e conhecimento', image: '/media/site-allmac.webp', url: 'https://allmac-sc.com.br', domain: 'allmac-sc.com.br', text: 'Apresentação das soluções têxteis, aplicações e conhecimento técnico em uma navegação integrada.' },
  { slug: 'esblight', title: 'ESB Light', category: 'Site e ecossistema digital', image: '/media/site-esblight.webp', url: 'https://www.esblight.com.br', domain: 'esblight.com.br', text: 'Produtos, aplicações e canais de relacionamento para uma marca de iluminação profissional.' },
];

export const faq = [
  ['Como a Delumo escolhe a solução para a minha empresa?', 'Começamos pelo objetivo, pelo público e pela rotina da operação. A partir disso, definimos se o projeto pede uma trilha de treinamento, um game, uma plataforma, uma experiência imersiva ou uma combinação dessas soluções.'],
  ['Vocês aproveitam o conteúdo que a empresa já tem?', 'Sim. Podemos organizar manuais, apresentações, processos e conhecimento dos especialistas em roteiros, aulas, atividades e experiências. A revisão e a aprovação do conteúdo fazem parte da construção com a empresa.'],
  ['Como as metodologias entram nos treinamentos?', 'O método depende do que a pessoa precisa aprender e fazer. Podemos combinar princípios de aprendizagem de adultos, prática experiencial, microlearning e simulações. Os objetivos e as avaliações são definidos para cada situação.'],
  ['É possível integrar o site a uma área de ensino ou a agentes de IA?', 'Sim. Desenvolvemos essas integrações sob medida, considerando os sistemas existentes, as permissões de acesso, as fontes de conteúdo e o fluxo de atendimento. O escopo é definido a partir das necessidades da operação.'],
  ['As experiências funcionam no celular?', 'Sites e plataformas são desenvolvidos para diferentes tamanhos de tela. Tours e experiências 3D são planejados conforme os dispositivos de uso; quando houver óculos VR ou requisitos específicos, isso é definido e testado no projeto.'],
];
