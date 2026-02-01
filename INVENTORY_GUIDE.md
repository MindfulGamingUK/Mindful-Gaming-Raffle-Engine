# Inventory Management Guide

To ensure high-quality presentation, Mindful Gaming UK uses a Product-Centric Inventory model.

## 1. Create Products in Wix Stores
- Add the real physical items (e.g. "PS5 Pro Console").
- Add high-resolution images to the product gallery.
- Note the `wixProductId`.

## 2. Configure Prize Bundles in CMS: `PrizeBundles`
Some draws offer multiple items. Group them here.
- `bundleId`: Unique identifier (e.g. `ps5-pro-launch-bundle`).
- `items`: Reference to Wix Products or static list.
- `totalMSRP`: Combined value of all items.

## 3. Launch a Raffle: `Raffles` Collection
Connect the logic to the assets.

| Field | Value Example |
|-------|---------------|
| `drawType` | `LOTTERY_RAFFLE` |
| `assetKey` | `PRIZE_PS5_PRO` |
| `heroImageUrl` | [Direct Wix Media URL or fallback] |
| `wixProductId` | `inv_ps5_001` |
| `prizeValue` | 799.00 |

## Image Best Practices
- **Hero Image**: 16:9 aspect ratio, high contrast, branded Mindful Gaming corner logo.
- **Gallery**: At least 3 images showing the product and its box.
- **Transparency**: Include a screenshot or link to the specific product variant in a major UK retailer (Amazon, Argos, Curry's) to verify MSRP.
