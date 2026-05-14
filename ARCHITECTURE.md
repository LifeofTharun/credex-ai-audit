# Architecture

## Technology Stack Rationale
- **TypeScript**: Chosen for its type safety, which is critical when handling financial calculations and audit data.
- **Supabase**: Provides a scalable PostgreSQL database with minimal configuration, perfect for storing audit logs.
- **OpenAI (GPT-4o)**: Used for high-level strategic reasoning that goes beyond simple rule-based calculations.
- **Resend**: A developer-friendly email API for delivering reports.

## Data Flow Diagram

```mermaid
graph TD
    User[User Input] -->|Submit Audit| Engine[Audit Engine]
    Engine -->|Static Rules| Logic[Rule-Based Logic]
    Engine -->|Refinement| AI[OpenAI GPT-4o]
    Logic --> Result[Audit Result]
    AI --> Result
    Result -->|Store| DB[Supabase Database]
    Result -->|Notify| Email[Resend Email Service]
    Result -->|View| UI[Dashboard UI]
```

## Core Components
1. **Audit Logic**: Located in `src/auditEngine.ts`, handles all calculations.
2. **Data Clients**: `src/lib/supabaseClient.ts` and `src/lib/emailService.ts`.
3. **Integration Layer**: Combines rule-based logic with AI insights.
