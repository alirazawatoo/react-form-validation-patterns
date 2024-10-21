import React, { useMemo } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { DISCOUNT_RATE, formatAmount, summarize } from '../lib/totals';
import { TFormData } from '../types';

interface LineProps {
  title: string;
  value: string;
  emphasis?: boolean;
}

const Line: React.FC<LineProps> = ({ title, value, emphasis }) => (
  <div className={`flex items-baseline justify-between gap-4 py-2 ${emphasis ? 'text-xl font-semibold' : ''}`}>
    <dt className={emphasis ? 'section-title' : 'text-ink-soft'}>{title}</dt>
    <dd className="font-mono tabular-nums">{value}</dd>
  </div>
);

export const FormResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as TFormData | undefined;
  const summary = useMemo(() => formData && summarize(formData), [formData]);

  if (!formData || !summary) {
    return (
      <section className="mx-auto max-w-lg rounded-lg border border-line bg-white p-8">
        <h1 className="section-title text-2xl">No estimate to review</h1>
        <p className="my-4 text-ink-soft">
          Complete the form first. This demo passes results in browser navigation state and does not save estimates.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Create an estimate
        </button>
      </section>
    );
  }

  const taskCount = formData.groups.reduce((count, group) => count + group.tasks.length, 0);

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-lg border border-line bg-white p-5 shadow-sm sm:p-8">
      <button
        className="btn-quiet self-start text-accent-dark hover:bg-accent-tint"
        onClick={() => navigate('/', { state: { draft: formData } })}
      >
        <IoIosArrowBack aria-hidden="true" size={18} />
        Back
      </button>

      <header className="border-b border-line pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-dark">Estimate summary</p>
        <h1 className="section-title text-3xl">Form Results</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {formData.client} · {formData.groups.length} {formData.groups.length === 1 ? 'group' : 'groups'} · {taskCount}{' '}
          {taskCount === 1 ? 'task' : 'tasks'}
        </p>
      </header>

      <dl className="divide-y divide-line">
        <Line title="Task Total" value={formatAmount(summary.tasks)} />
        <Line title="Material Total" value={formatAmount(summary.materials)} />
        <Line title="Net Total" value={formatAmount(summary.net)} />
        <Line title="Discount" value={`${DISCOUNT_RATE * 100}%`} />
        <Line title="Grand Total" value={formatAmount(summary.grand)} emphasis />
      </dl>
    </section>
  );
};
