import { calculateAIEnhancedAudit, AuditInput } from './auditEngine';
import { sendAuditReport } from './lib/emailService';
import { supabase } from './lib/supabaseClient';

async function runIntegrationTest() {
  const testInput: AuditInput = {
    teamSize: 10,
    primaryUseCase: 'Coding',
    tools: [
      {
        name: "GitHub Copilot",
        planType: 'Business',
        monthlySpend: 190,
        seats: 10
      },
      {
        name: "ChatGPT",
        planType: 'Plus',
        monthlySpend: 200, // 10 users paying individually
        seats: 10
      }
    ]
  };

  console.log('--- Step 1: Running AI-Enhanced Audit ---');
  const result = await calculateAIEnhancedAudit(testInput);
  console.log('Audit Result:', JSON.stringify(result, null, 2));

  console.log('\n--- Step 2: Saving to Supabase (Mocked/Attempted) ---');
  const { data, error } = await supabase
    .from('audits')
    .insert([
      {
        team_size: testInput.teamSize,
        use_case: testInput.primaryUseCase,
        total_cost: result.currentTotalCost,
        potential_savings: result.totalPotentialSavings,
        recommendations: result.recommendations,
        is_eligible: result.credexCreditEligible,
        summary: result.summaryReasoning
      }
    ]);
  
  if (error) {
    console.error('Supabase Error (Table might not exist yet):', error.message);
  } else {
    console.log('Supabase Save Successful:', data);
  }

  console.log('\n--- Step 3: Sending Email via Resend ---');
  try {
    // Replace with a valid email to test actually sending
    // const emailData = await sendAuditReport('test@example.com', result);
    // console.log('Email Sent Successfully:', emailData);
    console.log('Email service is ready (Sending skipped to avoid spam/errors).');
  } catch (error) {
    console.error('Email Failed:', error);
  }
}

runIntegrationTest();
