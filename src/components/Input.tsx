import React, { InputHTMLAttributes } from 'react';
import { Path, useFormContext, useFormState } from 'react-hook-form';
import { TFormData } from '../types';
import { ErrorMessage } from '@hookform/error-message';
import classnames from 'classnames';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<TFormData>;
}

export const FormInput: React.FC<Props> = ({ label, name, ...props }) => {
  const { register, getFieldState } = useFormContext<TFormData>();
  const { errors } = useFormState<TFormData>();
  const { invalid } = getFieldState(name);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        id={name}
        {...register(name)}
        {...props}
        className={classnames(
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5',
          { 'border-red-600': invalid }
        )}
      />
      <ErrorMessage errors={errors} name={name} render={({ message }) => <p className="text-red-600">{message}</p>} />
    </div>
  );
};
