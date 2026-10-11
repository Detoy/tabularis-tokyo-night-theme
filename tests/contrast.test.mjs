import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditDefinition, contrastRatio } from '../tools/check-contrast.mjs';

test('WCAG reference contrasts are symmetric and include the extremes', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#ffffff', '#000000'), 21);
  assert.equal(contrastRatio('#1a1b26', '#1a1b26'), 1);
  assert.throws(() => contrastRatio('transparent', '#ffffff'));
});
for (const mode of ['light', 'dark']) {
  const definition = JSON.parse(readFileSync(new URL(`../themes/${mode}.json`, import.meta.url), 'utf8'));
  test(`${mode} application and editor colors meet their contrast thresholds`, () => {
    assert.deepEqual(auditDefinition(definition), []);
  });
  test(`${mode} audit rejects invisible text and focus indicators`, () => {
    const broken = structuredClone(definition);
    broken.colors.text.primary = broken.colors.bg.base;
    broken.colors.border.focus = broken.colors.bg.base;
    broken.editor.rules[0].foreground = broken.editor.colors['editor.background'];
    const labels = auditDefinition(broken).map(failure => failure.label);
    assert.ok(labels.includes('text.primary'));
    assert.ok(labels.includes('border.focus'));
    assert.ok(labels.includes(`editor.${broken.editor.rules[0].token}`));
  });
}
