import { TFormData } from '../types';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { FormInput } from './Input';
import { lineTotal } from '../lib/totals';
import { MaterialFields } from './MaterialFields';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { ErrorMessage } from '@hookform/error-message';
import { DEFAULT_TASK_VALUE } from '../constants';

interface Props {
  groupIndex: number;
}

export const TaskFields: React.FC<Props> = ({ groupIndex }) => {
  const { control, setValue } = useFormContext<TFormData>();
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}.tasks`,
  });
  const { errors } = useFormState({ control });

  const watchedTasks = useWatch({
    control,
    name: `groups.${groupIndex}.tasks`,
  });

  useEffect(() => {
    if (!watchedTasks) return;

    watchedTasks.forEach((task, taskIndex) => {
      const total = lineTotal(task?.quantity, task?.rate);

      if (Number.isFinite(total) && Number(task?.total) !== total) {
        setValue(`groups.${groupIndex}.tasks.${taskIndex}.total`, total, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    });
  }, [groupIndex, setValue, watchedTasks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="section-title text-base">Tasks</h3>
        <button type="button" className="btn-add" onClick={() => appendTask(DEFAULT_TASK_VALUE)}>
          <AiOutlinePlus aria-hidden="true" />
          Add task
        </button>
      </div>
      {taskFields.length === 0 && <p className="text-sm text-ink-soft">No tasks in this group yet.</p>}
      {taskFields.map((task, taskIndex) => (
        <fieldset key={task.id} className="relative flex flex-col gap-4 rounded-md border border-line bg-paper/40 p-4">
          <legend className="pr-24 section-title float-left text-base">Task {taskIndex + 1}</legend>
          <button
            type="button"
            aria-label={`Remove task ${taskIndex + 1}`}
            className="btn-remove absolute right-2 top-2 sm:right-3 sm:top-3"
            onClick={() => removeTask(taskIndex)}
          >
            <AiOutlineClose aria-hidden="true" />
            Remove
          </button>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Task Name" name={`groups.${groupIndex}.tasks.${taskIndex}.name`} autoComplete="off" />
            <FormInput
              label="Description"
              name={`groups.${groupIndex}.tasks.${taskIndex}.description`}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput
              label="Quantity"
              name={`groups.${groupIndex}.tasks.${taskIndex}.quantity`}
              type="number"
              step="any"
              inputMode="decimal"
            />
            <FormInput
              label="Rate"
              name={`groups.${groupIndex}.tasks.${taskIndex}.rate`}
              type="number"
              step="any"
              inputMode="decimal"
            />
            <FormInput
              label="Total"
              name={`groups.${groupIndex}.tasks.${taskIndex}.total`}
              type="number"
              step="any"
              readOnly
            />
          </div>
          <MaterialFields groupIndex={groupIndex} taskIndex={taskIndex} />
        </fieldset>
      ))}
      <ErrorMessage
        errors={errors}
        name={`groups.${groupIndex}.tasks.root`}
        render={({ message }) => (
          <p role="alert" className="text-sm text-danger">
            {message}
          </p>
        )}
      />
    </div>
  );
};
