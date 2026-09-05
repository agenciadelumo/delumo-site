export const academyCourses = [
  { title: 'Conceitos de iluminação', description: 'Entender a luz para orientar melhor.', intro: 'Introdução à AcademiaESB', modules: ['Tensão de alimentação', 'Fotometria', 'Iluminância x luminância', 'Distribuição fotométrica', 'Ofuscamento', 'Projeto luminotécnico', 'Eficácia luminosa', 'Fator de potência', 'Taxa de distorção harmônica', 'Temperatura de cor', 'IRC', 'Proteção IP', 'Grau de impacto IK', 'Vida útil'] },
  { title: 'Produtos e especificações', description: 'Transformar dados técnicos em argumentos.', modules: ['Profissional x varejo', 'Anatomia', 'Lentes e óptica', 'Driver', 'Proteções', 'Certificações', 'Como ler uma ficha técnica'] },
  { title: 'Portfólio ESB', description: 'Conectar cada linha à aplicação do cliente.', intro: 'Portfólio ESBLight', modules: ['Conhecendo as linhas', 'Modular', 'Linear', 'Projetor Slim', 'Projetor Modular', 'Projetor Blindado', 'Decorativa', 'Pública', 'Cases', 'Referência rápida'], supplement: 'Referência rápida, complemento' },
];

export const trainingSectors = [
  { id: 'rh', icon: 'Users', title: 'RH e pessoas', text: 'Integração, cultura, código de conduta, liderança, comunicação e reciclagem. Percursos por cargo, unidade e momento da carreira.' },
  { id: 'seguranca', icon: 'ShieldCheck', title: 'Segurança do Trabalho', text: 'Uso, conservação e limites dos EPIs, percepção de riscos e procedimentos internos. Conteúdos e práticas definidos e validados pelos responsáveis de SST.' },
  { id: 'comercial', icon: 'Target', title: 'Comercial e televendas', text: 'Portfólio, diagnóstico da necessidade, argumentação, negociação e pós-venda. Jornadas específicas para vendas externas, atendimento e televendas.' },
  { id: 'trade', icon: 'Store', title: 'Trade marketing', text: 'Execução no PDV, exposição de produtos, campanhas, materiais de comunicação e rotinas de promotores e supervisores.' },
  { id: 'ti', icon: 'Monitor', title: 'TI e aplicativos', text: 'Funcionalidades de sistemas, rotinas de aplicativos, uso de ferramentas digitais e boas práticas de segurança da informação.' },
  { id: 'administrativo', icon: 'Workflow', title: 'Administrativo e operações', text: 'Processos, qualidade, 5S, atendimento interno e instruções de trabalho. Orientações visuais para padronizar tarefas e reduzir dúvidas recorrentes.' },
  { id: 'financeiro', icon: 'ChartNoAxesCombined', title: 'Financeiro e fiscal', text: 'Faturamento, cobrança, conferências e rotinas do ERP. Procedimentos e atualizações revisados pelos especialistas da empresa.' },
  { id: 'franquias', icon: 'Network', title: 'Franquias e formação técnica', text: 'Manuais de operação, padrões da marca e cursos sobre produtos e equipamentos. Sequências adaptadas à função, com prática supervisionada quando necessária.' },
];

export const learningDeliverables = [
  { icon: 'Search', title: 'Pesquisa e diagnóstico', text: 'Conversamos com gestores e especialistas, analisamos os materiais e mapeamos as tarefas, as dúvidas e as competências que precisam evoluir.' },
  { icon: 'Workflow', title: 'Arquitetura da trilha', text: 'Definimos objetivos, pré-requisitos, cursos, módulos e avaliações. A metodologia acompanha o público e a aplicação esperada no trabalho.' },
  { icon: 'Play', title: 'Produção do conteúdo', text: 'Criamos roteiros, apresentações, videoaulas, avatares, demonstrações de sistemas e materiais de apoio com a identidade da empresa.' },
  { icon: 'CircleCheck', title: 'Validação e evolução', text: 'Os responsáveis da empresa revisam o conteúdo. Testamos a experiência, acompanhamos a aprendizagem e planejamos atualizações e reforços.' },
];

export const demoQuestions = [
  { question: 'Antes de indicar um produto ao cliente, qual deve ser o primeiro passo?', options: ['Escolher o item mais barato do catálogo.', 'Entender a aplicação e a necessidade do cliente.', 'Apresentar somente a potência do produto.'], answer: 1, feedback: 'Uma venda consultiva começa pelo contexto. A aplicação e a necessidade orientam a escolha e os argumentos.' },
  { question: 'Qual material ajuda a conferir as características de uma luminária?', options: ['Somente uma foto do produto.', 'A quantidade de seguidores da marca.', 'A ficha técnica do modelo.'], answer: 2, feedback: 'A ficha técnica reúne especificações que apoiam a comparação. A indicação deve considerar o projeto e a orientação técnica.' },
  { question: 'Um aluno concluiu as aulas, mas teve dificuldade no quiz. O que a trilha pode oferecer?', options: ['Feedback e revisão dos módulos relacionados.', 'Aprovação automática sem orientação.', 'Bloqueio definitivo do acesso.'], answer: 0, feedback: 'O resultado pode orientar uma revisão direcionada. Critérios de conclusão e novas tentativas são definidos para cada projeto.' },
];
