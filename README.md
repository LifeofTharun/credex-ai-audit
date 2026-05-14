# Credex AI Spend Audit Tool

The **Audit Engine** is the core logic that compares a user's current spend on AI tools against optimal pricing, providing actionable recommendations to save costs.

## 📸 Screenshots
![Dashboard Placeholder](https://via.placeholder.com/800x400?text=Dashboard+Mockup)
*Caption: The main dashboard showing potential savings and tool distribution.*

![Audit Report Placeholder](https://via.placeholder.com/800x400?text=Audit+Report+Mockup)
*Caption: Detailed audit report with AI-enhanced recommendations.*

## 🛠️ 5 Key Decisions
1. **Rule-First, AI-Second Architecture**: We prioritize hard logic for financial accuracy (e.g., plan downgrades) and use AI only for strategic synthesis. This ensures the tool is "defensible" to a CFO.
2. **TypeScript for Financial Integrity**: Every calculation and data structure is strictly typed to prevent rounding errors or data type mismatches in reports.
3. **Hybrid Storage Approach**: Using Supabase for relational audit data allows for complex querying later, while using `.env.local` for keys keeps the setup developer-friendly.
4. **Resend for High-Value Delivery**: Instead of just showing a web page, we deliver audits via email. This creates a "tangible" asset that founders can forward to their finance teams.
5. **JSON-Structured AI Outputs**: We force OpenAI to return JSON. This allows us to programmatically merge AI insights with our rule-based results without brittle string parsing.

## Tech Stack
- **Logic**: TypeScript
- **Database**: Supabase
- **AI**: OpenAI (GPT-4o)
- **Email**: Resend

## Getting Started

### Prerequisites
- Node.js (v18+)
- NPM or Yarn

### Setup
1. Clone the repo.
2. Create a `.env.local` file based on `.env.example`.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Tests
To run the core audit logic tests:
```bash
npx ts-node src/testAudit.ts
```
