# Awareness Content Guide

This guide explains how to manage the "Awareness Content" collection in the Wix CMS to feed the "Wellness Rotator" and "Awareness Feed" on the live site.

## Collection Structure: `AwarenessContent`

| Field Key | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `title` | Text | The headline of the card. | "The 20-20-20 Rule" |
| `body` | Text (Long) | The main tip or fact. Keep it concise (under 200 chars ideal). | "Every 20 mins, look at something 20 ft away..." |
| `type` | Tags | Category for styling. Must be one of: `TIP`, `FACT`, `SYMPTOM`, `SUPPORT`. | `TIP` |
| `tags` | Tags | Keywords for filtering (e.g. `focus`, `sleep`, `money`). | `eye-health`, `breaks` |
| `active` | Boolean | Toggle to show/hide without deleting. | `true` |
| `priority` | Number | Higher numbers appear first/more often. 1-10 scale. | `10` |
| `resourceUrl` | URL | (Optional) Link to external resource or blog post. | `https://nhs.uk/eye-health` |
| `ctaLabel` | Text | (Optional) Text for the link button. Default: "Read More". | "Learn More" |

## Content Types & Styling

- **SYMPTOM** (`🛑` Red/Orange): Used for warning signs.
- **SUPPORT** (`🤝` Purple): links to support services.
- **FACT** (`💡` Teal): Educational statistics or myths debunked.
- **TIP** (`✅` Green/Teal): Actionable advice for healthy gaming.

## Best Practices

1. **Keep it Positive**: Even when discussing symptoms, frame it constructively (e.g., "Check in with yourself" vs "Don't be addicted").
2. **Action Oriented**: Tips should be something a user can do *now*.
3. **Regular Updates**: Add 2-3 new items per month to keep the feed fresh.

## Audit Logs

User interactions (clicks on "Read More" or "Wellness Rotator") are logged to the `AuditLog` collection with type `AWARENESS_INTERACTION`. This helps track which content resonates most.
