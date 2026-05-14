# AI Prompts

This document lists the prompts used to generate strategic audit summaries.

## Audit Summary Refinement
**Model**: `gpt-4o`
**System Prompt**: `You are a financial audit assistant.`
**User Prompt**:
```text
As a specialized AI Financial Auditor, analyze the following spend report:
Team Size: {{teamSize}}
Primary Use Case: {{primaryUseCase}}
Tools: {{toolsJson}}
Current Audit Logic Results: {{recommendationsJson}}

Provide a refined summary reasoning sentence and, if necessary, add one more advanced "strategic" recommendation that simple logic might miss. 
Keep the tone professional and defensible for a CFO.
Return the response in JSON format matching the structure:
{ 
  "refinedSummary": "...", 
  "strategicRecommendation": { 
    "toolName": "...", 
    "action": "...", 
    "potentialSavings": 0, 
    "reasoning": "..." 
  } | null 
}
```

## Logic Rationale
The prompt is designed to:
1.  **Contextualize**: It provides the AI with both raw data and the results of the rule-based logic.
2.  **Professionalize**: It explicitly asks for a "CFO-defensible" tone.
3.  **Synthesize**: It asks for a single strategic recommendation to avoid cluttering the report with low-value AI guesses.
