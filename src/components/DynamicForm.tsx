import React, { useCallback } from 'react';
import { useForm, useFieldArray, SubmitHandler, FormProvider, useFormState } from 'react-hook-form';
import { FormInput } from './Input';
import { TFormData } from '../types';
import { TaskFields } from './TaskFields';
import { schema } from '../schemas/formSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { ErrorMessage } from '@hookform/error-message';
import { DEFAULT_FORM_VALUES, DEFAULT_GROUP_VALUE } from '../constants';
import { DISCOUNT_RATE } from '../lib/totals';
import { useNavigate, useLocation } from 'react-router-dom';

export const DynamicForm: React.FC = () => {
  const draft = useLocation().state?.draft as TFormData | undefined;
  const methods = useForm<TFormData>({
    defaultValues: draft ?? DEFAULT_FORM_VALUES,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const navigate = useNavigate();
  const { control, handleSubmit } = methods;
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({ control, name: 'groups' });
  const { errors, isSubmitting, submitCount } = useFormState({ control });
  const hasErrors = submitCount > 0 && Object.keys(errors).length > 0;

  const onSubmit: SubmitHandler<TFormData> = useCallback(
    (data) => {
      navigate('/results', { state: { formData: data } });
    },
    [navigate]
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-lg border border-line bg-white p-5 shadow-sm sm:p-8"
      >
        <header className="flex flex-col gap-2 border-b border-line pb-5">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-dark">Job estimate</p>
          <h1 className="section-title text-3xl">Estimate builder</h1>
          <p className="text-sm text-ink-soft">
            Group tasks and materials, then review the totals. A fixed {DISCOUNT_RATE * 100}% demo discount applies.
          </p>
        </header>

        <FormInput label="Client Name" name="client" autoComplete="off" />

        <section aria-labelledby="groups-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 id="groups-heading" className="section-title text-2xl">
              Groups
            </h2>
            <button type="button" className="btn-add" onClick={() => appendGroup(DEFAULT_GROUP_VALUE)}>
              <AiOutlinePlus aria-hidden="true" />
              Add group
            </button>
          </div>

          {groupFields.length === 0 && (
            <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-ink-soft">
              No groups yet. Add a group to start the estimate.
            </p>
          )}

          {groupFields.map((group, groupIndex) => (
            <fieldset
              key={group.id}
              className="relative flex flex-col gap-4 rounded-lg border border-line border-l-4 border-l-accent bg-white p-4 sm:p-5"
            >
              <legend className="pr-24 section-title float-left text-lg">Group {groupIndex + 1}</legend>
              <button
                type="button"
                aria-label={`Remove group ${groupIndex + 1}`}
                className="btn-remove absolute right-2 top-2 sm:right-3 sm:top-3"
                onClick={() => removeGroup(groupIndex)}
              >
                <AiOutlineClose aria-hidden="true" />
                Remove
              </button>
              <FormInput label="Group Name" name={`groups.${groupIndex}.name`} autoComplete="off" />
              <TaskFields groupIndex={groupIndex} />
            </fieldset>
          ))}
          <ErrorMessage
            errors={errors}
            name="groups.root"
            render={({ message }) => (
              <p role="alert" className="text-sm text-danger">
                {message}
              </p>
            )}
          />
        </section>

        <div className="flex flex-col items-center gap-3 border-t border-line pt-5">
          {hasErrors && (
            <p role="alert" className="text-sm font-medium text-danger">
              Some fields need attention. Fix the highlighted entries and submit again.
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Checking…' : 'Submit'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
