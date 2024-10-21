import React, { InputHTMLAttributes } from 'react';
import { Path, useFormContext, useFormState } from 'react-hook-form';
import { TFormData } from '../types';
import { ErrorMessage } from '@hookform/error-message';
import classnames from 'classnames';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<TFormData>;
}

export const FormInput: React.FC<Props> = ({ label, name, readOnly, ...props }) => {
  const { register, getFieldState } = useFormContext<TFormData>();
  const { errors } = useFormState<TFormData>();
  const { invalid } = getFieldState(name);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <input
        id={name}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${name}-error` : undefined}
        readOnly={readOnly}
        {...register(name)}
        {...props}
        className={classnames(
          'w-full rounded-md border px-3 py-2 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          readOnly ? 'bg-paper font-mono' : 'bg-white',
          invalid ? 'border-danger' : readOnly ? 'border-transparent' : 'border-line',
          props.type === 'number' && 'font-mono'
        )}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p id={`${name}-error`} role="alert" className="text-sm text-danger">
            {message}
          </p>
        )}
      />
    </div>
  );
};
