import { calculateAudit, AuditInput } from './auditEngine';

const testCases: { name: string; input: AuditInput }[] = [
  {
    name: "Single user on Team Plan",
    input: {
      teamSize: 1,
      primaryUseCase: 'Writing',
      tools: [
        {
          name: "ChatGPT",
          planType: 'Team',
          monthlySpend: 30,
          seats: 1
        }
      ]
    }
  },
  {
    name: "Coding team using Copilot",
    input: {
      teamSize: 5,
      primaryUseCase: 'Coding',
      tools: [
        {
          name: "GitHub Copilot",
          planType: 'Business',
          monthlySpend: 95, // 19 * 5
          seats: 5
        }
      ]
    }
  },
  {
    name: "High spend enterprise",
    input: {
      teamSize: 20,
      primaryUseCase: 'Mixed',
      tools: [
        {
          name: "ChatGPT",
          planType: 'Enterprise',
          monthlySpend: 1200,
          seats: 20
        },
        {
          name: "Claude",
          planType: 'Team',
          monthlySpend: 600,
          seats: 20
        }
      ]
    }
  }
];

testCases.forEach(testCase => {
  console.log(`--- Test Case: ${testCase.name} ---`);
  const result = calculateAudit(testCase.input);
  console.log(JSON.stringify(result, null, 2));
  console.log('\n');
});
