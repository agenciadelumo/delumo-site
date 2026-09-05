export const contact = {
  name: 'Guto da Luz',
  phone: '(54) 98130-2517',
  email: 'agenciadelumo@gmail.com',
  whatsapp: 'https://wa.me/5554981302517?text=Ol%C3%A1%2C%20Guto!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Delumo.',
  address: 'Rua Anita Garibaldi, 1473, Bela Vista, Erechim, RS',
};

export const clientBrands = [
  { file: 'heineken', name: 'Heineken', href: 'https://avantehotzone.com.br' },
  { file: 'spsul', name: 'SPSul', href: 'https://conquistahnk.com.br' },
  { file: 'incerti', name: 'Incerti Automotivos', href: 'https://www.comercialincerti.com.br' },
  { file: 'atacadao', name: 'Atacadão das Baterias', href: 'https://www.comercialincerti.com.br' },
  { file: 'brutus', name: 'Brutus', href: 'https://www.comercialincerti.com.br' },
  { file: 'metatrade', name: 'MetaTrade', href: 'https://meutour360.com/tour-360/bar-ab-correto' },
  { file: 'supreme', name: 'Supreme Lubrificantes', href: 'https://supremelub.com.br' },
  { file: 'allmac', name: 'Allmac360', href: 'https://allmac360.com' },
  { file: 'esblight', name: 'ESB Light', href: 'https://esblight.com.br' },
  { file: 'erbs', name: 'ERBS', href: 'https://erbs.com.br' },
];

export type Solution = {
  slug: string; number: string; name: string; short: string; icon: string;
  intro: string; description: string; image: string; imageAlt: string;
  applications: string[]; deliverables: string[]; outcome: string;
};

export const solutions: Solution[] = [
  {
    slug: 'treinamentos', number: '01', name: 'Treinamentos e trilhas', short: 'Aprendizagem sob medida para RH, vendas, segurança e cada setor.', icon: 'GraduationCap',
    intro: 'Pessoas preparadas para os desafios reais da sua empresa.',
    description: 'Transformamos apresentações, manuais, procedimentos e o conhecimento dos especialistas da empresa em treinamentos claros e reutilizáveis. Cada trilha organiza o que aprender, em qual sequência e como praticar, de acordo com o setor e a função. O objetivo é facilitar a integração, padronizar orientações e aproximar o conteúdo das tarefas reais de trabalho.',
    image: '/media/rh-equipe.webp', imageAlt: 'Imagem ilustrativa de integração e aprendizagem em equipe',
    applications: ['RH, cultura e integração de novos colaboradores', 'Produtos, atendimento, negociação e vendas', 'Liderança, comunicação, feedback e colaboração', 'Processos, rotinas administrativas e orientação sobre segurança'],
    deliverables: ['Diagnóstico, objetivos e trilhas de conhecimento por setor e função', 'Adaptação de apresentações, documentos e procedimentos em aulas e materiais de apoio', 'Roteiros, videoaulas, locução e avatares com a identidade da empresa', 'Casos, simulações, quizzes e questionários ligados à rotina', 'Revisão e aprovação com os responsáveis pelo conteúdo', 'Critérios de conclusão, acompanhamento da aprendizagem e atualização dos materiais'],
    outcome: 'O conteúdo certo, na sequência certa e em um formato que a equipe consegue aplicar.',
  },
  {
    slug: 'gamificacao', number: '02', name: 'Gamificação', short: 'Games, missões e rankings para engajar equipes e campanhas.', icon: 'Gamepad2',
    intro: 'Transforme a estratégia em missões que fazem sentido.',
    description: 'Criamos games corporativos que conectam o comportamento esperado às metas do negócio. Narrativa, desafios, pontuação, reconhecimento e feedback dão visibilidade à evolução individual e coletiva.',
    image: '/media/conquista.webp', imageAlt: 'Tela do jogo ConquistaHNK com territórios, pontos de venda e indicadores',
    applications: ['Campanhas de incentivo comercial', 'Execução e presença no ponto de venda', 'Integração e desafios de aprendizagem', 'Engajamento de equipes e redes de revendas'],
    deliverables: ['Conceito, identidade e regras do game', 'Missões, níveis, pontos e rankings', 'Painéis por equipe, região ou unidade', 'Integrações e acompanhamento conforme o projeto'],
    outcome: 'Uma experiência que traduz indicadores em ações e mostra ao time onde avançar.',
  },
  {
    slug: 'projetos-3d', number: '03', name: 'Projetos especiais 3D', short: 'Ambientes, produtos e simulações em três dimensões.', icon: 'Box',
    intro: 'Apresente o que ainda precisa ser visto, explorado ou compreendido.',
    description: 'Desenvolvemos ambientes, produtos e experiências digitais em 3D para explicar processos, demonstrar soluções e antecipar decisões. A tecnologia é escolhida de acordo com a experiência, o dispositivo e o objetivo de cada projeto.',
    image: '/media/metatrade.webp', imageAlt: 'Treinamento MetaTrade com os rostos dos participantes desfocados para preservar sua privacidade',
    applications: ['Simulação de pontos de venda e espaços comerciais', 'Visualização de produtos e soluções técnicas', 'Demonstrações de processos e operação', 'Apresentações interativas e experiências para eventos'],
    deliverables: ['Conceito visual, roteiro de navegação e cenários', 'Modelagem, materiais, iluminação e composição', 'Interações, pontos de informação e demonstrações', 'Otimização para os dispositivos definidos no projeto'],
    outcome: 'Uma representação visual que ajuda a entender, treinar e decidir com mais contexto.',
  },
  {
    slug: 'plataformas', number: '03', name: 'Plataformas inteligentes', short: 'Ensino, acompanhamento e sistemas conectados à sua empresa.', icon: 'PanelsTopLeft',
    intro: 'Sites, ensino e ferramentas internas conectados às necessidades da sua empresa.',
    description: 'Além de produzir os treinamentos, desenvolvemos a plataforma personalizada para disponibilizar aulas, organizar trilhas e acompanhar os alunos. Perfis de acesso, percursos por cargo ou setor e indicadores são definidos conforme a operação. Quando necessário, também desenvolvemos APIs para integrar a solução ao ERP ou aplicativo de RH, conforme a disponibilidade técnica e as permissões dos sistemas. Nossa atuação inclui sites, catálogos, áreas de clientes e agentes de IA em Next.js.',
    image: '/media/site-supreme.webp', imageAlt: 'Site da Supreme Lubrificantes desenvolvido pela Delumo',
    applications: ['Sites institucionais, catálogos e páginas para campanhas', 'Ambientes de ensino com trilhas por setor, aulas e avaliações integradas', 'Áreas de clientes, parceiros e equipes com acesso por perfil', 'Agentes de IA, bases de conhecimento e automação de atendimento'],
    deliverables: ['Plataforma com identidade visual, navegação e recursos definidos para a empresa', 'Gestão de alunos, turmas, setores e permissões por perfil', 'Videoaulas, avatares, materiais de apoio, quizzes e trilhas de conhecimento', 'Painéis de participação, progresso, avaliações e conclusão por aluno e equipe', 'Desenvolvimento de API para ERP ou aplicativo de RH, conforme viabilidade técnica e escopo', 'Desenvolvimento responsivo em Next.js, otimização de carregamento e controles de acesso'],
    outcome: 'Do conteúdo ao acompanhamento: uma experiência de ensino conectada à rotina da empresa.',
  },
  {
    slug: 'imersao', number: '04', name: 'Experiências imersivas', short: 'Projetos 3D, tours 360° e realidade virtual para explorar e aprender.', icon: 'ScanEye',
    intro: 'Leve as pessoas para dentro da experiência.',
    description: 'Reunimos projetos especiais 3D, tours 360° e realidade virtual em experiências para aprender, apresentar e simular. Modelamos produtos, espaços e situações de trabalho, com materiais, iluminação e interações que ajudam a compreender o contexto. O visitante explora detalhes, acompanha processos e pratica decisões por computador, celular ou óculos VR, conforme o projeto.',
    image: '/assets/img/treinamento-metatrade.jpg', imageAlt: 'Participantes exploram um treinamento imersivo da Delumo com óculos de realidade virtual',
    applications: ['Onboarding e visitas virtuais à empresa', 'Simulação e treinamento de execução no ponto de venda', 'Visualização técnica de produtos, equipamentos e processos', 'Apresentações comerciais, eventos e showrooms virtuais', 'Cultura, turismo e experiências de marca'],
    deliverables: ['Conceito, roteiro e organização dos ambientes', 'Modelagem 3D, materiais, iluminação e composição', 'Captura 360° ou produção das cenas e pontos interativos', 'Vídeos, avatares e demonstrações integrados à navegação', 'Otimização para os dispositivos e suporte a VR conforme a experiência'],
    outcome: 'Mais proximidade com o ambiente real, mesmo à distância.',
  },
  {
    slug: 'rh', number: '06', name: 'Soluções para RH', short: 'Modernização de materiais de integração, conduta, qualidade, 5S e segurança.', icon: 'Users',
    intro: 'O conhecimento que sua empresa já tem pode ensinar muito melhor.',
    description: 'Transformamos PowerPoints, PDFs, manuais e procedimentos em treinamentos objetivos, visuais e fáceis de atualizar. Reorganizamos a apresentação, aprimoramos a linguagem e criamos jornadas para integrar novos colaboradores e reciclar as equipes atuais. RH, Segurança do Trabalho, Qualidade e gestores participam da revisão para manter o conteúdo alinhado à realidade da empresa.',
    image: '/media/immersive-team.webp', imageAlt: 'Representação de uma equipe em treinamento imersivo com realidade virtual',
    applications: ['Integração: história, cultura, orientações e rotinas por função', 'Código de conduta: convivência, responsabilidades e situações do cotidiano', 'Qualidade: instruções de trabalho, padronização e melhoria contínua', '5S: utilização, organização, limpeza, padronização e autodisciplina', 'Segurança do Trabalho: conscientização, prevenção e procedimentos internos', 'Reciclagem de equipes, atualização de processos e capacitação comercial'],
    deliverables: ['Diagnóstico dos materiais existentes e organização por tema, setor e público', 'Redesign de apresentações e materiais de apoio com a identidade da empresa', 'Roteiros, videoaulas com avatares, narração e demonstrações visuais', 'Trilhas de integração e reciclagem com atividades e verificação de compreensão', 'Revisão e aprovação dos conteúdos pelos responsáveis técnicos da empresa', 'Plataforma personalizada de ensino e acompanhamento dos alunos como parte opcional do projeto', 'Integração via API com ERP ou aplicativo de RH, quando necessária e tecnicamente viável'],
    outcome: 'Menos conteúdo disperso. Mais clareza para quem chega e desenvolvimento contínuo para quem já faz parte do time.',
  },
];

// Existing detail URLs remain available; navigation presents four service families.
export const primarySolutions = solutions.filter(item => !['rh', 'projetos-3d'].includes(item.slug));

export const trainingGroups = [
  { name: 'Integração e cultura', icon: 'Users', title: 'O primeiro passo com mais clareza.', text: 'Cultura, conduta e rotinas da função em uma jornada reutilizável para novas equipes. Orientações consistentes, exemplos do trabalho e conteúdos que podem ser revisitados.', modules: ['Boas-vindas e propósito', 'Cultura e conduta', 'Rotina da função', 'Prática e acompanhamento'] },
  { name: 'Vendas e produtos', icon: 'Target', title: 'Conhecimento técnico que chega ao cliente.', text: 'Portfólio, aplicação, abordagem e negociação conectados a situações reais de atendimento e execução comercial.', modules: ['Conhecer o portfólio', 'Entender a necessidade', 'Simular o atendimento', 'Aplicar e receber feedback'] },
  { name: 'Liderança e pessoas', icon: 'MessagesSquare', title: 'Competências para trabalhar melhor em equipe.', text: 'Comunicação, feedback, autogestão, tomada de decisão e colaboração desenvolvidos com casos e exercícios do dia a dia.', modules: ['Autoconhecimento', 'Comunicação e escuta', 'Conversas e decisões', 'Plano de desenvolvimento'] },
  { name: 'Processos e operação', icon: 'Workflow', title: 'Um padrão claro para cada atividade.', text: 'Qualidade, 5S, instruções de trabalho e conscientização sobre segurança em orientações visuais. Conteúdo revisado pelos responsáveis técnicos e atualizado conforme os processos da empresa.', modules: ['Entender o padrão', 'Observar a execução', 'Praticar com contexto', 'Revisar e melhorar'] },
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
  { title: 'Desenvolver', text: 'Conteúdo, design e tecnologia, com apoio de IA quando adequado e revisão dos responsáveis da empresa.' },
  { title: 'Colocar em prática', text: 'Testes, implantação e acompanhamento da experiência.' },
  { title: 'Evoluir', text: 'Aprendizados, ajustes e novas possibilidades.' },
];

export const websiteCases = [
  { slug: 'supreme', title: 'Supreme Lubrificantes', category: 'Site e catálogo técnico', image: '/media/site-supreme.webp', url: 'https://www.supremelub.com.br', domain: 'supremelub.com.br', text: 'Portfólio organizado por aplicação, fichas técnicas e conteúdo para apoiar a jornada comercial.' },
  { slug: 'allmac360', title: 'Allmac360', category: 'Soluções e conhecimento', image: '/media/site-allmac.webp', url: 'https://allmac-sc.com.br', domain: 'allmac-sc.com.br', text: 'Apresentação das soluções têxteis, aplicações e conhecimento técnico em uma navegação integrada.' },
  { slug: 'esblight', title: 'ESB Light', category: 'Site e ecossistema digital', image: '/media/site-esblight.webp', url: 'https://www.esblight.com.br', domain: 'esblight.com.br', text: 'Produtos, aplicações e canais de relacionamento para uma marca de iluminação profissional.' },
];

export const faq = [
  ['Vocês também desenvolvem a plataforma para os treinamentos?', 'Sim. Criamos a plataforma personalizada para disponibilizar os conteúdos e acompanhar os alunos, com identidade da empresa, trilhas por função, gestão de turmas, avaliações e relatórios definidos no projeto. Também podemos desenvolver APIs para conectar o ambiente ao ERP ou aplicativo de RH, após analisar os sistemas, os dados e as permissões necessárias.'],
  ['Como a Delumo escolhe a solução para a minha empresa?', 'Começamos pelo objetivo, pelo público e pela rotina da operação. A partir disso, definimos se o projeto pede uma trilha de treinamento, um game, uma plataforma, uma experiência imersiva ou uma combinação dessas soluções.'],
  ['Vocês aproveitam o conteúdo que a empresa já tem?', 'Sim. Apresentações em PowerPoint, PDFs, documentos, vídeos e conhecimento dos especialistas podem servir de base. Selecionamos o que é relevante, organizamos a sequência e adaptamos a linguagem em roteiros, aulas e atividades com a identidade da empresa. Os responsáveis pelo conteúdo participam da revisão e da aprovação.'],
  ['Como acompanhar se o treinamento está funcionando?', 'Definimos os critérios antes da produção: participação, conclusão das etapas, compreensão nas avaliações e aplicação na rotina. Conforme o projeto, podemos desenvolver relatórios por pessoa ou equipe e combinar esses registros com feedback dos gestores para orientar reforços e atualizações.'],
  ['Como as metodologias entram nos treinamentos?', 'O método depende do que a pessoa precisa aprender e fazer. Podemos combinar princípios de aprendizagem de adultos, prática experiencial, microlearning e simulações. Os objetivos e as avaliações são definidos para cada situação.'],
  ['É possível integrar o site a uma área de ensino ou a agentes de IA?', 'Sim. Desenvolvemos essas integrações sob medida, considerando os sistemas existentes, as permissões de acesso, as fontes de conteúdo e o fluxo de atendimento. O escopo é definido a partir das necessidades da operação.'],
  ['As experiências funcionam no celular?', 'Sites e plataformas são desenvolvidos para diferentes tamanhos de tela. Tours e experiências 3D são planejados conforme os dispositivos de uso; quando houver óculos VR ou requisitos específicos, isso é definido e testado no projeto.'],
];
