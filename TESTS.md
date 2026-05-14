# Manual Test Cases

These tests ensure the `Audit Engine` logic is working as intended for financial accuracy.

## Test Case 1: Over-provisioned Plan
- **Scenario**: A single user is on a "ChatGPT Team" plan costing $30/mo.
- **Expected Result**: 
    - Action: "Downgrade"
    - Savings: $10/mo
    - Reason: "You are paying for a Team plan for only 1 user. Downgrading to a 'Pro' or 'Individual' plan would save you $10/mo."

## Test Case 2: Tool Alternative (Coding)
- **Scenario**: A team of 5 developers uses "GitHub Copilot Business" ($19/user/mo).
- **Expected Result**: 
    - Action: "Switch Tool"
    - Reason: Suggests evaluating "Cursor" due to the primary use case being "Coding".

## Test Case 3: Subscription Redundancy
- **Scenario**: User has both "ChatGPT Plus" and "Claude Pro" subscriptions.
- **Expected Result**: 
    - Action: "Consolidate"
    - Savings: $20/mo
    - Reason: "You are paying for both ChatGPT and Claude. Unless your team requires specific models from both, consolidating to one tool can save costs."

## Test Case 4: High Spend Credit Opportunity
- **Scenario**: Total monthly spend across all tools is $650.
- **Expected Result**: 
    - `credexCreditEligible`: `true`
    - Summary: Includes a note about eligibility for "Credex Credits".

## Test Case 5: Team Size mismatch
- **Scenario**: Team size is 10, but only 2 seats are provisioned on a Team plan.
- **Expected Result**: 
    - Action: "Optimize"
    - Reason: Flags that the seat count doesn't match the team size, potentially causing workflow bottlenecks.
