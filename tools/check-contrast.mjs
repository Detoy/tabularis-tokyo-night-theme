import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** WCAG relative luminance for an opaque sRGB color. */
function luminance(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Expected opaque RGB color: ${hex}`);
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
export function contrastRatio(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

/** Audit the application pairs documented in Tabularis DESIGN.md plus editor text. */
export function auditDefinition(definition) {
  const c = definition.colors;
  const violations = [];
  const check = (label, foreground, backgrounds, minimum = 4.5) => {
    for (const background of backgrounds) {
      const ratio = contrastRatio(foreground, background);
      if (ratio < minimum) violations.push({ label, foreground, background, ratio, minimum });
    }
  };
  const surfaces = [c.bg.base, c.bg.elevated, c.bg.overlay, c.surface.secondary];
  for (const key of ['primary', 'secondary', 'muted']) check(`text.${key}`, c.text[key], surfaces);
  check('text.primary', c.text.primary, [c.bg.tooltip, c.surface.tertiary]);
  check('text.accent', c.text.accent, [c.bg.base, c.bg.elevated, c.surface.secondary]);
  check('text.inverse', c.text.inverse, [c.accent.primary]);
  for (const key of ['secondary', 'success', 'warning', 'error', 'info']) {
    check(`accent.${key}`, c.accent[key], [c.bg.base, c.bg.elevated]);
    // Filled status labels use the same lightness threshold as the host CSS.
    const y = luminance(c.accent[key]);
    const lightness = y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : 24389 / 27 * y;
    check(`onAccent.${key}`, lightness < 49.44 ? '#ffffff' : '#000000', [c.accent[key]]);
  }
  for (const [key, value] of Object.entries(c.semantic)) check(`semantic.${key}`, value, [c.bg.base, c.bg.elevated]);
  check('border.focus', c.border.focus, [c.bg.base, c.bg.elevated, c.bg.input], 3);
  const editor = definition.editor;
  for (const rule of editor.rules) check(`editor.${rule.token}`, rule.foreground, [editor.colors['editor.background']]);
  for (const key of ['editor.foreground', 'editorLineNumber.foreground', 'editorLineNumber.activeForeground']) {
    check(key, editor.colors[key], [editor.colors['editor.background']]);
  }
  return violations;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = new URL('../', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('.tabularium', root), 'utf8'));
  for (const variant of manifest.theme_variants) {
    const definition = JSON.parse(readFileSync(new URL(variant.file, root), 'utf8'));
    const failures = auditDefinition(definition);
    if (failures.length) throw new Error(`${variant.name}: ${JSON.stringify(failures, null, 2)}`);
    console.log(`${variant.name}: application and SQL editor contrast pass`);
  }
}
