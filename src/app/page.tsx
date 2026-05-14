"use client";

import { useState } from 'react';
import AuditForm from '@/components/AuditForm';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [result, setResult] = useState<any>(null);

  return (
    <main className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl tracking-tight">
            AI Spend <span className="text-indigo-600">Audit</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Find the waste in your AI stack in under 60 seconds. Get defensible financial recommendations for your team.
          </p>
        </div>

        {!result ? (
          <AuditForm onComplete={(res) => setResult(res)} />
        ) : (
          <Dashboard result={result} />
        )}
      </div>

      <footer className="mt-24 text-center text-gray-400 text-sm">
        &copy; 2026 AI Spend Audit. Built for the Credex Internship Assignment.
      </footer>
    </main>
  );
}
