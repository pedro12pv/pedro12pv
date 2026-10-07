// Generates the GitHub profile README (ADR 0006) into github-profile/: README.md (EN),
// README.es.md (ES) and the dot-matrix SVGs they embed, in light and dark. Same data as the
// site (cv.ts, portrait.ts). Also bundles itself with its data and a monthly workflow so the
// folder is the whole pedro12pv/pedro12pv repo: npm run profile
// With OUT_DIR set (the workflow, inside the profile repo) it only writes the README and assets.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { experience, profile, skillGroups, skillLabel, skills } from '../src/content/cv.ts'
import { portraitRows, portraitSize } from '../src/content/portrait.ts'

const standalone = !process.env.OUT_DIR
const out = standalone ? new URL('../github-profile/', import.meta.url) : pathToFileURL(`${resolve(process.env.OUT_DIR)}${sep}`)
if (standalone) rmSync(out, { recursive: true, force: true })
rmSync(new URL('assets/', out), { recursive: true, force: true })
mkdirSync(new URL('assets/', out), { recursive: true })

const W = 900
const MONO = `'Departure Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
const themes = {
  light: { bg: '#ececea', fg: '#0d0d0d', fg2: '#4a4a4a', fg3: '#5e5e5e', rule: '#c9c9c6', unlit: '#d9d9d6', red: '#d71921', l: [1, 0.72, 0.48, 0.26] },
  dark: { bg: '#000000', fg: '#f2f2f2', fg2: '#a6a6a6', fg3: '#8a8a8a', rule: '#2a2a2a', unlit: '#1f1f1f', red: '#ff2a35', l: [0.32, 0.55, 0.8, 1] },
}

const T = {
  es: {
    kv: { employer: 'Empresa', stack: 'Stack', data: 'Datos' },
    active: 'activo',
    log: 'Experiencia',
    logMeta: (n, start) => `${n} entradas · ${start} → hoy · 1 punto = 1 mes`,
    stack: 'Tecnologías',
    stackMeta: (n, r) => `${n} tecnologías × ${r} puestos`,
    codes: { practicas: 'PRA', junior: 'JR', centers: 'CTR' },
    codesLegend: 'PRA prácticas · JR junior · CTR centers',
    used: 'usada en el puesto',
    notUsed: 'no usada en ese puesto',
    months: 'meses',
    now: 'Ahora: experimentando con IA y LLMs en el desarrollo, desde SDD hasta vibe coding.',
    contact: 'Contacto',
    other: 'EN',
    otherFile: 'README.md',
    headerAlt: 'Pedro Puerta Vázquez, Full Stack Java Developer. Retrato en matriz de puntos.',
    logAlt: (rows) => `Línea temporal de puestos, un punto por mes: ${rows}.`,
    stackAlt: (n, r) => `Matriz de ${n} tecnologías por ${r} puestos.`,
  },
  en: {
    kv: { employer: 'Employer', stack: 'Stack', data: 'Data' },
    active: 'active',
    log: 'Experience',
    logMeta: (n, start) => `${n} entries · ${start} → now · 1 dot = 1 month`,
    stack: 'Technologies',
    stackMeta: (n, r) => `${n} technologies × ${r} roles`,
    codes: { practicas: 'INT', junior: 'JR', centers: 'CTR' },
    codesLegend: 'INT internship · JR junior · CTR centers',
    used: 'used in the role',
    notUsed: 'not used in that role',
    months: 'months',
    now: 'Right now: experimenting with AI and LLMs in development, from SDD to vibe coding.',
    contact: 'Contact',
    other: 'ES',
    otherFile: 'README.es.md',
    headerAlt: 'Pedro Puerta Vázquez, Full Stack Java Developer. Dot-matrix portrait.',
    logAlt: (rows) => `Timeline of roles, one dot per month: ${rows}.`,
    stackAlt: (n, r) => `Matrix of ${n} technologies by ${r} roles.`,
  },
}

// 5×7 dot font, enough for uppercase titles; accented vowels draw a dot above.
const GLYPHS = {
  A: '01110 10001 10001 11111 10001 10001 10001',
  B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110',
  D: '11110 10001 10001 10001 10001 10001 11110',
  E: '11111 10000 10000 11110 10000 10000 11111',
  F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111',
  H: '10001 10001 10001 11111 10001 10001 10001',
  I: '01110 00100 00100 00100 00100 00100 01110',
  J: '00111 00010 00010 00010 00010 10010 01100',
  K: '10001 10010 10100 11000 10100 10010 10001',
  L: '10000 10000 10000 10000 10000 10000 11111',
  M: '10001 11011 10101 10101 10001 10001 10001',
  N: '10001 11001 10101 10011 10001 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110',
  P: '11110 10001 10001 11110 10000 10000 10000',
  Q: '01110 10001 10001 10001 10101 10010 01101',
  R: '11110 10001 10001 11110 10100 10010 10001',
  S: '01111 10000 10000 01110 00001 00001 11110',
  T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110',
  V: '10001 10001 10001 10001 10001 01010 00100',
  W: '10001 10001 10001 10101 10101 11011 10001',
  X: '10001 10001 01010 00100 01010 10001 10001',
  Y: '10001 10001 01010 00100 00100 00100 00100',
  Z: '11111 00001 00010 00100 01000 10000 11111',
}
const ACCENTS = { Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const f = (n) => +n.toFixed(2)

/** Text as dots: pitch = distance between dot centres. Returns circles and the drawn width. */
function dots(text, x, y, pitch, fill) {
  const r = pitch * 0.4
  let cx = x
  let svg = ''
  for (const ch of text.toUpperCase()) {
    if (ch === ' ') {
      cx += pitch * 3
      continue
    }
    const base = ACCENTS[ch] ?? ch
    const rows = GLYPHS[base]?.split(' ')
    if (!rows) continue
    rows.forEach((row, ry) =>
      [...row].forEach((v, rx) => {
        if (v === '1') svg += `<circle cx="${f(cx + rx * pitch + r)}" cy="${f(y + ry * pitch + r)}" r="${f(r)}"/>`
      }),
    )
    if (ACCENTS[ch]) svg += `<circle cx="${f(cx + 3 * pitch + r)}" cy="${f(y - 2.2 * pitch + r)}" r="${f(r)}"/>`
    cx += 6 * pitch
  }
  return { svg: `<g fill="${fill}">${svg}</g>`, width: cx - x - pitch }
}

const text = (x, y, s, { size = 12, fill, anchor = 'start', weight = 400, spacing = 0, upper = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" letter-spacing="${spacing}">${esc(upper ? s.toUpperCase() : s)}</text>`

const wrap = (h, c, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img" font-family="${MONO}">` +
  `<title>${esc(title)}</title><rect width="${W}" height="${h}" fill="${c.bg}"/>${body}</svg>`

const live = (cx, cy, r, c) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.red}"><animate attributeName="opacity" values="1;0.15;1" keyTimes="0;0.5;1" dur="1.6s" calcMode="discrete" repeatCount="indefinite"/></circle>`

// Months as integers; "now" is the generation month, so the live dot moves when you regenerate.
const ym = (s) => {
  const [y, m] = s.split('-').map(Number)
  return y * 12 + m - 1
}
const today = new Date()
const now = today.getFullYear() * 12 + today.getMonth()
const lastMonth = (end) => (end ? ym(end) - 1 : now)
const months = (r) => lastMonth(r.end) - ym(r.start) + 1
const chrono = [...experience].reverse()
const t0 = ym(chrono[0].start)
const span = now - t0 + 1
const current = experience.find((r) => !r.end) ?? experience[0]
const dataStack = ['apache-airflow', 'python', 'oracle', 'sql-pl-sql']

function header(lang, c) {
  const t = T[lang]
  const k = 8
  const matrix = portraitRows
    .map((row, y) =>
      [...row]
        .map((v, x) => {
          if (v === '.') return ''
          const fill = v === '0' ? c.unlit : c.fg
          const op = v === '0' ? '' : ` opacity="${c.l[+v - 1]}"`
          return `<circle cx="${f(x * k + k / 2)}" cy="${f(y * k + k / 2)}" r="${f(k * 0.36)}" fill="${fill}"${op}/>`
        })
        .join(''),
    )
    .join('')
  const H = portraitSize * k + 28
  const X = 380
  const name = profile.name.split(' ').map((w, i) => dots(w, X, 40 + i * 58, 6, c.fg).svg).join('')
  const kv = [
    [t.kv.employer, `${current.company} · ${current.role[lang]} · ${t.active}`],
    [t.kv.stack, profile.headline[lang]],
    [t.kv.data, dataStack.map((id) => skillLabel(id, lang)).join(' · ')],
  ]
  const rows = kv
    .map(([a, b], i) => {
      const y = 262 + i * 26
      return `<line x1="${X}" x2="${W - 24}" y1="${y - 18}" y2="${y - 18}" stroke="${c.rule}"/>${text(X, y, a, { size: 11, fill: c.fg3, spacing: 1, upper: true })}${text(X + 90, y, b, { size: 13, fill: c.fg })}`
    })
    .join('')
  const body =
    `<g transform="translate(24 14)">${matrix}</g>${name}` +
    live(X + 7, 230, 7, c) +
    text(X + 26, 236, profile.role[lang], { size: 19, fill: c.fg, upper: true }) +
    rows +
    `<line x1="${X}" x2="${W - 24}" y1="${262 + 3 * 26 - 18}" y2="${262 + 3 * 26 - 18}" stroke="${c.rule}"/>`
  return wrap(H, c, body, t.headerAlt)
}

function title(label, meta, c) {
  const d = dots(label, 24, 30, 4, c.fg)
  return d.svg + text(W - 24, 52, meta, { size: 12, fill: c.fg2, anchor: 'end', spacing: 1, upper: true })
}

function log(lang, c) {
  const t = T[lang]
  const x0 = 84
  const pitch = (W - 24 - 48 - x0) / span
  const r = Math.min(7.5, pitch * 0.34)
  const top = 96
  const rows = chrono
    .map((role, i) => {
      const y = top + i * 28
      const dotsRow = Array.from({ length: span }, (_, j) => {
        const m = t0 + j
        const on = m >= ym(role.start) && m <= lastMonth(role.end)
        const cx = f(x0 + j * pitch + pitch / 2)
        if (!on) return `<circle cx="${cx}" cy="${y}" r="${f(r)}" fill="${c.unlit}"/>`
        if (!role.end && m === now) return live(cx, y, f(r), c)
        return `<circle cx="${cx}" cy="${y}" r="${f(r)}" fill="${c.fg}"/>`
      }).join('')
      return (
        text(24, y + 4, t.codes[role.id], { size: 13, fill: c.fg, weight: 700 }) +
        dotsRow +
        text(W - 24, y + 4, `${months(role)}M`, { size: 13, fill: c.fg2, anchor: 'end' })
      )
    })
    .join('')
  const axisY = top + chrono.length * 28 + 4
  const axis = Array.from({ length: span }, (_, j) => ((t0 + j) % 12 === 0 || j === 0 ? text(f(x0 + j * pitch + pitch / 2 - 12), axisY, String(Math.floor((t0 + j) / 12)), { size: 12, fill: c.fg3 }) : '')).join('')
  const H = axisY + 54
  const dotted = (s) => s.replace('-', '.')
  const body =
    title(t.log, t.logMeta(experience.length, dotted(chrono[0].start)), c) +
    rows +
    axis +
    `<line x1="24" x2="${W - 24}" y1="${axisY + 18}" y2="${axisY + 18}" stroke="${c.rule}"/>` +
    text(24, axisY + 42, t.codesLegend, { size: 12, fill: c.fg2, spacing: 1, upper: true })
  const alt = chrono.map((role) => `${role.role[lang]}, ${months(role)} ${t.months}`).join('; ')
  return { svg: wrap(H, c, body, t.logAlt(alt)), alt: t.logAlt(alt) }
}

function stack(lang, c) {
  const t = T[lang]
  const cw = 402
  const rh = 26
  const top = 100
  const per = Math.max(...skillGroups.map((g) => skills.filter((s) => s.group === g.id).length))
  const block = 32 + 14 + per * rh + 28
  const body =
    title(t.stack, t.stackMeta(skills.length, experience.length), c) +
    skillGroups
      .map((g, gi) => {
        const x0 = 24 + (gi % 2) * (cw + 48)
        const y0 = top + Math.floor(gi / 2) * block
        const dx = (j) => f(x0 + cw - 3 * 24 + j * 24 + 12)
        const head =
          text(x0, y0, g.label[lang], { size: 14, fill: c.fg, weight: 700, upper: true }) +
          chrono.map((role, i) => text(dx(i), y0 + 24, t.codes[role.id], { size: 10, fill: c.fg3, anchor: 'middle' })).join('') +
          `<line x1="${x0}" x2="${x0 + cw}" y1="${y0 + 32}" y2="${y0 + 32}" stroke="${c.fg}"/>`
        const rows = skills
          .filter((s) => s.group === g.id)
          .map((s, i) => {
            const cy = y0 + 32 + 14 + i * rh
            const used = chrono.map((role) => role.skills.includes(s.id))
            return (
              `<line x1="${x0}" x2="${x0 + cw}" y1="${cy + 13}" y2="${cy + 13}" stroke="${c.rule}"/>` +
              text(x0, cy + 5, skillLabel(s.id, lang), { size: 14, fill: used.some(Boolean) ? c.fg : c.fg3 }) +
              used.map((u, j) => `<circle cx="${dx(j)}" cy="${cy}" r="6" fill="${u ? c.fg : c.unlit}"/>`).join('')
            )
          })
          .join('')
        return head + rows
      })
      .join('')
  const ly = top + Math.ceil(skillGroups.length / 2) * block
  const legend =
    `<circle cx="30" cy="${ly - 4}" r="6" fill="${c.fg}"/>` + text(44, ly, t.used, { size: 12, fill: c.fg2, spacing: 1, upper: true }) +
    `<circle cx="330" cy="${ly - 4}" r="6" fill="${c.unlit}"/>` + text(344, ly, t.notUsed, { size: 12, fill: c.fg2, spacing: 1, upper: true })
  return wrap(ly + 28, c, body + legend, t.stackAlt(skills.length, experience.length))
}

const logAlts = {}
for (const lang of ['es', 'en']) {
  for (const [name, c] of Object.entries(themes)) {
    const l = log(lang, c)
    logAlts[lang] = l.alt
    writeFileSync(new URL(`assets/header-${lang}-${name}.svg`, out), header(lang, c))
    writeFileSync(new URL(`assets/log-${lang}-${name}.svg`, out), l.svg)
    writeFileSync(new URL(`assets/stack-${lang}-${name}.svg`, out), stack(lang, c))
  }
}

const picture = (kind, lang, alt) =>
  `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="assets/${kind}-${lang}-dark.svg">\n  <img alt="${esc(alt)}" src="assets/${kind}-${lang}-light.svg" width="100%">\n</picture>`

for (const lang of ['es', 'en']) {
  const t = T[lang]
  const md = `<p align="right"><b>${lang.toUpperCase()}</b> · <a href="${t.otherFile}">${t.other}</a></p>

${picture('header', lang, t.headerAlt)}

${profile.summary[lang]}

> ${t.now}

${picture('log', lang, logAlts[lang])}

${picture('stack', lang, t.stackAlt(skills.length, experience.length))}

## ${t.contact}

- \`$\` open [linkedin.com/in/pedropuertavazquez](${profile.links.linkedin})
- \`$\` open [github.com/pedro12pv](${profile.links.github})
`
  writeFileSync(new URL(lang === 'en' ? 'README.md' : 'README.es.md', out), md)
}

if (standalone) {
  const here = (p) => fileURLToPath(new URL(p, import.meta.url))
  const to = (p) => fileURLToPath(new URL(p, out))
  cpSync(here('github-profile.mjs'), to('generator/scripts/github-profile.mjs'))
  cpSync(here('../src/content/cv.ts'), to('generator/src/content/cv.ts'))
  cpSync(here('../src/content/portrait.ts'), to('generator/src/content/portrait.ts'))
  cpSync(here('github-profile.workflow.yml'), to('.github/workflows/update-profile.yml'))
}
console.log('github-profile/ generated')
