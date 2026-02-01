# Hybrid Model: Lottery vs. Competition

Mindful Gaming UK operates two distinct types of promotion to ensure compliance with the UK Gambling Act 2005 while maximizing engagement and support for our charitable objectives.

## 🎰 Lottery Raffles (Lotteries)
- **Regulated by**: Gambling Act 2005 (Small Society Lottery).
- **Registration**: Registered with Birmingham City Council (#LN/2025001).
- **Mechanism**: Pure chance. Winners selected by random generator.
- **Requirements**: 18+, Residents of Great Britain only.
- **Maximum Prize Value**: £25,000 per draw.
- **Charity Contribution**: At least 20% of proceeds must go to the charity (MGUK targets 60%+).

## 🧠 Prize Competitions (Skill-based)
- **Legal Definition**: Not a "lottery" as defined by the Gambling Act because performance is gated by a skill-based test.
- **Mechanism**: "Genuine Skill, Judgment, or Knowledge."
- **Skill Gate**: One or more questions that a significant proportion of participants would fail. Correct answers are tracked in `EntryIntents`.
- **Requirements**: 18+ (MGUK policy, although law is more flexible).
- **Compliance Note**: Participation depends on correctly answering the question. Failed answers do not enter the draw and do not receive a refund (it is an entry fee, not a donation).

## Comparison Table

| Feature | Lottery Raffle | Prize Competition |
|---------|----------------|-------------------|
| **Entry Type** | Chance-based | Skill-gated |
| **Regulation** | Licensed/Registered | Commercial (Self-Reg) |
| **Skill Question** | Optional (Awareness Only) | Mandatory (Gating) |
| **Gift Aid** | No | No |
| **Donation?** | No (Purchase of Chance) | No (Entry Fee) |
| **Primary Audience** | Broad supporters | Gamers / Enthusiasts |

## Implementation in Single Codebase
The Mindful Gaming Raffle Engine handles both via the `drawType` property:
1. `LOTTERY_RAFFLE`: Triggers age/residency gate + optional mindfulness moment.
2. `PRIZE_COMPETITION`: Triggers mandatory skill gate before payment.
