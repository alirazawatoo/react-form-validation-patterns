import { TFormData } from '../types';

export const DISCOUNT_RATE = 0.2;

// Line totals are rounded to cents so 3 × 0.1 reads 0.3 rather than 0.30000000000000004.
// Products too large to scale by 100 are returned unrounded; the schema rejects them anyway.
export const lineTotal = (quantity: unknown, rate: unknown): number => {
  const q = Number(quantity ?? 0);
  const r = Number(rate ?? 0);
  if (!Number.isFinite(q) || !Number.isFinite(r)) return 0;
  const cents = q * r * 100;
  return Number.isFinite(cents) ? Math.round(cents) / 100 : q * r;
};

export const summarize = (data: TFormData) => {
  let tasks = 0;
  let materials = 0;
  for (const group of data.groups) {
    for (const task of group.tasks) {
      tasks += task.total;
      for (const material of task.materials) materials += material.total;
    }
  }
  const net = tasks + materials;
  return { tasks, materials, net, grand: net * (1 - DISCOUNT_RATE) };
};

const amountFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const formatAmount = (amount: number) => amountFormat.format(amount);
