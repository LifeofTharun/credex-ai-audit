/**
 * Audit Engine for AI Spend
 */

export type ToolName = 'Cursor' | 'GitHub Copilot' | 'ChatGPT' | 'Claude' | 'Gemini' | 'API';
export type PlanTier = 'Free' | 'Pro' | 'Team' | 'Business' | 'Enterprise';
export type UseCase = 'Coding' | 'Writing' | 'Data' | 'Mixed';

export interface ToolInput {
  name: ToolName;
  tier: PlanTier;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult {
  monthlySavings: number;
  annualSavings: number;
  recommendations: string[];
}

export const PRICING_BENCHMARKS = {
  CURSOR: { PRO: 20, BUSINESS: 40 },
  GITHUB_COPILOT: { INDIVIDUAL: 10, BUSINESS: 19 },
  CHATGPT: { PLUS: 20, TEAM: 30 },
  CLAUDE: { PRO: 20, TEAM: 30 },
  GEMINI: { PRO: 20, BUSINESS: 20 }
};

export function calculateAudit(tools: ToolInput[], useCase: UseCase): AuditResult {
  let monthlySavings = 0;
  const recommendations: string[] = [];

  tools.forEach(tool => {
    // 1. Efficiency Rule: users < 2 and 'Team' plan -> 'Pro'
    if (tool.seats < 2 && (tool.tier === 'Team' || tool.tier === 'Business')) {
      let benchmark = 20; // Default for most Pro plans
      if (tool.name === 'GitHub Copilot') benchmark = 10;
      
      const diff = tool.monthlySpend - benchmark;
      if (diff > 0) {
        monthlySavings += diff;
        recommendations.push(`Downgrade ${tool.name} from ${tool.tier} to Pro for 1 user to save $${diff}/mo.`);
      }
    }

    // 2. Use Case Alternatives
    if (useCase === 'Coding' && tool.name === 'GitHub Copilot') {
      recommendations.push(`Consider switching from GitHub Copilot to Cursor for better IDE integration.`);
    }

    if (useCase === 'Writing' && tool.name === 'ChatGPT') {
      recommendations.push(`Try Claude Pro for nuanced writing and long-context analysis.`);
    }
    
    // Gemini optimization
    if (tool.name === 'Gemini' && tool.tier === 'Business' && tool.seats < 2) {
      const diff = tool.monthlySpend - 20;
      if (diff > 0) {
        monthlySavings += diff;
        recommendations.push(`Switch Gemini Business to Gemini Advanced (Pro) to save $${diff}/mo.`);
      }
    }
  });

  return {
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendations
  };
}
