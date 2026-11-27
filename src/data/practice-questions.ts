import type { LevelId, TopicId } from "@/stores/practice-store"

export type PracticeQuestion = {
  id: string
  category: string
  prompt: string
  translation: string
}

export const practiceQuestions: Record<TopicId, Record<LevelId, PracticeQuestion[]>> = {
  "system-design": {
    senior: [
      {
        id: "sd-senior-1",
        category: "System Design",
        prompt:
          "Design a real-time activity feed in a web application that receives high-frequency updates while the user is scrolling or filtering items. How would you prevent UI jank, manage incoming updates, and handle temporary connection drops?",
        translation:
          "Desenhe um feed de atividades em tempo real em uma aplicação web que recebe atualizações em alta frequência enquanto o usuário rola a tela ou filtra itens. Como você evitaria travamentos na UI, gerenciaria as atualizações recebidas e lidaria com quedas temporárias de conexão?",
      },
      {
        id: "sd-senior-2",
        category: "System Design",
        prompt:
          "Imagine you are building a complex multi-step submission workflow with autosave, optimistic updates, and cross-step validation. How would you structure client state, handle failed saves or retries, and protect users from losing progress?",
        translation:
          "Imagine que você está construindo um fluxo complexo em várias etapas com salvamento automático, atualizações otimistas e validação entre etapas. Como você estruturaria o estado no cliente, lidaria com falhas de salvamento ou novas tentativas e evitaria que o usuário perca o progresso?",
      },
      {
        id: "sd-senior-3",
        category: "System Design",
        prompt:
          "Design the client-side data fetching and caching layer for a feature-rich dashboard that combines fast-changing operational data with slower reference data and partial API failures. How do you balance freshness, request deduplication, and fallback UI?",
        translation:
          "Desenhe a camada de busca e cache de dados no cliente para um dashboard rico em funcionalidades que combina dados operacionais que mudam rápido com dados de referência mais estáveis e falhas parciais de API. Como você equilibraria atualização dos dados, deduplicação de requisições e fallback na interface?",
      },
      {
        id: "sd-senior-4",
        category: "System Design",
        prompt:
          "How would you architect a large interactive data table or hierarchical tree in the browser supporting search, multi-column sorting, row selection, and smooth scrolling without degrading responsiveness?",
        translation:
          "Como você arquitetaria uma tabela de dados interativa grande ou uma árvore hierárquica no navegador com suporte a busca, ordenação por múltiplas colunas, seleção de linhas e rolagem fluida sem degradar a responsividade?",
      },
      {
        id: "sd-senior-5",
        category: "System Design",
        prompt:
          "Suppose two users or browser tabs edit the same resource while one experiences brief network latency. How would you design the client state flow, detect or prevent stale overwrites, and communicate conflicts clearly to the user?",
        translation:
          "Suponha que dois usuários ou abas do navegador editem o mesmo recurso enquanto um deles enfrenta latência de rede momentânea. Como você desenharia o fluxo de estado no cliente, detectaria ou evitaria sobrescritas desatualizadas e comunicaria conflitos com clareza ao usuário?",
      },
    ],
    staff: [
      {
        id: "sd-staff-1",
        category: "System Design",
        prompt:
          "Multiple product squads build on a shared web platform, and UI drift plus breaking changes in shared components are slowing down delivery. How would you design the platform architecture, versioning/rollout strategy, and governance model so squads can move fast without fragmenting the experience?",
        translation:
          "Várias squads de produto constroem sobre uma plataforma web compartilhada, e a falta de padronização na UI junto com breaking changes em componentes compartilhados estão desacelerando as entregas. Como você desenharia a arquitetura da plataforma, a estratégia de versionamento/rollout e o modelo de governança para que as squads avancem rápido sem fragmentar a experiência?",
      },
      {
        id: "sd-staff-2",
        category: "System Design",
        prompt:
          "A single large frontend codebase has become a bottleneck for release velocity, ownership clarity, and build/test times across several product teams. How would you evaluate modularization or micro-frontend boundaries, shared runtime dependencies, and migration trade-offs?",
        translation:
          "Um único codebase frontend grande virou um gargalo para a velocidade de release, clareza de dono e tempos de build/teste entre várias equipes de produto. Como você avaliaria fronteiras de modularização ou micro-frontends, dependências compartilhadas em runtime e os trade-offs da migração?",
      },
      {
        id: "sd-staff-3",
        category: "System Design",
        prompt:
          "You need to raise the reliability and performance bar across a large web product used in varied network and device conditions. How would you design end-to-end RUM/observability, performance budgets, and guardrail enforcement across teams without creating bureaucratic friction?",
        translation:
          "Você precisa elevar o padrão de confiabilidade e performance em um produto web grande usado em condições variadas de rede e dispositivo. Como você desenharia observabilidade/RUM ponta a ponta, budgets de performance e mecanismos de proteção entre os times sem criar burocracia excessiva?",
      },
      {
        id: "sd-staff-4",
        category: "System Design",
        prompt:
          "Your organization needs to migrate a critical legacy frontend architecture—such as an outdated state layer, routing model, or legacy framework—while product teams continue shipping features every week. How would you structure the incremental migration strategy, compatibility layers, and risk mitigation?",
        translation:
          "Sua organização precisa migrar uma arquitetura frontend legada crítica — como uma camada de estado antiga, modelo de rotas ou framework legado — enquanto as equipes de produto continuam entregando funcionalidades toda semana. Como você estruturaria a estratégia de migração incremental, camadas de compatibilidade e mitigação de riscos?",
      },
      {
        id: "sd-staff-5",
        category: "System Design",
        prompt:
          "Across multiple web applications and internal/external integrations, teams handle sensitive user data, authentication tokens, and third-party scripts. How would you design a scalable client security and privacy architecture and guide adoption across engineering teams?",
        translation:
          "Em múltiplas aplicações web e integrações internas/externas, os times lidam com dados sensíveis de usuários, tokens de autenticação e scripts de terceiros. Como você desenharia uma arquitetura escalável de segurança e privacidade no cliente e guiaria a adoção entre os times de engenharia?",
      },
    ],
  },
  frontend: {
    senior: [
      {
        id: "fe-senior-1",
        category: "Frontend Architecture",
        prompt:
          "How would you structure a large React application so product teams can ship independently without creating duplicated design systems or tightly coupled features?",
        translation:
          "Como você estruturaria uma aplicação React de grande porte para que as equipes de produto pudessem entregar funcionalidades de forma independente, sem duplicar sistemas de design ou criar dependências fortes entre funcionalidades?",
      },
      {
        id: "fe-senior-2",
        category: "Frontend Architecture",
        prompt:
          "A core application bundle has grown significantly as the product scaled. How would you identify the biggest opportunities to improve load time without compromising the user experience?",
        translation:
          "O bundle principal da aplicação cresceu bastante à medida que o produto escalou. Como você identificaria as melhores oportunidades para reduzir o tempo de carregamento sem comprometer a experiência do usuário?",
      },
      {
        id: "fe-senior-3",
        category: "Frontend Architecture",
        prompt:
          "How would you architect a global client-side error boundary and telemetry strategy to capture, contextualize, and recover from unhandled runtime exceptions gracefully?",
        translation:
          "Como você arquitetaria uma estratégia global de error boundaries e telemetria no cliente para capturar, contextualizar e se recuperar graciosamente de exceções não tratadas em tempo de execução?",
      },
      {
        id: "fe-senior-4",
        category: "Frontend Architecture",
        prompt:
          "When designing a plugin or extension system inside a web application, how do you isolate third-party code execution, control access to shared state, and maintain UI consistency?",
        translation:
          "Ao projetar um sistema de plugins ou extensões em uma aplicação web, como você isola a execução de código de terceiros, controla o acesso ao estado compartilhado e mantém a consistência da UI?",
      },
      {
        id: "fe-senior-5",
        category: "Frontend Architecture",
        prompt:
          "How do you evaluate and implement an effective asset delivery strategy (code splitting, dynamic imports, asset prefetching, and HTTP caching headers) for a globally distributed user base?",
        translation:
          "Como você avalia e implementa uma estratégia eficiente de entrega de assets (code splitting, importações dinâmicas, prefetching de assets e cabeçalhos de cache HTTP) para uma base de usuários distribuída globalmente?",
      },
    ],
    staff: [
      {
        id: "fe-staff-1",
        category: "Frontend Architecture",
        prompt:
          "How would you establish organization-wide frontend architectural standards, automated CI quality gates, and deprecation policies across 10+ autonomous engineering squads?",
        translation:
          "Como você me estabeleceria padrões arquiteturais de frontend para toda a organização, quality gates automatizados em CI e políticas de depreciação entre mais de 10 squads autônomas?",
      },
      {
        id: "fe-staff-2",
        category: "Frontend Architecture",
        prompt:
          "Evaluate the trade-offs of adopting Server-Driven UI (SDUI) versus traditional client rendering for a rapidly changing product surface. How would you design the JSON schema contract and runtime fallback mechanisms?",
        translation:
          "Avalie os trade-offs de adotar Server-Driven UI (SDUI) versus renderização tradicional no cliente para um produto com telas em evolução rápida. Como você desenharia o contrato de JSON schema e os mecanismos de fallback em runtime?",
      },
      {
        id: "fe-staff-3",
        category: "Frontend Architecture",
        prompt:
          "You are tasked with defining the multi-year technology roadmap for a core web application. How do you balance framework upgrades, tech debt retirement, and business revenue goals with executive leadership?",
        translation:
          "Você foi encarregado de definir o roadmap tecnológico de vários anos para uma aplicação web principal. Como você equilibra atualizações de framework, eliminação de débito técnico e metas de receita com a liderança executiva?",
      },
      {
        id: "fe-staff-4",
        category: "Frontend Architecture",
        prompt:
          "How do you design a robust zero-downtime deployment and canary release strategy for client assets, ensuring database migrations and API version mismatches do not break active browser sessions?",
        translation:
          "Como você projeta uma estratégia robusta de deploy zero-downtime e releases canary para assets de cliente, garantindo que migrações de banco e inconsistências de versão de API não quebrem sessões ativas no navegador?",
      },
      {
        id: "fe-staff-5",
        category: "Frontend Architecture",
        prompt:
          "Describe how you would design a cross-platform code-sharing strategy between Next.js/React web platforms and mobile webviews or React Native apps without creating tight coupling or bloated bundles.",
        translation:
          "Descreva como você desenharia uma estratégia de compartilhamento de código entre plataformas web Next.js/React e webviews mobile ou apps React Native sem criar acoplamento forte ou bundles inflados.",
      },
    ],
  },
  react: {
    senior: [
      {
        id: "react-senior-1",
        category: "React Internals",
        prompt:
          "A complex screen feels sluggish during user interactions even though its components use memoization. How would you investigate the render path and decide what to optimize?",
        translation:
          "Uma tela complexa parece lenta durante as interações, embora seus componentes usem memoização. Como você investigaria o fluxo de renderização e decidiria o que otimizar?",
      },
      {
        id: "react-senior-2",
        category: "React Internals",
        prompt:
          "Explain how concurrent rendering changes the way you think about expensive work, effects, and state updates in a React application.",
        translation:
          "Explique como a renderização concorrente muda a forma de pensar sobre operações custosas, effects e atualizações de estado em uma aplicação React.",
      },
      {
        id: "react-senior-3",
        category: "React Internals",
        prompt:
          "How do React 18/19 Server Components (RSC) change data fetching boundaries, state hydration, and bundle distribution compared to traditional client-side rendering?",
        translation:
          "Como os React 18/19 Server Components (RSC) alteram as fronteiras de busca de dados, hidratação de estado e distribuição de bundle em comparação à renderização tradicional no cliente?",
      },
      {
        id: "react-senior-4",
        category: "React Internals",
        prompt:
          "How do you manage complex asynchronous operations, cancellation tokens, and race conditions inside custom React hooks without leaking memory or causing stale state closures?",
        translation:
          "Como você gerencia operações assíncronas complexas, tokens de cancelamento e condições de corrida dentro de custom hooks do React sem vazar memória ou causar closures de estado desatualizadas?",
      },
      {
        id: "react-senior-5",
        category: "React Internals",
        prompt:
          "What are the internal mechanics of React Fiber's reconciliation phase versus commit phase, and how does priority scheduling work under heavy main thread load?",
        translation:
          "Quais são os mecanismos internos da fase de reconciliação versus fase de commit do React Fiber, e como funciona o agendamento de prioridades sob carga pesada na main thread?",
      },
    ],
    staff: [
      {
        id: "react-staff-1",
        category: "React Internals",
        prompt:
          "How would you build a custom React state management library or custom binding engine tailored for high-frequency real-time updates while bypassing standard top-down re-renders?",
        translation:
          "Como você construiria uma biblioteca própria de gerenciamento de estado React ou um engine de binding customizado para atualizações em tempo real em alta frequência, ignorando re-renderizações top-down padrão?",
      },
      {
        id: "react-staff-2",
        category: "React Internals",
        prompt:
          "Evaluate the architectural trade-offs between React Server Components, Static Site Generation (SSG), and Edge SSR for an enterprise application serving millions of dynamic requests daily.",
        translation:
          "Avalie os trade-offs arquiteturais entre React Server Components, Static Site Generation (SSG) e Edge SSR para uma aplicação enterprise que atende milhões de requisições dinâmicas diariamente.",
      },
      {
        id: "react-staff-3",
        category: "React Internals",
        prompt:
          "How would you design a unified React testing and quality strategy across unit, component isolation (Storybook), and end-to-end integration environments that scales across multiple squads?",
        translation:
          "Como você desenharia uma estratégia unificada de testes e qualidade em React abrangendo testes unitários, isolamento de componentes (Storybook) e ambientes de integração E2E que escala entre múltiplas squads?",
      },
      {
        id: "react-staff-4",
        category: "React Internals",
        prompt:
          "How do you diagnose and resolve deep-seated memory leaks, detached DOM nodes, and unbounded event listener accumulation in long-lived single-page React applications?",
        translation:
          "Como você diagnostica e resolve vazamentos de memória profundos, nós DOM desanexados e acúmulo ilimitado de event listeners em SPAs React de longa duração?",
      },
      {
        id: "react-staff-5",
        category: "React Internals",
        prompt:
          "If your organization decided to migrate from another UI library or legacy React setup to Next.js App Router and RSC, how would you design the core primitives, data-fetching guidelines, and component migration tree?",
        translation:
          "Se a sua organização decidisse migrar de outra biblioteca de UI ou setup React legado para o Next.js App Router com RSC, como você desenharia as primitivas core, as diretrizes de busca de dados e a árvore de migração de componentes?",
      },
    ],
  },
  behavioral: {
    senior: [
      {
        id: "beh-senior-1",
        category: "Behavioral (STAR)",
        prompt:
          "Tell me about a time you had to align several teams around a technical direction. How did you handle disagreement, and what changed because of your approach?",
        translation:
          "Conte sobre uma ocasião em que você precisou alinhar várias equipes em torno de uma direção técnica. Como lidou com as divergências e o que mudou por causa da sua abordagem?",
      },
      {
        id: "beh-senior-2",
        category: "Behavioral (STAR)",
        prompt:
          "Describe a difficult technical decision you made with incomplete information. What trade-offs did you consider, and what did you learn from the outcome?",
        translation:
          "Descreva uma decisão técnica difícil que você tomou com informações incompletas. Quais trade-offs considerou e o que aprendeu com o resultado?",
      },
      {
        id: "beh-senior-3",
        category: "Behavioral (STAR)",
        prompt:
          "Describe a situation where a major bug or outage occurred in production under your watch. How did you handle immediate triage, communication, and post-mortem resolution?",
        translation:
          "Descreva uma situação em que um bug crítico ou uma queda ocorreu em produção sob sua responsabilidade. Como você lidou com a triagem imediata, comunicação e resolução pós-mortem?",
      },
      {
        id: "beh-senior-4",
        category: "Behavioral (STAR)",
        prompt:
          "Tell me about a project where product requirements changed significantly near the delivery deadline. How did you manage scope trade-offs and communicate technical impacts with stakeholders?",
        translation:
          "Conte sobre um projeto em que os requisitos de produto mudaram drasticamente perto do prazo de entrega. Como você gerenciou os trade-offs de escopo e comunicou os impactos técnicos com os stakeholders?",
      },
      {
        id: "beh-senior-5",
        category: "Behavioral (STAR)",
        prompt:
          "Give an example of how you mentored a junior or mid-level engineer through a challenging technical problem without taking over the execution yourself.",
        translation:
          "Dê um exemplo de como você mentorou um engenheiro júnior ou pleno durante um problema técnico desafiador sem assumir a execução você mesmo.",
      },
    ],
    staff: [
      {
        id: "beh-staff-1",
        category: "Behavioral (STAR)",
        prompt:
          "Tell me about a time you advocated for a major architectural initiative that leadership initially pushed back on. How did you build the business case, secure buy-in, and execute?",
        translation:
          "Conte sobre uma ocasião em que você defendeu uma iniciativa arquitetural relevante que a liderança inicialmente recusou. Como você construiu o case de negócio, obteve aprovação e executou?",
      },
      {
        id: "beh-staff-2",
        category: "Behavioral (STAR)",
        prompt:
          "Describe a situation where two senior engineering leads had fundamentally opposing technical visions for a platform. How did you resolve the conflict and establish alignment?",
        translation:
          "Descreva uma situação em que dois lideres técnicos seniores tinham visões técnicas fundamentalmente opostas para uma plataforma. Como você resolveu o conflito e estabeleceu o alinhamento?",
      },
      {
        id: "beh-staff-3",
        category: "Behavioral (STAR)",
        prompt:
          "Tell me about a strategic engineering failure or missed deadline that impacted the wider organization. What root causes did you identify, and how did you reshape engineering culture afterward?",
        translation:
          "Conte sobre uma falha estratégica de engenharia ou um prazo perdido que impactou a organização como um todo. Quais causas raízes você identificou e como reformulou a cultura de engenharia depois?",
      },
      {
        id: "beh-staff-4",
        category: "Behavioral (STAR)",
        prompt:
          "How do you evaluate when to build custom technology in-house versus buy an existing commercial or open-source solution when scaling engineering platform capabilities?",
        translation:
          "Como você avalia quando construir tecnologia sob medida internamente versus comprar uma solução comercial ou open-source existente ao escalar as capacidades da plataforma de engenharia?",
      },
      {
        id: "beh-staff-5",
        category: "Behavioral (STAR)",
        prompt:
          "Describe how you influence engineering culture, technical hiring bars, and promotion criteria across an engineering organization without direct line management authority.",
        translation:
          "Descreva como você influencia a cultura de engenharia, a régua de contratação técnica e os critérios de promoção em uma organização de engenharia sem autoridade direta de gestão de pessoas.",
      },
    ],
  },
}