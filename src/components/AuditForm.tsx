"use client";

import React, { useState } from 'react';
import { calculateAudit, ToolInput, UseCase } from '@/lib/audit-engine';
import { saveAudit } from '@/lib/supabase';

export default function AuditForm({ onComplete }: { onComplete: (result: any) => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [useCase, setUseCase] = useState<UseCase>('Mixed');
  const [tools, setTools] = useState<ToolInput[]>([
    { name: 'ChatGPT', tier: 'Plus', monthlySpend: 20, seats: 1 }
  ]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const addTool = () => {
    setTools([...tools, { name: 'Cursor', tier: 'Pro', monthlySpend: 20, seats: 1 }]);
  };

  const updateTool = (index: number, field: keyof ToolInput, value: any) => {
    const newTools = [...tools];
    newTools[index] = { ...newTools[index], [field]: value };
    setTools(newTools);
  };

  const handleSubmit = async () => {
    const result = calculateAudit(tools, useCase);
    try {
      await saveAudit({
        email,
        company_name: company,
        total_savings: result.monthlySavings
      });
    } catch (e) {
      console.error("Supabase Save Error:", e);
    }
    onComplete({ ...result, email, company });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 h-2 rounded-full mx-1 ${
                step >= s ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {step === 1 && "Basic Information"}
          {step === 2 && "Your AI Stack"}
          {step === 3 && "Review & Generate"}
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="Acme Inc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Use Case</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="Coding">Coding</option>
              <option value="Writing">Writing</option>
              <option value="Data">Data Analysis</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {tools.map((tool, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3 relative border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Tool</label>
                  <select
                    value={tool.name}
                    onChange={(e) => updateTool(index, 'name', e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    <option>ChatGPT</option>
                    <option>Claude</option>
                    <option>Cursor</option>
                    <option>GitHub Copilot</option>
                    <option>Gemini</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Tier</label>
                  <select
                    value={tool.tier}
                    onChange={(e) => updateTool(index, 'tier', e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    <option>Pro</option>
                    <option>Team</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Seats</label>
                  <input
                    type="number"
                    value={tool.seats}
                    onChange={(e) => updateTool(index, 'seats', parseInt(e.target.value))}
                    className="w-full p-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Monthly Spend ($)</label>
                  <input
                    type="number"
                    value={tool.monthlySpend}
                    onChange={(e) => updateTool(index, 'monthlySpend', parseInt(e.target.value))}
                    className="w-full p-1 border rounded"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addTool}
            className="text-indigo-600 font-semibold hover:text-indigo-800 text-sm"
          >
            + Add Another Tool
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-6 text-lg">
            Ready to analyze your spend for <strong>{company}</strong>?
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg text-left mb-6">
            <p className="text-sm text-indigo-700">
              <strong>Tools being audited:</strong> {tools.map(t => t.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition"
          >
            Back
          </button>
        )}
        <div className="flex-1" />
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Generate Audit
          </button>
        )}
      </div>
    </div>
  );
}
