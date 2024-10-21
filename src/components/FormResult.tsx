import React, { useMemo } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { DISCOUNT_RATE, formatAmount, summarize } from '../lib/totals';
import { TFormData } from '../types';

interface HeadingProps {
  title: string;
  price: string;
}

const Heading: React.FC<HeadingProps> = ({ title, price }) => {
  return (
    <div className="flex w-full space-x-4">
      <h2 className="text-lg font-medium w-1/2">{title}</h2>
      <h2 className="text-lg font-normal w-1/2 text-right">{price}</h2>
    </div>
  );
};

export const FormResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as TFormData | undefined;
  const summary = useMemo(() => formData && summarize(formData), [formData]);

  if (!formData || !summary) {
    return (
      <section className="bg-white rounded-2xl p-8 max-w-lg m-6">
        <h1 className="text-2xl font-semibold">No estimate to review</h1>
        <p className="my-4 text-gray-600">
          Complete the form first. This demo passes results in browser navigation state and does not save estimates.
        </p>
        <button onClick={() => navigate('/')} className="text-green-800 underline">
          Create an estimate
        </button>
      </section>
    );
  }

  return (
    <div className="bg-white flex flex-col gap-5 p-5 h-1/2 w-full md:w-1/2 md:rounded-2xl md:shadow-md mx-auto my-auto">
      <button
        className="text-blue-600 flex items-center mb-4"
        onClick={() => navigate('/', { state: { draft: formData } })}
      >
        <IoIosArrowBack className="mr-2" size={20} />
        Back
      </button>

      <h1 className="text-3xl font-semibold text-center">Form Results</h1>

      <Heading title="Task Total" price={formatAmount(summary.tasks)} />
      <Heading title="Material Total" price={formatAmount(summary.materials)} />
      <Heading title="Net Total" price={formatAmount(summary.net)} />
      <hr className="border-t-2 border-gray-200 my-2" />

      <Heading title="Discount" price={`${DISCOUNT_RATE * 100}%`} />
      <hr className="border-t-2 border-gray-200 my-2" />

      <Heading title="Grand Total" price={formatAmount(summary.grand)} />
    </div>
  );
};
