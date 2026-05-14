# Project Reflection

## 1. What bug did you encounter and how did you fix it?
**Bug**: I encountered a "Plan Mismatch" bug where the engine recommended a downgrade for a single user on a Team plan even if the "Pro" plan for that tool didn't actually exist or had different features they needed.
**Fix**: I implemented a more granular `PRICING_BENCHMARKS` object and added a secondary check to ensure the "target" plan was actually cheaper and appropriate for the tool's specific tier structure.

## 2. What decision did you reverse during development?
**Decision Reversal**: I initially planned to use a Vector Database to store tool pricing documentation. 
**Reversal**: I reversed this and opted for a static `PRICING_BENCHMARKS` object. I realized that for an MVP, "defensibility" is better served by deterministic pricing data that the user can verify, rather than "fuzzy" AI-retrieved pricing which might be outdated or hallucinated.

## 3. How did you use AI to speed up your work?
I used AI (OpenAI GPT-4o) specifically for **Strategic Synthesis**. While the code handles the "math," the AI writes the human-readable summary that explains *why* a decision makes sense in a business context. This saved me from writing hundreds of complex string templates for every possible edge case.

## 4. What was the most challenging part of the system design?
The most challenging part was the **Recommendation Consolidation**. When a user has 5 different tools, they often overlap (e.g., Cursor + Copilot + ChatGPT). Writing logic that doesn't just say "cancel everything" but instead suggests a "Unified AI Stack" required careful weighing of tool utility vs. cost.

## 5. If you had 7 more days, what would you add?
1. **Automated Spend Scraper**: Instead of manual input, I would add an integration to connect to a user's Gmail/QuickBooks to automatically find AI subscription line items.
2. **Usage Monitoring**: Integration with tool APIs (like OpenAI Usage API) to see if seats are actually being used or just sitting idle.
3. **Multi-Currency Support**: Handling teams paying in EUR/INR/USD with real-time conversion.
