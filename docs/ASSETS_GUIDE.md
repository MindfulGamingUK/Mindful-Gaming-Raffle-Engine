# Asset Management Guide

To ensure stability and performance, we do not use external hotlinked images in production. All prize images are served locally from `public/assets/prizes/`.

## Directory Structure
Place images in `public/assets/prizes/`.

## Naming Convention
Use `snake_case` with the prefix `bundle_`.
- `bundle_ps5_pro.jpg`
- `bundle_steam_deck.jpg`
- `bundle_xbox_series.jpg`
- `bundle_switch_oled.jpg`
- `bundle_pc_setup.jpg`
- `bundle_retro_collection.jpg`
- `bundle_accessories_pro.jpg`
- `hero_bg.jpg`
- `placeholder.jpg`

## Dimensions
- **Aspect Ratio**: 16:9 recommended for all bundle images.
- **Resolution**: At least 1200x675.

## Usage in Code
Reference assets using keys in `utils/assets.ts`:

```typescript
const url = getAsset('PRIZE_PS5_PRO');
```