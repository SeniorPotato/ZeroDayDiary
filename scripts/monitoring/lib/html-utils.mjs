import { load } from 'cheerio';

export function absolutize(base, href) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

export function decodeHtml(text = '') {
  return load(`<body>${text}</body>`).text();
}

export function cleanText(text = '') {
  return decodeHtml(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normaliseSentence(text = '') {
  const cleaned = cleanText(text);
  if (!cleaned) return '';
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function normaliseLinkTitle(rawTitle = '') {
  return cleanText(rawTitle)
    .replace(/[\uE000-\uF8FF]/g, ' ')
    .replace(/\s*[•|/]+\s*$/g, '')
    .replace(/\s+[A-Z][a-z]{2}\s+\d{1,2},\s+20\d{2}(?:\s+[A-Za-z][A-Za-z\s/&-]*)?\s*$/i, '')
    .replace(/\s+(Artificial Intelligence|Threat Detection|Malware|Network Security|Cloud Security|API Security|Developer Security|VPN Security|Cybersecurity|Privacy|Browser Security|Vulnerability|Enterprise Security|Cyber Espionage|Mobile Security|Email Security|Ransomware)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractHtmlLinks(html, baseUrl, includePatterns = [], excludePatterns = [], titleRejectPatterns = []) {
  const $ = load(html);
  const items = [];

  $('a[href]').each((_, anchor) => {
    const rawHref = $(anchor).attr('href') || '';
    if (!rawHref || rawHref.startsWith('#')) return;
    const href = absolutize(baseUrl, rawHref);
    if (!href) return;

    let url;
    try {
      url = new URL(href);
    } catch {
      return;
    }

    if (url.hash) return;
    if (includePatterns.length && !includePatterns.some((pattern) => href.includes(pattern))) return;
    if (excludePatterns.length && excludePatterns.some((pattern) => href.includes(pattern))) return;

    const title = normaliseLinkTitle($(anchor).text());

    if (!title || title.length < 8) return;
    if (/^(read more|learn more|more|next|previous|skip to main content|back to top|question)$/i.test(title)) return;
    if (/^posted on /i.test(title)) return;
    if (/^\d+ comments?$/i.test(title)) return;
    if (title.split(/\s+/).length < 4) return;
    if (titleRejectPatterns.length && titleRejectPatterns.some((pattern) => new RegExp(pattern, 'i').test(title))) return;

    items.push({ title, link: href });
  });

  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    const key = `${item.link}::${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, 12);
}

export function extractMeta(html, name, attr = 'name') {
  const $ = load(html);
  return cleanText($(`meta[${attr}="${name}"]`).attr('content') || '');
}

export function extractTitle(html) {
  const $ = load(html);
  return cleanText(
    extractMeta(html, 'og:title', 'property') ||
    $('title').first().text() ||
    $('h1').first().text() ||
    ''
  );
}

export function extractDescription(html) {
  return cleanText(
    extractMeta(html, 'og:description', 'property') ||
    extractMeta(html, 'description') ||
    ''
  );
}

export function extractArticleHtml(html) {
  const $ = load(html);
  const candidate = $('article').first().html()
    || $('main').first().html()
    || $('[class*="article"], [class*="post"], [class*="entry-content"], [class*="story"], [class*="content"] p').closest('div').first().html()
    || $('[class*="node__content"], [class*="field--name-body"], [class*="page__content"], [class*="l-content"], [class*="entry-content"], [class*="articlebody"], [id*="article"]').first().html();
  return candidate || html;
}

export function extractParagraphs(html, { limit = 8, isBoilerplateText = () => false } = {}) {
  const $ = load(extractArticleHtml(html));
  const matches = [];

  $('p').each((_, paragraph) => {
    const text = normaliseSentence($(paragraph).text());
    if (!text || text.length <= 70) return;
    if (/cookie|subscribe|newsletter|sign up|all rights reserved|javascript|advertisement|related articles/i.test(text)) return;
    if (isBoilerplateText(text)) return;
    matches.push(text);
  });

  const deduped = [];
  const seen = new Set();
  for (const text of matches) {
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(text);
  }

  return deduped.slice(0, limit);
}
