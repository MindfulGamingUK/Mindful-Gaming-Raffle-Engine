# Asset Management Guide

To ensure stability and performance, we do not use external hotlinked images. All prize images are served locally.

## Directory Structure
Place images in `public/assets/prizes/`.

## Naming Convention
Use `snake_case` with the prefix `bundle_`.
- `bundle_ps5_pro.jpg`
- `bundle_steam_deck.jpg`
- `bundle_xbox_series.jpg`
- `bundle_switch_oled.jpg`
- `bundle_pc_setup.jpg`
- `hero_bg.jpg`
- `placeholder.jpg`

## Usage in Code
Reference assets using keys in `utils/assets.ts`:

```typescript
const url = getAsset('PRIZE_PS5_PRO');
```

## Adding a New Prize
1. Save image to `public/assets/prizes/new_prize.jpg`.
2. Add key to `ASSET_REGISTRY` in `utils/assets.ts`:
   ```typescript
   'PRIZE_NEW': '/assets/prizes/new_prize.jpg'
   ```
