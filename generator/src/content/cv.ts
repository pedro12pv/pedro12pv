// Single source of truth for the site and the printable CV (ADR 0002).
// Every fact comes from Pedro's CV; ES is the original, EN its translation. Edit both together.

export type Lang = 'es' | 'en'
export type L = Record<Lang, string>

export const profile = {
  name: 'Pedro Puerta Vázquez',
  role: { es: 'Full Stack Java Developer', en: 'Full Stack Java Developer' },
  headline: { es: 'Java · Spring Boot · SQL · Microservicios', en: 'Java · Spring Boot · SQL · Microservices' },
  summary: {
    es: 'Desarrollador full stack en NTT DATA. Construyo microservicios con Java y Spring Boot, procesos de datos con Apache Airflow y Python, y las interfaces que los usan.',
    en: 'Full stack developer at NTT DATA. I build microservices with Java and Spring Boot, data processes with Apache Airflow and Python, and the interfaces that use them.',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/pedropuertavazquez',
    github: 'https://github.com/pedro12pv',
  },
}

export type SkillGroup = 'backend' | 'frontend' | 'data' | 'tools'

export const skillGroups: { id: SkillGroup; label: L }[] = [
  { id: 'backend', label: { es: 'Backend', en: 'Backend' } },
  { id: 'frontend', label: { es: 'Frontend', en: 'Frontend' } },
  { id: 'data', label: { es: 'Bases de datos', en: 'Databases' } },
  { id: 'tools', label: { es: 'Herramientas y metodologías', en: 'Tools and methodologies' } },
]

/** Skills exactly as listed in the CV, with a stable id used to trace them to roles. */
export const skills: { id: string; label: string; group: SkillGroup }[] = [
  ...['Java', 'Spring Boot', 'APIs REST', 'Spring Security', 'Microservicios', 'Spring Batch', 'Hibernate', 'MyBatis', 'Gradle', 'Maven', 'Python', 'Apache Airflow'].map((label) => ({ label, group: 'backend' as const })),
  ...['Thymeleaf', 'Angular', 'HTML', 'JavaScript', 'CSS', 'React', 'Bootstrap', 'Tailwind CSS', 'Diseño Responsive'].map((label) => ({ label, group: 'frontend' as const })),
  ...['Oracle', 'PostgreSQL', 'SQL / PL/SQL', 'MongoDB', 'Redis', 'Firebase'].map((label) => ({ label, group: 'data' as const })),
  ...['Git', 'Docker', 'CI/CD', 'Postman / Swagger', 'AWS', 'JUnit', 'IntelliJ IDEA', 'VS Code', 'Android Studio', 'Antigravity', 'Scrum', 'Metodologías Ágiles'].map((label) => ({ label, group: 'tools' as const })),
].map((s) => ({ ...s, id: slug(s.label) }))

/** Labels that differ in English (the rest are product names and stay as they are). */
export const skillLabelEn: Record<string, string> = {
  microservicios: 'Microservices',
  'disenio-responsive': 'Responsive design',
  'metodologias-agiles': 'Agile methodologies',
}

export type Experience = {
  id: string
  role: L
  company: string
  start: string // YYYY-MM
  end: string | null
  summary: L
  bullets: L[]
  skills: string[] // skill ids used in this role (from the CV bullets, plus tools Pedro confirmed per role)
}

export const experience: Experience[] = [
  {
    id: 'centers',
    role: { es: 'Centers Developer', en: 'Centers Developer' },
    company: 'NTT DATA',
    start: '2026-01',
    end: null,
    summary: {
      es: 'Desarrollo backend y full-stack en arquitectura de microservicios, asumiendo tareas de mayor complejidad técnica y automatización de procesos de datos.',
      en: 'Backend and full-stack development in a microservices architecture, taking on more technically complex work and data process automation.',
    },
    bullets: [
      { es: 'Desarrollo y evolución de microservicios utilizando Java y Spring Boot.', en: 'Building and evolving microservices with Java and Spring Boot.' },
      { es: 'Creación y mantenimiento de procesos Batch mediante Apache Airflow y Python.', en: 'Creating and maintaining batch processes with Apache Airflow and Python.' },
      { es: 'Integración de APIs REST y manejo avanzado de bases de datos relacionales (Oracle, PL/SQL).', en: 'Integrating REST APIs and advanced work with relational databases (Oracle, PL/SQL).' },
      { es: 'Análisis técnico de nuevos desarrollos y resolución de incidencias.', en: 'Technical analysis of new developments and incident resolution.' },
      { es: 'Participación en ceremonias Scrum, revisiones de código (code reviews) y control de versiones con Git.', en: 'Taking part in Scrum ceremonies, code reviews and version control with Git.' },
    ],
    skills: ['java', 'spring-boot', 'microservicios', 'python', 'apache-airflow', 'apis-rest', 'oracle', 'sql-pl-sql', 'maven', 'junit', 'postman-swagger', 'docker', 'aws', 'intellij-idea', 'scrum', 'metodologias-agiles', 'git'],
  },
  {
    id: 'junior',
    role: { es: 'Junior Developer', en: 'Junior Developer' },
    company: 'NTT DATA',
    start: '2024-06',
    end: '2026-01',
    summary: {
      es: 'Desarrollo y mantenimiento de aplicaciones web full-stack, trabajando con Java, JavaScript y SQL para implementar funcionalidades, integrar servicios y resolver incidencias.',
      en: 'Developing and maintaining full-stack web applications, working with Java, JavaScript and SQL to implement features, integrate services and resolve incidents.',
    },
    bullets: [
      { es: 'Desarrollo de nuevas funcionalidades en microservicios con el ecosistema Spring.', en: 'Building new features in microservices with the Spring ecosystem.' },
      { es: 'Consumo y exposición de endpoints REST y creación de consultas SQL en Oracle.', en: 'Consuming and exposing REST endpoints and writing SQL queries in Oracle.' },
      { es: 'Implementación de vistas en el frontend usando Thymeleaf, HTML y Vanilla JavaScript.', en: 'Implementing frontend views with Thymeleaf, HTML and vanilla JavaScript.' },
      { es: 'Trabajo diario en un entorno ágil (Scrum) utilizando Git y herramientas de trabajo colaborativo.', en: 'Daily work in an agile (Scrum) environment using Git and collaboration tools.' },
    ],
    skills: ['java', 'spring-boot', 'microservicios', 'apis-rest', 'oracle', 'sql-pl-sql', 'thymeleaf', 'html', 'javascript', 'junit', 'postman-swagger', 'intellij-idea', 'scrum', 'metodologias-agiles', 'git'],
  },
  {
    id: 'practicas',
    role: { es: 'Prácticas formativas', en: 'Internship' },
    company: 'NTT DATA',
    start: '2024-03',
    end: '2024-06',
    summary: {
      es: 'Apoyo al equipo de desarrollo en la creación, mantenimiento y mejora de aplicaciones Java empresariales.',
      en: 'Supporting the development team in building, maintaining and improving enterprise Java applications.',
    },
    bullets: [
      { es: 'Desarrollo de aplicaciones full-stack con Java, Spring, MyBatis y SQL.', en: 'Full-stack application development with Java, Spring, MyBatis and SQL.' },
      { es: 'Resolución de bugs, soporte técnico y optimización de consultas a base de datos.', en: 'Bug fixing, technical support and database query optimization.' },
      { es: 'Mantenimiento y pruebas básicas de APIs REST existentes.', en: 'Maintenance and basic testing of existing REST APIs.' },
    ],
    skills: ['java', 'spring-boot', 'mybatis', 'sql-pl-sql', 'apis-rest', 'junit', 'postman-swagger', 'intellij-idea'],
  },
]

export const education: { id: string; title: L; school: string; start: string; end: string | null }[] = [
  { id: 'uoc', title: { es: 'Ingeniería Informática', en: 'Computer Engineering (BSc)' }, school: 'Universitat Oberta de Catalunya', start: '2026', end: null },
  { id: 'dam', title: { es: 'CFGS Desarrollo de Aplicaciones Multiplataforma', en: 'Higher VET Diploma in Multiplatform Application Development' }, school: 'I.E.S. Mare Nostrum', start: '2022', end: '2024' },
  { id: 'turismo', title: { es: 'Grado en Turismo', en: 'Degree in Tourism' }, school: 'Universidad de Alicante', start: '2014', end: '2020' },
]

export const languages: { name: L; level: L }[] = [
  { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' } },
  { name: { es: 'Inglés', en: 'English' }, level: { es: 'Avanzado B2', en: 'Upper-intermediate B2' } },
  { name: { es: 'Catalán', en: 'Catalan' }, level: { es: 'Intermedio', en: 'Intermediate' } },
]

/** What makes the profile different, written as architecture decision records. */
export const decisions: { id: string; title: L; context: L; decision: L }[] = [
  {
    id: 'ADR-001',
    title: { es: 'Cambio de carrera', en: 'Career change' },
    context: { es: 'Grado en Turismo (2014–2020).', en: 'Degree in Tourism (2014–2020).' },
    decision: { es: 'Pasarme al desarrollo de software: CFGS DAM (2022–2024) y prácticas en NTT DATA.', en: 'Move into software development: VET diploma in application development (2022–2024) and an internship at NTT DATA.' },
  },
  {
    id: 'ADR-002',
    title: { es: 'Microservicios y datos', en: 'Microservices and data' },
    context: { es: 'Servicios Spring Boot y procesos batch en NTT DATA.', en: 'Spring Boot services and batch processes at NTT DATA.' },
    decision: { es: 'Cubrir de punta a punta: APIs REST, Oracle/PL-SQL y pipelines con Airflow y Python.', en: 'Work end to end: REST APIs, Oracle/PL-SQL and pipelines with Airflow and Python.' },
  },
  {
    id: 'ADR-003',
    title: { es: 'Aprendizaje continuo', en: 'Continuous learning' },
    context: { es: 'Desarrollador en NTT DATA desde 2024.', en: 'Developer at NTT DATA since 2024.' },
    decision: { es: 'Cursar Ingeniería Informática en la UOC mientras trabajo.', en: 'Study Computer Engineering at UOC while working.' },
  },
]

export const skillLabel = (id: string, lang: Lang) => {
  const s = skills.find((x) => x.id === id)
  return (lang === 'en' && skillLabelEn[id]) || s?.label || id
}

export function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/ñ/g, 'ni')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
