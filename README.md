# Tokyo Night for Tabularis

Tokyo Night Day and Night themes for Tabularis 0.26.0 or later. Both variants cover the application and SQL editor.

## Install

Download `theme-universal.zip` from the [latest release](https://github.com/Detoy/tabularis-tokyo-night-theme/releases/latest). In Tabularis, open **Settings → Appearance → Local package** and choose the ZIP, then select **Tokyo Night Day** or **Tokyo Night Night**. Installing the package does not change the active theme.

## Screenshots

Local ZIP installation has been checked in Tabularis 0.27.0. Native screenshots will be added before the release is published.

## Validate and package

No dependency installation is needed:

```sh
node --test tests/contrast.test.mjs
node tools/check-contrast.mjs
node tools/theme.mjs validate . --tag v1.0.0
node tools/theme.mjs package . --tag v1.0.0 --output theme-universal.zip
```

## Palette and license

Adapted from [folke/tokyonight.nvim](https://github.com/folke/tokyonight.nvim/tree/cdc07ac78467a233fd62c493de29a17e0cf2b2b6), which provides the Tokyo Night palette under Apache-2.0. This package’s original work is MIT licensed; `LICENSE.txt` retains both licenses. Backgrounds and palette hues are retained. The following foregrounds use adjusted lightness to meet Tabularis’ WCAG AA contrast pairs. SQL comments and line numbers also use an accessible version of the palette’s comment color; predefined SQL names use the adjusted text accent.

| Variant | Token | Palette | Adapted |
| --- | --- | --- | --- |
| Day | `text.primary` | `#3760bf` | `#2c4c97` |
| Day | `text.secondary` | `#6172b0` | `#445287` |
| Day | `text.muted` | `#68709a` | `#4d5373` |
| Day | `text.accent` | `#2e7de9` | `#1251a8` |
| Day | `accent.secondary` | `#9854f1` | `#771dec` |
| Day | `accent.success` | `#587539` | `#4b6431` |
| Day | `accent.warning` | `#8c6c3e` | `#725833` |
| Day | `accent.error` | `#f52a65` | `#b9093c` |
| Day | `accent.info` | `#007197` | `#006485` |
| Day | `semantic.string` | `#587539` | `#4b6431` |
| Day | `semantic.number` | `#b15c00` | `#8f4a00` |
| Day | `semantic.boolean` | `#9854f1` | `#771dec` |
| Day | `semantic.date` | `#007197` | `#006485` |
| Day | `semantic.null` | `#68709a` | `#545b7e` |
| Day | `semantic.primaryKey` | `#8c6c3e` | `#725833` |
| Day | `semantic.foreignKey` | `#007197` | `#006485` |
| Day | `semantic.index` | `#7847bd` | `#7242b7` |
| Day | `semantic.modified` | `#2e7de9` | `#1359b8` |
| Day | `semantic.new` | `#587539` | `#4b6431` |
| Day | `semantic.deleted` | `#f52a65` | `#b9093c` |
| Day | `border.focus` | `#2e7de9` | `#2074e8` |
| Night | `text.muted` | `#737aa2` | `#8f94b4` |
| Night | `semantic.null` | `#737aa2` | `#7b81a7` |

Primary button labels use white or black according to contrast against the fill.

Partially AI-assisted.
