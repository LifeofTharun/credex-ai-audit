"use client";

import React from 'react';
import { AuditResult } from '@/lib/audit-engine';

export default function Dashboard({ result }: { result: AuditResult & { company: string } }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Monthly Savings</p>
          <p className="text-3xl font-bold text-green-600">${result.monthlySavings}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Annual Savings</p>
          <p className="text-3xl font-bold text-indigo-600">${result.annualSavings}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Audit Status</p>
          <p className="text-3xl font-bold text-gray-800">Complete</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Personalized Recommendations for {result.company}</h3>
        </div>
        <div className="p-6 space-y-4">
          {result.recommendations.length > 0 ? (
            result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-indigo-900 font-medium">{rec}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10 italic">
              Your AI stack is already optimized! Great job.
            </p>
          )}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={() => window.location.reload()}
          className="text-gray-500 hover:text-indigo-600 text-sm font-medium underline"
        >
          Run another audit
        </button>
      </div>
    </div>
  );
}
