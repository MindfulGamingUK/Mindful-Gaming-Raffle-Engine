# Prize Competition Compliance Notes

Prize Competitions in the UK are distinct from Lotteries (raffles). To avoid being classified as an illegal lottery, they must require a "skill, judgment or knowledge" test.

## Compliance Requirements
1. **Meaningful Skill Question**: The question must be difficult enough to deter a significant number of people from entering or to ensure that a significant proportion of those who enter do not get it right.
2. **Standard Entry Route**: Unlike lotteries, prize competitions do not strictly require a "free entry route" (like post) if they are genuinely skill-based, BUT adding one is best practice to completely avoid "Lottery" classification by the Gambling Commission.
3. **Terms & Conditions**: Must explicitly state "This is a Prize Competition and not a Lottery."
4. **No Charitable Connection REQUIRED**: While proceeds can go to charity, the legal basis of the draw is the skill test, not the Small Society Lottery registration.

## Implementation Details
- `RaffleType.PRIZE_COMPETITION` removes the "Small Society Lottery" registration footer.
- Requires `skillAnswerIndex` in `createEntryIntent`.
- Correct answers are verified server-side before a payment session is even created.
