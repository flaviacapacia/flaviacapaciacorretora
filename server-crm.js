const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const httpClient = require('http');
const httpsClient = require('https');
const { URL } = require('url');

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'database');
const DATA_FILE = path.join(DATA_DIR, 'crm-imoveis.json');
const EXPORTS_DIR = path.join(ROOT_DIR, 'exports');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads', 'documentacao');
const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap.xml');
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');
const BOT_AUTORIZACAO = path.join(ROOT_DIR, 'tools', 'bot_preencher_autorizacao.py');
const PLANILHA_AUTORIZACAO = path.join(ROOT_DIR, '1 AUTORIZAÇÃO DE VENDAS.xlsx');
const PORT = process.env.CRM_PORT || 8080;
const SITE_BASE_URL = process.env.SITE_BASE_URL || 'https://www.flaviacapaciacorretora.com';
const MAX_JSON_BODY_BYTES = Number(process.env.CRM_MAX_JSON_BODY_BYTES || 60 * 1024 * 1024);
const MAX_UPLOAD_FILE_BYTES = Number(process.env.CRM_MAX_UPLOAD_FILE_BYTES || 30 * 1024 * 1024);
const CRM_VERSION = '2026.02.13-server-controls';
const SERVER_STARTED_AT = new Date().toISOString();

const DEFAULT_CRM_USER = 'admin';
const DEFAULT_CRM_PASS = '123456';
const CRM_USER = process.env.CRM_USER || DEFAULT_CRM_USER;
const CRM_PASS = process.env.CRM_PASS || DEFAULT_CRM_PASS;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

const AUTH_FIELD_ORDER = [
  'proprietario_nome',
  'cpf',
  'rg',
  'telefone',
  'email',
  'endereco',
  'bairro',
  'cidade',
  'uf',
  'cep',
  'tipo_imovel',
  'valor_venda',
  'area_privativa',
  'dormitorios',
  'suites',
  'vagas',
  'matricula',
  'condominio',
  'codigo',
  'observacoes',
  'titulo',
  'negocio',
  'area_total',
  'descricao',
  'fotos',
  'proprietario',
  'documento',
  'telefone_proprietario',
  'email_proprietario',
  'observacoes_internas',
  'link_referencia',
];

const sessions = new Map();

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
}

function readImoveis() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveImoveis(data) {
  ensureStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(text);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_JSON_BODY_BYTES) {
        reject(new Error('Payload muito grande'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.csv') return 'text/csv; charset=utf-8';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.ico') return 'image/x-icon';
  return 'text/plain; charset=utf-8';
}

function sanitizeForCsv(value) {
  const text = String(value ?? '').replace(/\r?\n/g, ' ').trim();
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

function buildCsvFromImovel(item) {
  const headers = [
    'id', 'codigo', 'titulo', 'tipo', 'negocio', 'valor', 'endereco', 'bairro', 'cidade', 'condominio', 'descricao', 'fonteUrl', 'publicado',
  ];
  const values = headers.map(key => sanitizeForCsv(item?.[key] ?? ''));
  return `${headers.join(',')}\n${values.join(',')}\n`;
}

function buildHtmlFichaImovel(item) {
  const fotos = Array.isArray(item?.fotos) ? item.fotos : [];
  const fotosHtml = fotos.length
    ? fotos.map(url => `<img src="${String(url)}" style="max-width:220px;max-height:140px;margin:8px;border-radius:8px;border:1px solid #ddd;" />`).join('')
    : '<p>Sem imagens cadastradas.</p>';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ficha do Imóvel ${String(item?.codigo || item?.id || '')}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:24px;color:#222}
    h1{margin-bottom:4px}
    .muted{color:#666;margin-bottom:18px}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px}
    .full{grid-column:1/-1}
    .label{font-weight:700}
  </style>
</head>
<body>
  <h1>${String(item?.titulo || 'Imóvel')}</h1>
  <div class="muted">Gerado automaticamente pelo CRM</div>
  <div class="grid">
    <div><span class="label">Código:</span> ${String(item?.codigo || '-')}</div>
    <div><span class="label">Tipo:</span> ${String(item?.tipo || '-')}</div>
    <div><span class="label">Negócio:</span> ${String(item?.negocio || '-')}</div>
    <div><span class="label">Valor:</span> ${String(item?.valor || '-')}</div>
    <div><span class="label">Bairro:</span> ${String(item?.bairro || '-')}</div>
    <div><span class="label">Cidade:</span> ${String(item?.cidade || '-')}</div>
    <div class="full"><span class="label">Endereço:</span> ${String(item?.endereco || '-')}</div>
    <div class="full"><span class="label">Condomínio:</span> ${String(item?.condominio || '-')}</div>
    <div class="full"><span class="label">Descrição:</span><br>${String(item?.descricao || '-')}</div>
  </div>
  <h2>Imagens</h2>
  <div>${fotosHtml}</div>
</body>
</html>`;
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractCodeNumber(codigo) {
  const match = String(codigo || '').match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function collectCodeNumbersFromFiles(baseDir, acc = []) {
  if (!fs.existsSync(baseDir)) return acc;
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      collectCodeNumbersFromFiles(full, acc);
      continue;
    }
    if (!entry.isFile()) continue;
    const match = entry.name.match(/(?:apartamento|venda)-.*-v(\d+)\.html$/i);
    if (match) {
      acc.push(Number(match[1]));
    }
  }
  return acc;
}

function nextCodigoNumber() {
  let maxCode = 0;

  const numsRoot = collectCodeNumbersFromFiles(ROOT_DIR);
  const numsVenda = collectCodeNumbersFromFiles(path.join(ROOT_DIR, 'Imoveis_venda'));
  for (const num of [...numsRoot, ...numsVenda]) {
    if (Number.isFinite(num)) {
      maxCode = Math.max(maxCode, Number(num));
    }
  }

  const imoveis = readImoveis();
  for (const item of imoveis) {
    const numeric = extractCodeNumber(item.codigo);
    if (numeric) {
      maxCode = Math.max(maxCode, numeric);
    }
  }

  return maxCode ? maxCode + 1 : 450;
}

function normalizeCodigo(codigo) {
  const numeric = extractCodeNumber(codigo);
  const num = numeric || nextCodigoNumber();
  return `V${num}`;
}

function parseFotos(fotos) {
  if (!fotos) return [];
  if (Array.isArray(fotos)) {
    return fotos.map(item => String(item).trim()).filter(Boolean);
  }
  return String(fotos)
    .split(/\r?\n|,|;/)
    .map(item => item.trim())
    .filter(Boolean);
}

function isUrl(value = '') {
  return /^https?:\/\//i.test(String(value || '').trim());
}

function normalizePossibleUrl(value = '') {
  const text = String(value || '').trim();
  if (/^www\./i.test(text)) {
    return `https://${text}`;
  }
  return text;
}

function walkFilesRecursive(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFilesRecursive(full, acc);
      continue;
    }
    if (entry.isFile()) {
      acc.push(full);
    }
  }
  return acc;
}

function resolveExistingPath(inputPath = '') {
  const raw = String(inputPath || '').trim();
  if (!raw) return '';
  if (fs.existsSync(raw)) {
    return path.resolve(raw);
  }
  const fromRoot = path.resolve(ROOT_DIR, raw);
  if (fs.existsSync(fromRoot)) {
    return fromRoot;
  }
  return '';
}

function expandCaptureSources(fontesInput) {
  const rawSources = Array.isArray(fontesInput)
    ? fontesInput.map(item => String(item || '').trim()).filter(Boolean)
    : String(fontesInput || '')
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);

  const expanded = [];
  const allowedExt = new Set(['.pdf', '.docx', '.txt', '.md', '.csv']);

  for (const source of rawSources) {
    const normalizedSource = normalizePossibleUrl(source);
    if (!normalizedSource) continue;
    if (normalizedSource.startsWith('text:') || isUrl(normalizedSource)) {
      expanded.push(normalizedSource);
      continue;
    }

    const existingPath = resolveExistingPath(normalizedSource);
    if (existingPath) {
      const stat = fs.statSync(existingPath);
      if (stat.isDirectory()) {
        const files = walkFilesRecursive(existingPath)
          .filter(file => allowedExt.has(path.extname(file).toLowerCase()))
          .map(file => path.resolve(file));
        expanded.push(...files);
        continue;
      }
      expanded.push(path.resolve(existingPath));
      continue;
    }

    expanded.push(normalizedSource);
  }

  return expanded.filter(Boolean);
}

function sanitizeFileName(name = '') {
  return String(name || 'arquivo')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'arquivo';
}

function detectFileExtension(fileName = '', mime = '') {
  const cleanName = String(fileName || '').trim();
  let ext = path.extname(cleanName || '').toLowerCase().trim();

  if (!ext) {
    const fallbackByName = cleanName.match(/\.([a-zA-Z0-9]{2,8})$/);
    if (fallbackByName) {
      ext = `.${fallbackByName[1].toLowerCase()}`;
    }
  }

  if (!ext) {
    ext = guessExtensionByMime(mime);
  }

  ext = String(ext || '').replace(/[^a-z0-9.]/g, '');
  if (ext && !ext.startsWith('.')) {
    ext = `.${ext}`;
  }

  return ext;
}

function detectPythonCommand() {
  const candidates = ['python', 'py', 'python3'];
  for (const cmd of candidates) {
    const result = spawnSync(cmd, ['--version'], { encoding: 'utf8', timeout: 5000, shell: false });
    if (!result.error && result.status === 0) {
      return cmd;
    }
  }
  return '';
}

function extractDataUrl(fileData = '') {
  const match = String(fileData || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Formato de arquivo inválido (data URL esperado).');
  }
  return { mime: match[1], base64: match[2] };
}

function guessExtensionByMime(mime = '') {
  const value = String(mime || '').toLowerCase();
  if (value === 'application/pdf') return '.pdf';
  if (value === 'image/jpeg') return '.jpg';
  if (value === 'image/png') return '.png';
  if (value === 'image/webp') return '.webp';
  if (value === 'text/plain') return '.txt';
  if (value === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '.docx';
  return '';
}

function importExistingPages() {
  const imoveis = readImoveis();
  const byArquivo = new Set(
    imoveis
      .map(item => String(item.arquivoPublicado || '').trim().toLowerCase())
      .filter(Boolean)
  );

  const scanDirs = [ROOT_DIR, path.join(ROOT_DIR, 'Imoveis_venda')].filter(dir => fs.existsSync(dir));
  const candidates = [];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!/^(apartamento|venda)-.*-v\d+\.html$/i.test(entry.name)) continue;
      candidates.push({ dir, name: entry.name });
    }
  }

  for (const dir of scanDirs) {
    walkDir(dir);
  }

  let nextId = imoveis.length ? Math.max(...imoveis.map(item => item.id || 0)) + 1 : 1;
  let imported = 0;

  for (const file of candidates) {
    const key = file.name.toLowerCase();
    if (byArquivo.has(key)) continue;

    const fullPath = path.join(file.dir, file.name);
    const relativeFromRoot = `/${path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/')}`;
    const content = fs.readFileSync(fullPath, 'utf8');
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const imageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    const bairroSlug = file.name
      .replace(/\.html$/i, '')
      .replace(/^apartamento-venda-/i, '')
      .replace(/-v\d+$/i, '')
      .replace(/-/g, ' ');

    const codigo = normalizeCodigo(file.name.match(/v\d+/i)?.[0] || '');
    const tituloRaw = (h1Match?.[1] || titleMatch?.[1] || `Imóvel em ${bairroSlug}`).replace(/<[^>]+>/g, '').trim();
    const descricaoRaw = (descMatch?.[1] || '').replace(/<[^>]+>/g, '').trim();

    imoveis.push({
      id: nextId++,
      codigo,
      titulo: tituloRaw || `Imóvel em ${bairroSlug}`,
      tipo: 'Apartamento',
      negocio: 'Venda',
      valor: 'Consulte valores',
      endereco: '',
      bairro: bairroSlug || 'Florianópolis',
      cidade: 'Florianópolis/SC',
      condominio: '',
      descricao: descricaoRaw || 'Descrição importada de página já publicada.',
      fotos: imageMatch?.[1] ? [imageMatch[1]] : [],
      fonteUrl: '',
      documentacao: [],
      dadosPrivados: {},
      dadosCaptura: {},
      dadosPlanilha: {},
      publicado: true,
      arquivoPublicado: file.name,
      urlPublicada: relativeFromRoot,
      publicadoEm: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      origemImportacao: 'pagina-existente'
    });
    byArquivo.add(key);
    imported += 1;
  }

  if (imported > 0) {
    saveImoveis(imoveis);
  }

  return { imported, total: candidates.length };
}

function normalizeEmpty(value, fallback = '') {
  const clean = String(value || '').trim();
  if (!clean || clean.toUpperCase() === 'NÃO INFORMADO') {
    return fallback;
  }
  return clean;
}

function pickFirstField(source = {}, keys = [], fallback = '') {
  for (const key of keys) {
    const value = normalizeEmpty(source[key]);
    if (value) return value;
  }
  return fallback;
}

function stripThirdPartyMentions(text = '') {
  let cleaned = String(text || '');
  const patterns = [
    /\b(imobili[aá]ria|corretor(?:a)?|creci)\b[^\n\r]{0,180}/gi,
    /\b(anunciante|respons[aá]vel pelo an[uú]ncio)\b[^\n\r]{0,180}/gi,
  ];
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

function normalizeText(value = '') {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeCurrencyBR(value = '') {
  const raw = normalizeText(value);
  if (!raw || /^sob consulta$/i.test(raw) || /^consulte valores$/i.test(raw) || /^n[aã]o informado$/i.test(raw)) {
    return '';
  }
  const only = raw.replace(/[^0-9,\.]/g, '');
  if (!only) return '';
  let normalized = only;
  if (only.includes(',') && only.includes('.')) {
    normalized = only.replace(/\./g, '').replace(',', '.');
  } else if (only.includes(',') && !only.includes('.')) {
    normalized = only.replace(',', '.');
  }
  const numeric = Number.parseFloat(normalized);
  if (!Number.isFinite(numeric)) {
    return '';
  }
  return `R$ ${numeric.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function isMoneyLike(value = '') {
  return Boolean(normalizeCurrencyBR(value));
}

function parseCityState(value = '') {
  const text = normalizeText(value);
  if (!text) {
    return { cidade: 'Florianópolis', uf: 'SC' };
  }
  const parts = text.split('/').map(item => item.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { cidade: parts[0], uf: parts[1].toUpperCase() };
  }
  const match = text.match(/(.+?)\s*-\s*([A-Za-z]{2})$/);
  if (match) {
    return { cidade: normalizeText(match[1]), uf: match[2].toUpperCase() };
  }
  return { cidade: text, uf: 'SC' };
}

function formatDormitorios(value = '') {
  const match = String(value || '').match(/\d{1,2}/);
  if (!match) return '';
  const n = Number(match[0]);
  if (!n) return '';
  return `${n} dormitório${n > 1 ? 's' : ''}`;
}

function buildValidatedTitle(data = {}) {
  const tipo = normalizeText(data.tipo || data.tipo_imovel || 'Apartamento');
  const negocio = normalizeText(data.negocio || 'Venda');
  const dormitorios = formatDormitorios(data.quartos || data.dormitorios);
  const suites = formatDormitorios(data.suites).replace('dormitórios', 'suítes').replace('dormitório', 'suíte');
  const vagasMatch = String(data.vagas || '').match(/\d{1,2}/);
  const vagas = vagasMatch ? `${vagasMatch[0]} vaga${Number(vagasMatch[0]) > 1 ? 's' : ''}` : '';
  const diferencial = suites || vagas || '';
  const bairro = normalizeText(data.bairro || 'Florianópolis');
  const parsedCity = parseCityState(data.cidade || 'Florianópolis/SC');
  const base = `${tipo} à ${negocio}`;
  const dormitorioChunk = dormitorios ? ` com ${dormitorios}` : '';
  const difChunk = diferencial ? `, ${diferencial}` : '';
  return normalizeText(`${base}${dormitorioChunk}${difChunk} em ${bairro} ${parsedCity.cidade} ${parsedCity.uf}`);
}

function buildAuthorizationData(campos = {}) {
  const raw = { ...(campos || {}) };
  const completed = {};

  for (const [key, value] of Object.entries(raw)) {
    if (value == null) {
      completed[key] = '';
      continue;
    }
    if (typeof value === 'object') {
      completed[key] = String(value);
      continue;
    }
    completed[key] = normalizeText(value);
  }

  for (const field of AUTH_FIELD_ORDER) {
    completed[field] = normalizeText(raw[field] || '');
  }

  completed.proprietario_nome = completed.proprietario_nome || completed.proprietario || 'NÃO INFORMADO';
  completed.proprietario = completed.proprietario || completed.proprietario_nome || 'NÃO INFORMADO';
  completed.cpf = completed.cpf || (completed.documento.match(/[0-9\.\-]{11,14}/)?.[0] || 'NÃO INFORMADO');
  completed.telefone = completed.telefone || completed.telefone_proprietario || 'NÃO INFORMADO';
  completed.telefone_proprietario = completed.telefone_proprietario || completed.telefone || 'NÃO INFORMADO';
  completed.email = completed.email || completed.email_proprietario || 'NÃO INFORMADO';
  completed.email_proprietario = completed.email_proprietario || completed.email || 'NÃO INFORMADO';
  completed.tipo_imovel = completed.tipo_imovel || normalizeText(raw.tipo || 'Apartamento');
  completed.valor_venda = normalizeCurrencyBR(raw.valor_venda || raw.valor || '') || 'NÃO INFORMADO';
  completed.area_privativa = completed.area_privativa || raw.area_privativa || 'NÃO INFORMADO';
  completed.dormitorios = completed.dormitorios || raw.quartos || 'NÃO INFORMADO';
  completed.suites = completed.suites || raw.suites || 'NÃO INFORMADO';
  completed.vagas = completed.vagas || raw.vagas || 'NÃO INFORMADO';
  completed.codigo = completed.codigo || normalizeCodigo(raw.codigo || '');
  completed.titulo = completed.titulo || buildValidatedTitle({
    tipo: completed.tipo_imovel,
    negocio: completed.negocio || 'Venda',
    quartos: completed.dormitorios,
    suites: completed.suites,
    vagas: completed.vagas,
    bairro: completed.bairro,
    cidade: completed.cidade || 'Florianópolis/SC',
  });
  completed.negocio = completed.negocio || normalizeText(raw.negocio || 'Venda');
  completed.descricao = stripThirdPartyMentions(normalizeText(raw.descricao || raw.observacoes || '')) || 'NÃO INFORMADO';
  completed.observacoes = stripThirdPartyMentions(normalizeText(raw.observacoes || raw.observacoes_internas || '')) || 'NÃO INFORMADO';
  completed.observacoes_internas = stripThirdPartyMentions(normalizeText(raw.observacoes_internas || raw.observacoes || '')) || 'NÃO INFORMADO';
  completed.condominio = normalizeCurrencyBR(raw.condominio || '') || (normalizeText(raw.condominio || '') || 'NÃO INFORMADO');
  completed.endereco = completed.endereco || normalizeText(raw.logradouro || '') || 'NÃO INFORMADO';
  completed.bairro = completed.bairro || 'NÃO INFORMADO';
  completed.cidade = completed.cidade || 'Florianópolis/SC';
  completed.uf = completed.uf || parseCityState(completed.cidade).uf || 'SC';
  completed.fotos = normalizeText(raw.fotos || completed.fotos || '');
  completed.link_referencia = completed.link_referencia || normalizeText(raw.link_referencia || raw.fonteUrl || '');

  for (const field of AUTH_FIELD_ORDER) {
    if (!normalizeText(completed[field])) {
      completed[field] = 'NÃO INFORMADO';
    }
  }

  return completed;
}

function montarImovelFromCampos(campos = {}, fonte = '') {
  const auth = buildAuthorizationData({ ...campos, link_referencia: fonte || campos.link_referencia });
  const bairro = pickFirstField(campos, ['bairro'], 'Florianópolis');
  const cidade = pickFirstField(campos, ['cidade', 'uf'], 'Florianópolis/SC');
  const tipo = pickFirstField(campos, ['tipo_imovel', 'tipo'], 'Apartamento');
  const quartos = pickFirstField(campos, ['quartos', 'dormitorios']);
  const suites = pickFirstField(campos, ['suites']);
  const vagas = pickFirstField(campos, ['vagas']);
  const areaTotal = pickFirstField(campos, ['area_total']);
  const areaPrivativa = pickFirstField(campos, ['area_privativa']);
  const valor = normalizeCurrencyBR(pickFirstField(campos, ['valor', 'valor_venda'], '')) || 'Consulte valores';
  const descricaoBase = stripThirdPartyMentions(pickFirstField(campos, ['descricao', 'observacoes'], ''));

  const partes = [
    descricaoBase,
    quartos ? `Quartos: ${quartos}.` : '',
    suites ? `Suítes: ${suites}.` : '',
    vagas ? `Vagas: ${vagas}.` : '',
    areaPrivativa ? `Área privativa: ${areaPrivativa}.` : '',
    areaTotal ? `Área total: ${areaTotal}.` : '',
  ].filter(Boolean);

  return {
    codigo: normalizeCodigo(auth.codigo || pickFirstField(campos, ['codigo'], '')),
    titulo: buildValidatedTitle({
      tipo,
      negocio: pickFirstField(campos, ['negocio'], 'Venda'),
      quartos,
      suites,
      vagas,
      bairro,
      cidade,
    }),
    tipo,
    negocio: pickFirstField(campos, ['negocio'], 'Venda'),
    valor,
    endereco: pickFirstField(campos, ['endereco', 'logradouro']),
    bairro,
    cidade,
    condominio: normalizeCurrencyBR(pickFirstField(campos, ['condominio'])) || pickFirstField(campos, ['condominio']),
    descricao: partes.join(' '),
    fotos: parseFotos(campos.fotos || ''),
    fonteUrl: pickFirstField(campos, ['link_referencia'], normalizeEmpty(fonte)),
    dadosPrivados: {
      proprietario: pickFirstField(campos, ['proprietario', 'proprietario_nome']),
      documento: pickFirstField(campos, ['documento', 'cpf', 'rg']),
      telefone_proprietario: pickFirstField(campos, ['telefone_proprietario', 'telefone']),
      email_proprietario: pickFirstField(campos, ['email_proprietario', 'email']),
      matricula: pickFirstField(campos, ['matricula']),
      observacoes_internas: stripThirdPartyMentions(pickFirstField(campos, ['observacoes_internas', 'observacoes'])),
    },
    dadosCaptura: {
      data_captura: new Date().toISOString(),
      origem: normalizeEmpty(fonte || campos.link_referencia),
      campos_autorizacao: auth,
    },
    dadosPlanilha: auth,
    documentacao: [],
  };
}

function criarImovelBase(body, nextId) {
  const auth = buildAuthorizationData({
    ...(body.dadosPlanilha || {}),
    titulo: body.titulo,
    tipo: body.tipo,
    negocio: body.negocio,
    valor: body.valor,
    endereco: body.endereco,
    bairro: body.bairro,
    cidade: body.cidade,
    condominio: body.condominio,
    descricao: body.descricao,
    fotos: body.fotos,
    link_referencia: body.fonteUrl,
    codigo: body.codigo,
  });
  const condominioValor = normalizeCurrencyBR(body.condominio || auth.condominio || '');
  const condominioTextoLivre = normalizeText(body.condominio || auth.condominio || '');

  const valorNormalizado = normalizeCurrencyBR(body.valor || auth.valor_venda || '') || 'Consulte valores';
  const cidadeNormalizada = normalizeText(body.cidade || auth.cidade || 'Florianópolis/SC');
  const tipoNormalizado = normalizeText(body.tipo || auth.tipo_imovel || 'Apartamento');
  const negocioNormalizado = normalizeText(body.negocio || auth.negocio || 'Venda');
  const bairroNormalizado = normalizeText(body.bairro || auth.bairro || 'Florianópolis');
  const quartos = normalizeText(auth.dormitorios || body.quartos || '');

  return {
    id: nextId,
    codigo: normalizeCodigo(body.codigo || ''),
    titulo: buildValidatedTitle({
      tipo: tipoNormalizado,
      negocio: negocioNormalizado,
      quartos,
      suites: auth.suites,
      vagas: auth.vagas,
      bairro: bairroNormalizado,
      cidade: cidadeNormalizada,
    }),
    tipo: tipoNormalizado,
    negocio: negocioNormalizado,
    valor: valorNormalizado,
    endereco: normalizeText(body.endereco || auth.endereco || ''),
    bairro: bairroNormalizado,
    cidade: cidadeNormalizada,
    condominio: condominioValor || condominioTextoLivre || 'Sob consulta',
    descricao: stripThirdPartyMentions(normalizeText(body.descricao || auth.descricao || '')),
    fotos: parseFotos(body.fotos),
    fonteUrl: String(body.fonteUrl || '').trim(),
    documentacao: Array.isArray(body.documentacao) ? body.documentacao : [],
    dadosPrivados: body.dadosPrivados && typeof body.dadosPrivados === 'object' ? body.dadosPrivados : {},
    dadosCaptura: body.dadosCaptura && typeof body.dadosCaptura === 'object' ? body.dadosCaptura : {},
    dadosPlanilha: auth,
    publicado: false,
    arquivoPublicado: '',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
}

function publicarImovelPorIndice(imoveis, idx) {
  const current = imoveis[idx];
  const generated = buildPropertyHtml(current);
  const outputPath = path.join(ROOT_DIR, generated.fileName);
  fs.writeFileSync(outputPath, generated.html, 'utf8');
  const sitemapUpdated = ensureSitemapEntry(`/${generated.fileName}`);
  const indexUpdated = ensureIndexFeaturedCard(current, `/${generated.fileName}`);

  imoveis[idx] = {
    ...current,
    codigo: generated.codigo,
    publicado: true,
    arquivoPublicado: generated.fileName,
    urlPublicada: `/${generated.fileName}`,
    publicadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  return {
    id: imoveis[idx].id,
    titulo: imoveis[idx].titulo,
    url: imoveis[idx].urlPublicada,
    sitemapUpdated,
    indexUpdated,
  };
}

async function gerarAnunciosPrioritarios() {
  const prioridades = [
    {
      key: 'jurere',
      titulo: 'Apartamento à venda em Jurerê',
      fonte: path.join(ROOT_DIR, 'cadastro', 'Apartamento-Venda-Jurere', 'Conversa do WhatsApp com Cleo Cl Próp Gralha.txt'),
      fallback: {
        tipo: 'Apartamento',
        negocio: 'Venda',
        valor: 'R$ 4.500.000,00',
        endereco: 'Avenida dos Búzios, 1800, Apto 201A',
        bairro: 'Jurerê',
        cidade: 'Florianópolis/SC',
        descricao: 'Imóvel em Jurerê captado a partir de cadastro interno, aguardando complementos de autorização.',
      },
    },
    {
      key: 'max-studios',
      titulo: 'Max Studios 177',
      fonte: path.join(ROOT_DIR, 'imagens', 'Apresentação Max Studios 177.pdf'),
      fallback: {
        tipo: 'Studio',
        negocio: 'Venda',
        valor: 'Consulte valores',
        endereco: 'Florianópolis',
        bairro: 'Centro',
        cidade: 'Florianópolis/SC',
        descricao: 'Empreendimento Max Studios 177, cadastro criado por fluxo automático para publicação inicial.',
      },
    },
    {
      key: 'natus',
      titulo: 'Natus Residence',
      fonte: path.join(ROOT_DIR, 'Imoveis_venda', 'Natus'),
      fallback: {
        tipo: 'Apartamento',
        negocio: 'Venda',
        valor: 'Consulte valores',
        endereco: 'Florianópolis',
        bairro: 'Florianópolis',
        cidade: 'Florianópolis/SC',
        descricao: 'Empreendimento Natus com material de pasta interna, cadastro criado para publicação inicial.',
      },
    },
  ];

  const imoveis = readImoveis();
  const report = [];

  for (const item of prioridades) {
    let idx = imoveis.findIndex(it => {
      const titulo = String(it.titulo || '').toLowerCase();
      const fonte = String(it.fonteUrl || '').toLowerCase();
      return titulo.includes(item.key) || fonte.includes(item.key.replace('-', ''));
    });

    if (idx < 0) {
      let draft = null;
      try {
        const fontes = expandCaptureSources([item.fonte]);
        const resultado = await executarBotAutorizacao(fontes);
        draft = montarImovelFromCampos(resultado.campos, fontes[0] || item.fonte);
      } catch {
        draft = null;
      }

      const nextId = imoveis.length ? Math.max(...imoveis.map(x => x.id || 0)) + 1 : 1;
      const payload = draft
        ? {
          ...draft,
          titulo: draft.titulo || item.titulo,
          bairro: draft.bairro || item.fallback.bairro,
          descricao: draft.descricao || item.fallback.descricao,
          cidade: draft.cidade || item.fallback.cidade,
          tipo: draft.tipo || item.fallback.tipo,
          negocio: draft.negocio || item.fallback.negocio,
          valor: draft.valor || item.fallback.valor,
          endereco: draft.endereco || item.fallback.endereco,
          fonteUrl: draft.fonteUrl || item.fonte,
        }
        : {
          ...item.fallback,
          titulo: item.titulo,
          fonteUrl: item.fonte,
          fotos: [],
          documentacao: [],
          dadosPrivados: {},
          dadosCaptura: {},
          dadosPlanilha: {},
        };

      const novo = criarImovelBase(payload, nextId);
      imoveis.push(novo);
      idx = imoveis.length - 1;
    }

    if (!imoveis[idx].publicado) {
      const pub = publicarImovelPorIndice(imoveis, idx);
      report.push({ key: item.key, action: 'publicado', ...pub });
    } else {
      report.push({ key: item.key, action: 'ja-publicado', id: imoveis[idx].id, titulo: imoveis[idx].titulo, url: imoveis[idx].urlPublicada || '' });
    }
  }

  saveImoveis(imoveis);
  return report;
}

function mergeUnique(base = [], extra = []) {
  const set = new Set([...(Array.isArray(base) ? base : []), ...(Array.isArray(extra) ? extra : [])].map(item => String(item || '').trim()).filter(Boolean));
  return Array.from(set);
}

function findMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return String(match[1]).trim();
    }
  }
  return '';
}

function cleanCapturedText(raw = '') {
  const lines = String(raw || '').replace(/\r/g, '\n').split('\n');
  const cleaned = [];
  for (let line of lines) {
    let current = String(line || '').trim();
    if (!current) continue;

    current = current.replace(/^\u200e/, '').trim();
    current = current.replace(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+-\s+[^:]{1,80}:\s*/i, '').trim();
    current = current.replace(/^\[\d{2}\/\d{2}\/\d{4},\s*\d{2}:\d{2}:\d{2}\]\s+[^:]{1,80}:\s*/i, '').trim();

    if (!current) continue;
    if (/^<.*omitid.*>$/i.test(current)) continue;
    if (/^(mensagens|this message|image omitted|video omitted)/i.test(current)) continue;

    cleaned.push(current);
  }

  return cleaned.join('\n');
}

function buildSmartTitle(text = '', bairro = '', tipo = 'Apartamento') {
  const normalized = String(text || '');
  const candidatos = [
    findMatch(normalized, [/\b(max\s*studios\s*\d*)\b/i]),
    findMatch(normalized, [/\b(natus\b[^\n,;]{0,40})/i]),
    findMatch(normalized, [/\b(arkki\b[^\n,;]{0,40})/i]),
    findMatch(normalized, [/\b(connect\s*\d+\b[^\n,;]{0,40})/i]),
  ].filter(Boolean);

  if (candidatos.length) {
    return stripThirdPartyMentions(candidatos[0]).slice(0, 90).trim();
  }

  const bairroTitulo = bairro
    ? bairro.charAt(0).toUpperCase() + bairro.slice(1)
    : 'Florianópolis';

  return `${tipo} à venda em ${bairroTitulo}`;
}

function htmlToText(raw = '') {
  const title = findMatch(raw, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const metas = [];
  const metaRegex = /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([\s\S]*?)["'][^>]*>/ig;
  let m;
  while ((m = metaRegex.exec(raw)) !== null) {
    const key = String(m[1] || '').toLowerCase();
    const value = String(m[2] || '').trim();
    if (value && (key.includes('description') || key.includes('og:') || key.includes('twitter:'))) {
      metas.push(value);
    }
  }
  let visible = String(raw || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return [title, ...metas, visible].filter(Boolean).join(' ');
}

function extractImageUrlsFromHtml(raw = '', baseUrl = '') {
  const images = [];
  const seenBaseNames = new Set();
  
  const pushImage = (value = '') => {
    const input = String(value || '').trim();
    if (!input) return;
    const low = input.toLowerCase();
    if (low.startsWith('data:')) return;
    if (low.match(/\.(mp4|webm|mov|avi)(\?|$)/)) return;
    
    // Skip obvious thumbnails, icons and placeholders
    if (low.includes('_p.jpg') || low.includes('_thumb') || low.includes('/thumb/')) return;
    if (low.includes('loading.gif') || low.includes('placeholder') || low.includes('logo')) return;
    if (low.includes('icon') || low.includes('sprite') || low.includes('bg.')) return;
    
    let resolved = input;
    try {
      if (baseUrl) {
        resolved = new URL(input, baseUrl).toString();
      }
    } catch {
      resolved = input;
    }
    if (!resolved.match(/^https?:\/\//i)) return;
    
    // For Vista CDN: each photo has multiple versions, keep only one
    // Example: ...410716929fb16ebcb9_p.jpg and ...410716929fb16ebcb9.jpg
    // We keep the one without _p suffix (full size)
    const vistaMatch = resolved.match(/\/fotos\/\d+\/[^\/]+_([a-f0-9]{10,})(?:_[a-z])?\.jpg/i);
    if (vistaMatch) {
      const baseName = vistaMatch[1];
      if (seenBaseNames.has(baseName)) return;
      seenBaseNames.add(baseName);
    }
    
    images.push(resolved);
  };

  // Extract from img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/ig;
  let match;
  while ((match = imgRegex.exec(raw)) !== null) {
    pushImage(match[1]);
  }

  // Extract from meta tags (og:image, twitter:image)
  const ogRegex = /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/ig;
  while ((match = ogRegex.exec(raw)) !== null) {
    pushImage(match[1]);
  }
  
  // Extract from data attributes
  const dataImgRegex = /data-[a-z-]*(?:img|image|src)[a-z-]*=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/ig;
  while ((match = dataImgRegex.exec(raw)) !== null) {
    pushImage(match[1]);
  }
  
  // Extract CDN URLs directly from HTML (Vista, Superlógica, etc)
  const cdnPatterns = [
    /https?:\/\/cdn\.vistahost\.com\.br\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/ig,
    /https?:\/\/[^\s"'<>]*\.cloudinary\.com\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/ig,
    /https?:\/\/[^\s"'<>]*\.s3\.amazonaws\.com\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/ig,
    /https?:\/\/[^\s"'<>]*imgix\.net\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/ig,
  ];
  
  for (const pattern of cdnPatterns) {
    pattern.lastIndex = 0; // Reset regex
    while ((match = pattern.exec(raw)) !== null) {
      pushImage(match[0]);
    }
  }
  
  // Extract from JavaScript variables (common in real estate sites)
  const jsImgRegex = /["']([^"']*\/fotos\/[^"']*\.(?:jpg|jpeg|png|webp))["']/ig;
  while ((match = jsImgRegex.exec(raw)) !== null) {
    pushImage(match[1]);
  }

  const uniqueImages = Array.from(new Set(images));
  
  // Filter out very small images (likely icons/buttons)
  return uniqueImages.filter(url => {
    const filename = url.split('/').pop() || '';
    // Keep images that don't look like UI elements
    return !filename.match(/^(area|loading|icon|logo|btn|button|arrow|close)\./i);
  });
}


function fetchUrlText(url) {
  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(url);
      const lib = parsed.protocol === 'https:' ? httpsClient : httpClient;
      const req = lib.request(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 CRM-Captacao',
          'Accept-Language': 'pt-BR,pt;q=0.9'
        }
      }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const raw = buffer.toString('utf8');
          const contentType = String(res.headers['content-type'] || '').toLowerCase();
          if (contentType.includes('text/html') || /<html/i.test(raw)) {
            resolve({ text: htmlToText(raw), images: extractImageUrlsFromHtml(raw, url) });
            return;
          }
          resolve({ text: raw.replace(/\s+/g, ' ').trim(), images: [] });
        });
      });
      req.on('error', reject);
      req.setTimeout(20000, () => {
        req.destroy(new Error('Timeout ao ler link.'));
      });
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

function readLocalSourceText(sourcePath) {
  const suffix = path.extname(sourcePath).toLowerCase();
  if (['.txt', '.md', '.csv', '.json', '.html', '.htm'].includes(suffix)) {
    const raw = fs.readFileSync(sourcePath, 'utf8');
    if (suffix === '.html' || suffix === '.htm') {
      return htmlToText(raw);
    }
    return raw;
  }
  throw new Error(`Formato sem parser local: ${sourcePath}`);
}

function extractFieldsFallback(rawText, fontes = []) {
  const text = cleanCapturedText(rawText);
  const normalized = text.replace(/\r/g, '\n');

  const valor = findMatch(normalized, [/(R\$\s*[0-9\.,]+)/i, /(?:valor|pre[çc]o)\s*[:\-]?\s*(R\$?\s*[0-9\.,]+)/i, /\b([0-9]{1,3}(?:\.[0-9]{3})+,\d{2})\b/i]);
  const bairro = findMatch(normalized, [/bairro\s*[:\-]?\s*([^\n,;]+)/i, /\b(jurer[eê]|centro|trindade|agron[oô]mica|kobrasol|ratones|campeche|ingleses)\b/i]);
  const cidade = findMatch(normalized, [/cidade\s*[:\-]?\s*([^\n,;]+)/i, /(florian[oó]polis(?:\/sc)?)/i, /(s[aã]o\s+jose(?:\/sc)?)/i]) || 'Florianópolis/SC';

  let endereco = findMatch(normalized, [/(?:endere[çc]o|logradouro)\s*[:\-]?\s*([^\n]+)/i]);
  if (!endereco) {
    const enderecoMatch = normalized.match(/\b(avenida|av\.|rua|rodovia|estrada)\s+([^\n]{4,140})/i);
    if (enderecoMatch) {
      endereco = `${enderecoMatch[1]} ${enderecoMatch[2]}`;
    }
  }

  const dormitorios = findMatch(normalized, [/(?:dormit[oó]rios|quartos)\s*[:\-]?\s*([0-9]{1,2})/i]);
  const suites = findMatch(normalized, [/(?:su[ií]tes|suites)\s*[:\-]?\s*([0-9]{1,2})/i]);
  const vagas = findMatch(normalized, [/(?:vagas|garagem)\s*[:\-]?\s*([0-9]{1,2})/i]);
  const areaPrivativa = findMatch(normalized, [/(?:[áa]rea\s*privativa|metragem|área)\s*[:\-]?\s*([0-9\.,]+\s*m²?)/i]);
  const proprietario = findMatch(normalized, [/eu\s+([A-ZÀ-Ú][A-Za-zÀ-ú\s]{5,60})\s*,\s*cpf/i, /(?:propriet[aá]ri[oa]|nome)\s*[:\-]?\s*([A-ZÀ-Ú][A-Za-zÀ-ú\s]{5,60})/i]);
  const documento = findMatch(normalized, [/(cpf\s*[:\-]?\s*[0-9\.\-]{11,14})/i, /(rg\s*[:\-]?\s*[0-9\.\-]{5,20})/i]);
  const telefone = findMatch(normalized, [/(\(?\d{2}\)?\s*9?\d{4}\-?\d{4})/i]);
  const email = findMatch(normalized, [/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i]);
  const condominio = findMatch(normalized, [/(?:condom[ií]nio)\s*[:\-]?\s*([^\n]+)/i]);
  const tipoImovel = findMatch(normalized, [/(studio|st[uú]dio)/i, /(apartamento)/i]) || 'Apartamento';
  const titulo = buildSmartTitle(normalized, bairro, tipoImovel === 'studio' || tipoImovel === 'stúdio' ? 'Studio' : 'Apartamento');

  const descricao = stripThirdPartyMentions(normalized.replace(/\s+/g, ' ').trim().slice(0, 1800));

  return {
    titulo,
    tipo_imovel: tipoImovel,
    negocio: 'Venda',
    valor: valor && /^R\$/i.test(valor) ? valor : (valor ? `R$ ${valor}` : 'Consulte valores'),
    endereco: endereco || 'Sob consulta',
    bairro: bairro || 'Florianópolis',
    cidade,
    condominio: condominio || 'Sob consulta',
    quartos: dormitorios || 'NÃO INFORMADO',
    suites: suites || 'NÃO INFORMADO',
    vagas: vagas || 'NÃO INFORMADO',
    area_privativa: areaPrivativa || 'NÃO INFORMADO',
    area_total: 'NÃO INFORMADO',
    descricao: descricao || 'Informações captadas automaticamente sem autorização completa.',
    fotos: '',
    proprietario: proprietario || 'NÃO INFORMADO',
    documento: documento || 'NÃO INFORMADO',
    telefone_proprietario: telefone || 'NÃO INFORMADO',
    email_proprietario: email || 'NÃO INFORMADO',
    matricula: 'NÃO INFORMADO',
    observacoes_internas: `Captura fallback sem Python. Fontes: ${fontes.join(' | ')}`,
    link_referencia: fontes.find(item => isUrl(item)) || (fontes[0] || ''),
  };
}

async function executarCapturaFallback(fontes) {
  const textos = [];
  const imagens = [];
  const erros = [];

  for (const fonte of fontes) {
    try {
      if (String(fonte).startsWith('text:')) {
        textos.push(String(fonte).slice(5));
      } else if (isUrl(fonte)) {
        const payload = await fetchUrlText(fonte);
        textos.push(payload.text || '');
        imagens.push(...(payload.images || []));
      } else if (fs.existsSync(fonte)) {
        textos.push(readLocalSourceText(fonte));
      } else {
        textos.push(String(fonte));
      }
    } catch (error) {
      erros.push(`${fonte}: ${error.message}`);
    }
  }

  const mergedText = textos.join('\n\n').trim();
  if (!mergedText) {
    throw new Error(`Não foi possível capturar conteúdo das fontes. ${erros.join(' | ')}`);
  }

  const campos = extractFieldsFallback(mergedText, fontes);
  campos.fotos = Array.from(new Set(imagens)).join('\n');
  return {
    ok: true,
    arquivo: PLANILHA_AUTORIZACAO,
    linha: 0,
    campos,
    modo: 'fallback-js',
    erros,
  };
}

async function executarBotAutorizacao(fontesInput) {
  if (!fs.existsSync(BOT_AUTORIZACAO)) {
    const fontes = expandCaptureSources(fontesInput);
    return executarCapturaFallback(fontes);
  }

  const fontes = expandCaptureSources(fontesInput);

  if (!fontes.length) {
    throw new Error('Informe uma fonte (link, texto ou caminho de documento).');
  }

  const pythonCommands = ['python', 'py', 'python3'];
  let lastError = 'Python não encontrado no ambiente.';

  for (const cmd of pythonCommands) {
    const args = [BOT_AUTORIZACAO, '--excel', PLANILHA_AUTORIZACAO, '--json-output'];
    for (const source of fontes) {
      args.push('--source', source);
    }
    const result = spawnSync(cmd, args, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      timeout: 120000,
      shell: false,
    });

    if (result.error) {
      lastError = result.error.message;
      continue;
    }

    if (result.status !== 0) {
      lastError = (result.stderr || result.stdout || '').trim() || `Falha ao executar bot com ${cmd}.`;
      continue;
    }

    const output = String(result.stdout || '').trim();
    try {
      const parsed = JSON.parse(output);
      if (!parsed || !parsed.ok || !parsed.campos) {
        throw new Error('Retorno JSON inválido do bot.');
      }

      const imagens = [];
      for (const src of fontes) {
        if (!isUrl(src)) continue;
        try {
          const payload = await fetchUrlText(src);
          imagens.push(...(payload.images || []));
        } catch {
        }
      }
      if (imagens.length) {
        const atuais = parseFotos(parsed.campos.fotos || '');
        parsed.campos.fotos = mergeUnique(atuais, imagens).join('\n');
      }
      return parsed;
    } catch {
      lastError = output || 'Bot retornou saída não JSON.';
    }
  }

  const fallback = await executarCapturaFallback(fontes);
  return {
    ...fallback,
    aviso: `Python indisponível ou com erro. Captura executada em modo fallback. Detalhe: ${lastError}`,
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toIsoDate(value = new Date()) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ensureSitemapBase() {
  if (fs.existsSync(SITEMAP_FILE)) {
    return;
  }

  const base = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;
  fs.writeFileSync(SITEMAP_FILE, base, 'utf8');
}

function ensureSitemapEntry(relativePath) {
  ensureSitemapBase();

  const normalizedPath = String(relativePath || '').replace(/^\/+/, '');
  if (!normalizedPath) {
    return false;
  }

  const fullUrl = `${SITE_BASE_URL.replace(/\/+$/, '')}/${normalizedPath}`;
  let xml = fs.readFileSync(SITEMAP_FILE, 'utf8');

  if (xml.includes(`<loc>${fullUrl}</loc>`)) {
    return false;
  }

  const entry = `\n  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${toIsoDate()}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;

  if (xml.includes('</urlset>')) {
    xml = xml.replace('</urlset>', `${entry}</urlset>`);
  } else {
    xml += entry;
  }

  fs.writeFileSync(SITEMAP_FILE, xml, 'utf8');
  return true;
}

function ensureIndexFeaturedCard(imovel, relativeUrl) {
  if (!fs.existsSync(INDEX_FILE)) {
    return false;
  }

  const href = String(relativeUrl || '').replace(/^\/+/, '');
  if (!href) {
    return false;
  }

  let indexHtml = fs.readFileSync(INDEX_FILE, 'utf8');
  if (indexHtml.includes(`href="${href}"`) || indexHtml.includes(`href="/${href}"`)) {
    return false;
  }

  const sectionRegex = /(<section class="featured-properties">[\s\S]*?<div class="grid-imoveis">)([\s\S]*?)(\s*<\/div>\s*<\/section>)/;
  const match = indexHtml.match(sectionRegex);
  if (!match) {
    return false;
  }

  const fotos = parseFotos(imovel.fotos);
  const image = fotos[0] || 'https://img1.wsimg.com/isteam/ip/07e23903-74f7-4959-8978-9a8be272f898/Logo%20Flavia%20Marca%20dagua%20dourada.png';
  const title = escapeHtml(imovel.titulo || `Imóvel em ${imovel.bairro || 'Florianópolis'}`);
  const resumo = [imovel.tipo || 'Imóvel', imovel.bairro || '', imovel.valor || 'Consulte valores']
    .map(item => String(item || '').trim())
    .filter(Boolean)
    .join(' • ');

  const card = `\n      <div class="imovel">\n        <a href="${escapeHtml(href)}">\n          <img src="${escapeHtml(image)}" alt="${title}">\n          <h3>${title}</h3>\n          <p>${escapeHtml(resumo)}</p>\n        </a>\n      </div>`;

  const updated = `${match[1]}${match[2]}${card}${match[3]}`;
  indexHtml = indexHtml.replace(sectionRegex, updated);
  fs.writeFileSync(INDEX_FILE, indexHtml, 'utf8');
  return true;
}

function buildPropertyHtml(imovel) {
  const bairro = imovel.bairro || 'Centro';
  const cidade = imovel.cidade || 'Florianópolis/SC';
  const codigo = normalizeCodigo(imovel.codigo);
  const codigoLower = codigo.toLowerCase();
  const valor = imovel.valor || 'Consulte valores';
  const descricao = imovel.descricao || 'Descrição não informada.';
  const fotos = parseFotos(imovel.fotos);
  const firstImage = fotos[0] || 'https://img1.wsimg.com/isteam/ip/07e23903-74f7-4959-8978-9a8be272f898/Logo%20Flavia%20Marca%20dagua%20dourada.png';

  // Dados do CRM
  const tipo = imovel.tipo || 'Apartamento';
  const negocio = imovel.negocio || 'Venda';
  const endereco = imovel.endereco || 'Sob consulta';
  const condominio = imovel.condominio || 'Sob consulta';
  const planilha = imovel.dadosPlanilha || {};
  const dormitorios = planilha.dormitorios || imovel.quartos || '-';
  const suites = planilha.suites || '-';
  const vagas = planilha.vagas || '-';
  const areaPrivativa = planilha.area_privativa || '-';
  const areaTotal = planilha.area_total || '-';
  const agencia = 'Flavia Capacia Corretora';
  const imagemCount = fotos.length > 0 ? ` + ${fotos.length}` : '';

  const gallery = fotos.length
    ? fotos.map((foto, index) => `        <img src="${escapeHtml(foto)}" alt="Imóvel ${escapeHtml(codigo)} foto ${index + 1}" loading="lazy" />`).join('\n')
    : `        <img src="${escapeHtml(firstImage)}" alt="Imagem do imóvel" loading="lazy" />`;

  return {
    codigo,
    fileName: `apartamento-venda-${slugify(bairro)}-${codigoLower}.html`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(tipo)} à venda em ${escapeHtml(bairro)} ${escapeHtml(cidade)} | Código ${escapeHtml(codigo)}</title>
  <meta name="description" content="${escapeHtml(descricao)}" />
  <meta property="og:title" content="${escapeHtml(tipo)} à venda em ${escapeHtml(bairro)} ${escapeHtml(cidade)} | Código ${escapeHtml(codigo)}" />
  <meta property="og:description" content="${escapeHtml(descricao)}" />
  <meta property="og:image" content="${escapeHtml(firstImage)}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(tipo)} à venda em ${escapeHtml(bairro)} ${escapeHtml(cidade)} | Código ${escapeHtml(codigo)}" />
  <meta name="twitter:description" content="${escapeHtml(descricao)}" />
  <meta name="twitter:image" content="${escapeHtml(firstImage)}" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --fundo-branco: #ffffff;
      --branco-smoke: #f8f6f4;
      --texto-bronze: #1b1714;
      --bronze-claro: #3f3026;
      --dourado: #b08d57;
      --dourado-escuro: #8b7355;
      --borda: #e8dfd6;
      --fonte-padrao: 'Playfair Display', serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--branco-smoke); color: var(--texto-bronze); font-family: var(--fonte-padrao); line-height: 1.6; }
    
    .site-header { background: #fff; border-bottom: 2px solid var(--borda); padding: 20px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .logo-area img { max-width: 160px; height: auto; }
    .main-nav ul { list-style: none; margin: 15px 0 0; padding: 0; display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; }
    .main-nav a { text-decoration: none; font-weight: 700; color: var(--texto-bronze); font-size: 0.95rem; transition: color 0.3s ease; }
    .main-nav a:hover { color: var(--dourado); }
    
    .imovel-page { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
    
    .hero-section { background: linear-gradient(135deg, #fff9f3 0%, #fcfbfa 100%); border: 1px solid var(--borda); border-radius: 14px; padding: 40px 30px; margin-bottom: 30px; text-align: center; }
    
    h1 { color: var(--texto-bronze); margin: 0 0 15px; font-size: 2.2rem; font-weight: 700; line-height: 1.3; }
    
    .preco-agencia { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 15px; }
    .preco { margin: 0; font-size: 1.8rem; color: var(--dourado-escuro); font-weight: 700; }
    .agencia-badge { display: inline-block; background: var(--dourado); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    
    .codigo-info { text-align: center; margin: 0; color: #8b7355; font-size: 0.95rem; letter-spacing: 0.5px; }
    .foto-count { color: var(--dourado); font-weight: 600; }
    
    .grid-2col { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 30px; }
    
    .card { background: white; border: 1px solid var(--borda); border-radius: 12px; padding: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
    .card h2 { margin: 0 0 16px; color: var(--texto-bronze); font-size: 1.35rem; border-bottom: 2px solid var(--dourado); padding-bottom: 10px; }
    
    .detalhes { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(150px, 1fr)); gap: 14px; }
    .detalhes li { padding: 10px 12px; background: #fcfbfa; border-radius: 8px; border-left: 3px solid var(--dourado); }
    .detalhes strong { color: var(--dourado); display: block; font-size: 0.85rem; margin-bottom: 4px; }
    
    .descricao-text { line-height: 1.8; color: #5a4f47; font-size: 1.05rem; }
    
    .galeria-section { margin-bottom: 30px; }
    .grid-fotos { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; }
    .grid-fotos img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; border: 1px solid var(--borda); transition: transform 0.3s ease, filter 0.3s ease; cursor: pointer; }
    .grid-fotos img:hover { transform: scale(1.03); filter: brightness(1.05); }
    
    .contato-section { background: linear-gradient(135deg, var(--dourado) 0%, var(--dourado-escuro) 100%); border-radius: 12px; padding: 24px; color: white; display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
    .contato-section p { margin: 0; font-size: 1.1rem; }
    .btn-whatsapp { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; background: white; color: var(--dourado); font-weight: 700; padding: 12px 24px; border-radius: 8px; white-space: nowrap; transition: transform 0.3s ease, box-shadow 0.3s ease; font-size: 1rem; }
    .btn-whatsapp:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    
    .site-footer { background: #2a2520; color: #e8dfd6; padding: 50px 20px 30px; margin-top: 50px; }
    .footer-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); max-width: 1100px; margin: 0 auto; gap: 30px; margin-bottom: 30px; }
    .footer-contact, .footer-logo, .footer-social { text-align: center; }
    .footer-contact h3, .footer-social h3 { color: var(--dourado); margin: 0 0 12px; font-size: 1.1rem; }
    .footer-contact a, .footer-social a { color: var(--dourado); text-decoration: none; transition: color 0.3s ease; }
    .footer-contact a:hover, .footer-social a:hover { color: var(--borda); }
    .footer-contact p { margin: 8px 0; font-size: 0.95rem; }
    .footer-logo img { width: 160px; transition: transform 0.5s ease; }
    .footer-logo img:hover { transform: scale(1.08); }
    .footer-social ul { list-style: none; padding: 0; margin: 0; }
    .footer-social li { margin-bottom: 8px; }
    .footer-credit { text-align: center; border-top: 1px solid rgba(176, 141, 87, 0.3); padding-top: 20px; font-size: 0.9rem; color: #a89968; }
    
    @media (max-width: 768px) {
      .hero-section { padding: 30px 20px; }
      h1 { font-size: 1.8rem; }
      .preco { font-size: 1.5rem; }
      .grid-2col { grid-template-columns: 1fr; }
      .contato-section { flex-direction: column; text-align: center; }
      .grid-fotos { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
      .detalhes { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="logo-area">
      <img src="https://img1.wsimg.com/isteam/ip/07e23903-74f7-4959-8978-9a8be272f898/Logo%20Flavia%20Marca%20dagua%20dourada.png/:/rs=w:160,h:160,mx" alt="Logo Flavia Imóveis" class="logo" />
    </div>
    <nav class="main-nav" aria-label="Navegação principal">
      <ul>
        <li><a href="index.html">Início</a></li>
        <li><a href="sobre.html">Sobre</a></li>
        <li><a href="negocie.html">Negocie</a></li>
        <li><a href="financie.html">Financie</a></li>
        <li><a href="contato.html">Contato</a></li>
      </ul>
    </nav>
  </header>

  <main class="imovel-page">
    <section class="hero-section">
      <h1>${escapeHtml(imovel.titulo || `${tipo} à venda em ${bairro}`)}</h1>
      <div class="preco-agencia">
        <p class="preco">${escapeHtml(valor)}</p>
        <span class="agencia-badge">🏢 ${escapeHtml(agencia)}</span>
      </div>
      <p class="codigo-info">Código: <strong>${escapeHtml(codigo)}</strong> | <span class="foto-count">📷 ${fotos.length} fotos${imagemCount}</span></p>
    </section>

    <div class="grid-2col">
      <section class="card">
        <h2>Características</h2>
        <ul class="detalhes">
          <li><strong>Tipo:</strong> ${escapeHtml(tipo)}</li>
          <li><strong>Negócio:</strong> ${escapeHtml(negocio)}</li>
          <li><strong>Bairro:</strong> ${escapeHtml(bairro)}</li>
          <li><strong>Cidade:</strong> ${escapeHtml(cidade)}</li>
          <li><strong>Dormitórios:</strong> ${escapeHtml(dormitorios)}</li>
          <li><strong>Suítes:</strong> ${escapeHtml(suites)}</li>
          <li><strong>Vagas Garagem:</strong> ${escapeHtml(vagas)}</li>
          <li><strong>Área Privativa:</strong> ${escapeHtml(areaPrivativa)}</li>
          ${areaTotal !== '-' ? `<li><strong>Área Total:</strong> ${escapeHtml(areaTotal)}</li>` : ''}
          <li><strong>Endereço:</strong> ${escapeHtml(endereco)}</li>
        </ul>
      </section>

      <section class="card">
        <h2>Detalhes Adicionais</h2>
        <ul class="detalhes">
          <li><strong>Condomínio:</strong> ${escapeHtml(condominio)}</li>
          ${planilha.iptu ? `<li><strong>IPTU:</strong> ${escapeHtml(String(planilha.iptu))}</li>` : ''}
          ${imovel.publicadoEm ? `<li><strong>Publicado:</strong> ${new Date(imovel.publicadoEm).toLocaleDateString('pt-BR')}</li>` : ''}
          <li><strong>Status:</strong> Disponível</li>
          <li style="grid-column: 1 / -1;"><strong>COD. REF:</strong> ${escapeHtml(codigo)}</li>
        </ul>
      </section>
    </div>

    <section class="card descricao">
      <h2>Descrição do Imóvel</h2>
      <p class="descricao-text">${escapeHtml(descricao)}</p>
    </section>

    <section class="card galeria-section">
      <h2>Galeria de Fotos (${fotos.length})</h2>
      <div class="grid-fotos">
${gallery}
      </div>
    </section>

    <section class="contato-section" aria-label="Contato rápido">
      <p>Interessado neste imóvel? Entre em contato e agende uma visita!</p>
      <a class="btn-whatsapp" href="https://wa.me/5548999600601?text=Olá%20Flavia!%20%F0%9F%91%8B%20Gostaria%20de%20informações%20sobre%20o%20imóvel%20${escapeHtml(codigo)}.%20${escapeHtml(tipo)}%20em%20${escapeHtml(bairro)}%20-%20${escapeHtml(cidade)}" target="_blank" rel="noopener noreferrer">📲 Enviar WhatsApp</a>
    </section>
  </main>

  <footer class="site-footer" id="contato">
    <div class="footer-container">
      <div class="footer-contact">
        <h3>Contato</h3>
        <p><a href="mailto:flavia.capacia@creci.gov">flavia.capacia@creci.gov</a></p>
        <p><a href="tel:+5548999600601">(48) 99960-0601</a></p>
        <p>Florianópolis • São José • Palhoça</p>
        <p>Santa Catarina - Brasil</p>
      </div>
      <div class="footer-logo">
        <a href="index.html">
          <img src="https://img1.wsimg.com/isteam/ip/07e23903-74f7-4959-8978-9a8be272f898/Logo%20Flavia%20Marca%20dagua%20dourada.png" alt="Logo Flavia Imóveis"/>
        </a>
      </div>
      <div class="footer-social">
        <h3>Acompanhe</h3>
        <ul>
          <li><a href="https://www.facebook.com/flaviacapaciacorretora" target="_blank">👍 Facebook</a></li>
          <li><a href="https://www.instagram.com/flaviacapaciacorretora/" target="_blank">📸 Instagram</a></li>
          <li><a href="https://www.linkedin.com/in/flaviacapaciacorretora" target="_blank">💼 LinkedIn</a></li>
          <li><a href="https://www.youtube.com/@flaviacapaciacorretora" target="_blank">🎬 YouTube</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-credit">
      <p>&copy; 2025 Flavia Capacia Corretora - Todos os direitos reservados.</p>
      <p>Desenvolvido por <strong>Capacia Group</strong> 💛</p>
    </div>
  </footer>
</body>
</html>`
  };
}

function createSession(username) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, {
    username,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });
  return token;
}

function readAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

function requireAuth(req, res) {
  const token = readAuthToken(req);
  if (!token) {
    sendJson(res, 401, { error: 'Não autenticado.' });
    return null;
  }

  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    sendJson(res, 401, { error: 'Sessão expirada. Faça login novamente.' });
    return null;
  }

  return { token, session };
}

function handleStaticFile(req, res, pathname) {
  const relativePath = pathname === '/' ? '/crm.html' : pathname;
  const safePath = path.normalize(relativePath).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    sendText(res, 403, 'Acesso negado');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendText(res, 404, 'Arquivo não encontrado');
      return;
    }

    res.writeHead(200, {
      'Content-Type': getMimeType(filePath),
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = requestUrl;

  if (req.method === 'POST' && pathname === '/api/login') {
    try {
      const body = await parseBody(req);
      const username = String(body.username || '').trim();
      const password = String(body.password || '').trim();

      const isConfiguredCredential = username === CRM_USER && password === CRM_PASS;
      const isDefaultCredential = username === DEFAULT_CRM_USER && password === DEFAULT_CRM_PASS;
      if (!isConfiguredCredential && !isDefaultCredential) {
        sendJson(res, 401, { error: 'Usuário ou senha inválidos.' });
        return;
      }

      const token = createSession(username);
      sendJson(res, 200, { token, username });
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  if (req.method === 'POST' && pathname === '/api/logout') {
    const token = readAuthToken(req);
    if (token) {
      sessions.delete(token);
    }
    sendJson(res, 200, { message: 'Logout realizado com sucesso.' });
    return;
  }

  if (pathname.startsWith('/api/')) {
    const auth = requireAuth(req, res);
    if (!auth) return;

    if (req.method === 'GET' && pathname === '/api/documentacao/list') {
      ensureStorage();
      const files = fs
        .readdirSync(UPLOADS_DIR, { withFileTypes: true })
        .filter(entry => entry.isFile())
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b));
      sendJson(res, 200, files);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/imoveis') {
      const imoveis = readImoveis().sort((a, b) => b.id - a.id);
      sendJson(res, 200, imoveis);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/status') {
      const pythonCmd = detectPythonCommand();
      sendJson(res, 200, {
        ok: true,
        version: CRM_VERSION,
        startedAt: SERVER_STARTED_AT,
        now: new Date().toISOString(),
        rootDir: ROOT_DIR,
        python: pythonCmd || 'não encontrado',
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/imoveis/captar') {
      try {
        const body = await parseBody(req);
        const fontes = expandCaptureSources(Array.isArray(body.fontes) ? body.fontes : body.fonte);

        const resultado = await executarBotAutorizacao(fontes);
        const draft = montarImovelFromCampos(resultado.campos, fontes[0] || '');

        sendJson(res, 200, {
          message: 'Captação concluída e planilha preenchida.',
          planilha: resultado.arquivo,
          linha: resultado.linha,
          fontes,
          modo: resultado.modo || 'python',
          aviso: resultado.aviso || '',
          draft,
        });
        return;
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'POST' && pathname === '/api/imoveis/importar-existentes') {
      try {
        const result = importExistingPages();
        sendJson(res, 200, {
          message: `Importação concluída. ${result.imported} imóvel(is) adicionado(s).`,
          ...result,
        });
        return;
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'POST' && pathname === '/api/comandos/gerar-prioritarios') {
      try {
        const report = await gerarAnunciosPrioritarios();
        sendJson(res, 200, {
          message: 'Anúncios prioritários processados (Jurerê, Max Studios, Natus).',
          report,
        });
        return;
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'POST' && pathname === '/api/uploads') {
      try {
        const body = await parseBody(req);
        const files = Array.isArray(body.files) ? body.files : [];
        if (!files.length) {
          sendJson(res, 400, { error: 'Nenhum arquivo enviado.' });
          return;
        }

        const saved = [];
        for (const input of files) {
          const originalName = String(input.name || 'arquivo').trim();
          const name = sanitizeFileName(originalName || 'arquivo');
          const fileData = String(input.data || '').trim();
          const { mime, base64 } = extractDataUrl(fileData);
          const ext = detectFileExtension(originalName || name, mime);
          const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.docx', '.txt'];
          if (!allowed.includes(ext.toLowerCase())) {
            throw new Error(`Formato não permitido: ${originalName || name}`);
          }

          const buffer = Buffer.from(base64, 'base64');
          if (buffer.length > MAX_UPLOAD_FILE_BYTES) {
            throw new Error(`Arquivo muito grande: ${name}`);
          }

          const finalName = `${Date.now()}-${Math.round(Math.random() * 100000)}-${sanitizeFileName(path.basename(name, path.extname(name)))}${ext}`;
          const output = path.join(UPLOADS_DIR, finalName);
          fs.writeFileSync(output, buffer);
          saved.push({
            nome: finalName,
            original: name,
            mime,
            url: `/uploads/documentacao/${finalName}`,
          });
        }

        sendJson(res, 200, { files: saved });
        return;
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'POST' && pathname === '/api/imoveis') {
      try {
        const body = await parseBody(req);
        console.log('[DEBUG] POST /api/imoveis - Payload recebido:', JSON.stringify(body, null, 2));
        
        const imoveis = readImoveis();
        const nextId = imoveis.length ? Math.max(...imoveis.map(item => item.id || 0)) + 1 : 1;

        const novoImovel = criarImovelBase(body, nextId);
        
        console.log('[DEBUG] Imóvel criado:', { id: novoImovel.id, titulo: novoImovel.titulo, bairro: novoImovel.bairro });

        if (!novoImovel.titulo) {
          novoImovel.titulo = 'Imóvel sem título';
        }
        if (!novoImovel.bairro) {
          novoImovel.bairro = 'Florianópolis';
        }
        if (!novoImovel.descricao) {
          novoImovel.descricao = 'Imóvel cadastrado sem descrição detalhada.';
        }

        imoveis.push(novoImovel);
        saveImoveis(imoveis);
        
        console.log('[DEBUG] Imóvel salvo com sucesso. ID:', novoImovel.id);
        sendJson(res, 201, novoImovel);
        return;
      } catch (error) {
        console.error('[ERROR] POST /api/imoveis:', error.message, error.stack);
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'POST' && /^\/api\/imoveis\/\d+\/incorporar$/.test(pathname)) {
      try {
        const id = Number(pathname.split('/')[3]);
        const body = await parseBody(req);
        const fontes = expandCaptureSources(Array.isArray(body.fontes) ? body.fontes : body.fonte);
        if (!fontes.length) {
          sendJson(res, 400, { error: 'Informe ao menos uma fonte para incorporar.' });
          return;
        }

        const imoveis = readImoveis();
        const idx = imoveis.findIndex(item => item.id === id);
        if (idx < 0) {
          sendJson(res, 404, { error: 'Imóvel não encontrado.' });
          return;
        }

        const resultado = await executarBotAutorizacao(fontes);
        const draft = montarImovelFromCampos(resultado.campos, fontes[0] || '');
        const atual = imoveis[idx];
        const planilhaAtual = buildAuthorizationData(atual.dadosPlanilha || {});
        const planilhaNova = buildAuthorizationData(draft.dadosPlanilha || {});
        const planilhaMesclada = buildAuthorizationData({ ...planilhaAtual, ...planilhaNova });

        const descricaoNova = String(draft.descricao || '').trim();
        const descricaoAtual = String(atual.descricao || '').trim();
        const descricaoMesclada = descricaoNova && !descricaoAtual.includes(descricaoNova)
          ? `${descricaoAtual}\n\nComplemento captado:\n${descricaoNova}`.trim()
          : descricaoAtual;

        const valorFinal = normalizeCurrencyBR(draft.valor || atual.valor || planilhaMesclada.valor_venda || '') || atual.valor || 'Consulte valores';
        const condominioFinal = normalizeCurrencyBR(draft.condominio || atual.condominio || planilhaMesclada.condominio || '') || atual.condominio || 'Sob consulta';
        const bairroFinal = String(draft.bairro || atual.bairro || planilhaMesclada.bairro || '').trim();
        const cidadeFinal = String(draft.cidade || atual.cidade || planilhaMesclada.cidade || '').trim() || 'Florianópolis/SC';
        const tipoFinal = String(draft.tipo || atual.tipo || planilhaMesclada.tipo_imovel || 'Apartamento').trim();
        const negocioFinal = String(draft.negocio || atual.negocio || planilhaMesclada.negocio || 'Venda').trim();
        const quartosFinal = planilhaMesclada.dormitorios;

        imoveis[idx] = {
          ...atual,
          titulo: buildValidatedTitle({
            tipo: tipoFinal,
            negocio: negocioFinal,
            quartos: quartosFinal,
            suites: planilhaMesclada.suites,
            vagas: planilhaMesclada.vagas,
            bairro: bairroFinal,
            cidade: cidadeFinal,
          }),
          tipo: tipoFinal,
          negocio: negocioFinal,
          valor: valorFinal,
          endereco: String(draft.endereco || '').trim() || atual.endereco,
          bairro: bairroFinal,
          cidade: cidadeFinal,
          condominio: condominioFinal,
          descricao: descricaoMesclada || atual.descricao,
          fotos: mergeUnique(atual.fotos, draft.fotos),
          fonteUrl: String(draft.fonteUrl || '').trim() || atual.fonteUrl,
          dadosPrivados: { ...(atual.dadosPrivados || {}), ...(draft.dadosPrivados || {}) },
          dadosPlanilha: planilhaMesclada,
          dadosCaptura: {
            ...(atual.dadosCaptura || {}),
            ultimaCaptura: {
              data: new Date().toISOString(),
              fontes,
              modo: resultado.modo || 'python',
              aviso: resultado.aviso || '',
            },
          },
          atualizadoEm: new Date().toISOString(),
        };

        saveImoveis(imoveis);
        sendJson(res, 200, {
          message: 'Informações incorporadas com sucesso.',
          modo: resultado.modo || 'python',
          aviso: resultado.aviso || '',
          item: imoveis[idx],
        });
        return;
      } catch (error) {
        sendJson(res, 400, { error: error.message });
        return;
      }
    }

    if (req.method === 'GET' && /^\/api\/imoveis\/\d+$/.test(pathname)) {
      const id = Number(pathname.split('/').pop());
      const item = readImoveis().find(imovel => imovel.id === id);
      if (!item) {
        sendJson(res, 404, { error: 'Imóvel não encontrado.' });
        return;
      }
      sendJson(res, 200, item);
      return;
    }

    if (req.method === 'POST' && /^\/api\/imoveis\/\d+\/republicar$/.test(pathname)) {
      const id = Number(pathname.split('/')[3]);
      const imoveis = readImoveis();
      const idx = imoveis.findIndex(item => item.id === id);
      if (idx < 0) {
        sendJson(res, 404, { error: 'Imóvel não encontrado.' });
        return;
      }

      const published = publicarImovelPorIndice(imoveis, idx);
      saveImoveis(imoveis);
      sendJson(res, 200, {
        message: 'Imóvel republicado com sucesso.',
        url: published.url,
        fileName: String(published.url || '').replace(/^\//, ''),
      });
      return;
    }

    if (req.method === 'POST' && /^\/api\/imoveis\/\d+\/excel$/.test(pathname)) {
      const id = Number(pathname.split('/')[3]);
      const item = readImoveis().find(imovel => imovel.id === id);
      if (!item) {
        sendJson(res, 404, { error: 'Imóvel não encontrado.' });
        return;
      }

      const fileName = `imovel-${id}.csv`;
      const output = path.join(EXPORTS_DIR, fileName);
      fs.writeFileSync(output, buildCsvFromImovel(item), 'utf8');
      sendJson(res, 200, { message: 'Arquivo de planilha gerado.', url: `/exports/${fileName}` });
      return;
    }

    if (req.method === 'POST' && /^\/api\/imoveis\/\d+\/pdf$/.test(pathname)) {
      const id = Number(pathname.split('/')[3]);
      const item = readImoveis().find(imovel => imovel.id === id);
      if (!item) {
        sendJson(res, 404, { error: 'Imóvel não encontrado.' });
        return;
      }

      const fileName = `imovel-${id}-ficha.html`;
      const output = path.join(EXPORTS_DIR, fileName);
      fs.writeFileSync(output, buildHtmlFichaImovel(item), 'utf8');
      sendJson(res, 200, { message: 'Ficha gerada para impressão em PDF.', url: `/exports/${fileName}` });
      return;
    }

    if (req.method === 'DELETE' && /^\/api\/imoveis\/\d+$/.test(pathname)) {
      const id = Number(pathname.split('/').pop());
      const imoveis = readImoveis();
      const idx = imoveis.findIndex(item => item.id === id);
      if (idx < 0) {
        sendJson(res, 404, { error: 'Imóvel não encontrado.' });
        return;
      }

      const [removed] = imoveis.splice(idx, 1);
      saveImoveis(imoveis);
      sendJson(res, 200, { message: 'Imóvel excluído com sucesso.', item: removed });
      return;
    }

    if (req.method === 'POST' && /^\/api\/imoveis\/\d+\/publicar$/.test(pathname)) {
      const id = Number(pathname.split('/')[3]);
      const imoveis = readImoveis();
      const idx = imoveis.findIndex(item => item.id === id);
      if (idx < 0) {
        sendJson(res, 404, { error: 'Imóvel não encontrado.' });
        return;
      }

      const published = publicarImovelPorIndice(imoveis, idx);
      saveImoveis(imoveis);

      sendJson(res, 200, {
        message: 'Página publicada com sucesso.',
        url: published.url,
        fileName: String(published.url || '').replace(/^\//, ''),
        sitemapUpdated: published.sitemapUpdated,
        indexUpdated: published.indexUpdated,
      });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/anuncios') {
      const publicados = readImoveis()
        .filter(item => item.publicado && item.urlPublicada)
        .map(item => ({
          id: item.id,
          titulo: item.titulo,
          codigo: item.codigo,
          nome: item.arquivoPublicado,
          url: item.urlPublicada,
        }));
      sendJson(res, 200, publicados);
      return;
    }

    sendJson(res, 404, { error: 'Endpoint não encontrado.' });
    return;
  }

  handleStaticFile(req, res, pathname);
});

ensureStorage();
try {
  const startupImport = importExistingPages();
  if (startupImport.imported > 0) {
    console.log(`Importação automática: ${startupImport.imported} imóvel(is) adicionados ao CRM.`);
  }
} catch (error) {
  console.error(`Falha na importação automática inicial: ${error.message}`);
}

server.listen(PORT, () => {
  console.log(`CRM server running at http://localhost:${PORT}`);
  console.log(`Login padrão: usuário "${CRM_USER}"`);
});
