/**
 * Audit Engine for AI Spend
 * This module contains the core logic for analyzing AI tool expenditures.
 */
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Data Schema (Types) ---

export type PlanType = 'Free' | 'Pro' | 'Plus' | 'Team' | 'Business' | 'Enterprise' | 'Individual' | 'Hobby' | 'API';

export type UseCase = 'Coding' | 'Writing' | 'Data' | 'Research' | 'Mixed';

export interface AITool {
  name: string;
  planType: PlanType;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: AITool[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export type RecommendedAction = 'Downgrade' | 'Switch Tool' | 'Keep' | 'Consolidate' | 'Optimize';

export interface Recommendation {
  toolName: string;
  action: RecommendedAction;
  potentialSavings: number;
  reasoning: string;
}

export interface AuditResult {
  currentTotalCost: number;
  totalPotentialSavings: number;
  recommendations: Recommendation[];
  credexCreditEligible: boolean;
  summaryReasoning: string;
}

// --- Static Pricing Constants ---

export const PRICING_BENCHMARKS = {
  CURSOR: {
    HOBBY: 0,
    PRO: 20,
    BUSINESS: 40,
  },
  GITHUB_COPILOT: {
    INDIVIDUAL: 10,
    BUSINESS: 19,
    ENTERPRISE: 39,
  },
  CHATGPT: {
    PLUS: 20,
    TEAM: 30, // Monthly
    ENTERPRISE: 60, // Estimated
  },
  CLAUDE: {
    PRO: 20,
    TEAM: 30,
  },
  API_ESTIMATE: {
    MIXED: 25, // Average cost per seat for mixed API usage
  }
};

// --- Logic Function ---

/**
 * Calculates the audit results based on the provided input.
 */
export function calculateAudit(input: AuditInput): AuditResult {
  const { tools, teamSize, primaryUseCase } = input;
  let currentTotalCost = 0;
  const recommendations: Recommendation[] = [];

  tools.forEach(tool => {
    currentTotalCost += tool.monthlySpend;

    // 1. Efficiency Checks (Plan Optimization)
    checkEfficiency(tool, recommendations);
    
    // 2. Alternatives Checks (Tool Selection)
    checkAlternatives(tool, primaryUseCase, teamSize, recommendations);
  });

  // 3. Redundancy Checks (Multiple tools for same purpose)
  checkRedundancy(tools, recommendations);

  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);
  
  // 4. Credit Opportunities
  const credexCreditEligible = currentTotalCost > 500;

  let summaryReasoning = `We found ${recommendations.length} optimization opportunities. `;
  if (credexCreditEligible) {
    summaryReasoning += "Your spend exceeds $500, making you a strong candidate for Credex Credits.";
  } else {
    summaryReasoning += "Your spend is within a healthy range, but there are still ways to optimize.";
  }

  return {
    currentTotalCost,
    totalPotentialSavings,
    recommendations,
    credexCreditEligible,
    summaryReasoning
  };
}

/**
 * AI-Enhanced Audit Logic
 * Uses OpenAI to provide deeper insights and more human-like reasoning.
 */
export async function calculateAIEnhancedAudit(input: AuditInput): Promise<AuditResult> {
  const baseResult = calculateAudit(input);

  try {
    const prompt = `
      As a specialized AI Financial Auditor, analyze the following spend report:
      Team Size: ${input.teamSize}
      Primary Use Case: ${input.primaryUseCase}
      Tools: ${JSON.stringify(input.tools)}
      Current Audit Logic Results: ${JSON.stringify(baseResult.recommendations)}

      Provide a refined summary reasoning sentence and, if necessary, add one more advanced "strategic" recommendation that simple logic might miss. 
      Keep the tone professional and defensible for a CFO.
      Return the response in JSON format matching the structure:
      { "refinedSummary": "...", "strategicRecommendation": { "toolName": "...", "action": "...", "potentialSavings": 0, "reasoning": "..." } | null }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are a financial audit assistant." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const aiData = JSON.parse(response.choices[0].message.content || '{}');

    if (aiData.refinedSummary) {
      baseResult.summaryReasoning = aiData.refinedSummary;
    }

    if (aiData.strategicRecommendation) {
      baseResult.recommendations.push(aiData.strategicRecommendation);
    }

  } catch (error) {
    console.error('OpenAI Error:', error);
    // Fallback to base result if AI fails
  }

  return baseResult;
}

function checkEfficiency(tool: AITool, recommendations: Recommendation[]) {
  const isTeamPlan = ['Team', 'Business', 'Enterprise'].includes(tool.planType);
  
  // Case: Team plan for 1 user
  if (isTeamPlan && tool.seats === 1) {
    let benchmarkPrice = 20; // Default for Pro/Plus plans
    if (tool.name.toLowerCase().includes('cursor')) benchmarkPrice = PRICING_BENCHMARKS.CURSOR.PRO;
    if (tool.name.toLowerCase().includes('chatgpt')) benchmarkPrice = PRICING_BENCHMARKS.CHATGPT.PLUS;
    if (tool.name.toLowerCase().includes('claude')) benchmarkPrice = PRICING_BENCHMARKS.CLAUDE.PRO;
    if (tool.name.toLowerCase().includes('copilot')) benchmarkPrice = PRICING_BENCHMARKS.GITHUB_COPILOT.INDIVIDUAL;

    const savings = tool.monthlySpend - benchmarkPrice;
    if (savings > 0) {
      recommendations.push({
        toolName: tool.name,
        action: 'Downgrade',
        potentialSavings: savings,
        reasoning: `You are paying for a ${tool.planType} plan for only 1 user. Downgrading to a 'Pro' or 'Individual' plan would save you $${savings}/mo.`
      });
    }
  }
}

function checkAlternatives(tool: AITool, useCase: UseCase, teamSize: number, recommendations: Recommendation[]) {
  const toolNameLower = tool.name.toLowerCase();

  // Case: Coding use case and using Copilot
  if (useCase === 'Coding' && toolNameLower.includes('github copilot')) {
    recommendations.push({
      toolName: tool.name,
      action: 'Switch Tool',
      potentialSavings: 0, // Hard to quantify without knowing productivity gain
      reasoning: "Since your primary use case is Coding, you should evaluate 'Cursor'. It often provides deeper IDE integration and better context awareness for modern dev workflows."
    });
  }

  // Case: High spend on generic chat tools for specialized tasks
  if (useCase === 'Data' && (toolNameLower.includes('chatgpt') || toolNameLower.includes('claude'))) {
    recommendations.push({
      toolName: tool.name,
      action: 'Optimize',
      potentialSavings: 0,
      reasoning: "For Data-heavy tasks, ensure you are leveraging the API for automated workflows instead of just the chat interface to increase efficiency."
    });
  }
}

function checkRedundancy(tools: AITool[], recommendations: Recommendation[]) {
  const hasChatGPT = tools.some(t => t.name.toLowerCase().includes('chatgpt'));
  const hasClaude = tools.some(t => t.name.toLowerCase().includes('claude'));

  if (hasChatGPT && hasClaude) {
    recommendations.push({
      toolName: 'ChatGPT & Claude',
      action: 'Consolidate',
      potentialSavings: 20, // Estimate savings of one pro sub
      reasoning: "You are paying for both ChatGPT and Claude. Unless your team requires specific models from both, consolidating to one tool can save costs."
    });
  }
}
