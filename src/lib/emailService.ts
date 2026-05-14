import { Resend } from 'resend';
import { AuditResult } from '../auditEngine';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditReport(email: string, result: AuditResult) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Audit Engine <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Spend Audit Report',
      html: `
        <h1>AI Spend Audit Report</h1>
        <p><strong>Total Monthly Cost:</strong> $${result.currentTotalCost}</p>
        <p><strong>Potential Monthly Savings:</strong> $${result.totalPotentialSavings}</p>
        <p><strong>Summary:</strong> ${result.summaryReasoning}</p>
        <h2>Recommendations:</h2>
        <ul>
          ${result.recommendations.map(rec => `
            <li>
              <strong>${rec.toolName}</strong>: ${rec.action} <br/>
              <em>Reasoning:</em> ${rec.reasoning}
            </li>
          `).join('')}
        </ul>
        ${result.credexCreditEligible ? '<p><strong>🎉 You are eligible for Credex Credits!</strong></p>' : ''}
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
}
