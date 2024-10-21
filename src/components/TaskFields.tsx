import { TFormData } from '../types';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { FormInput } from './Input';
import { lineTotal } from '../lib/totals';
import { MaterialFields } from './MaterialFields';
import { AiFillPlusCircle, AiFillCloseCircle } from 'react-icons/ai';
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold">Tasks</h4>
        <button type="button" aria-label="Add Task" onClick={() => appendTask(DEFAULT_TASK_VALUE)}>
          <AiFillPlusCircle className="text-green-700 w-6 h-6" />
        </button>
      </div>
      {taskFields.map((task, taskIndex) => (
        <div key={task.id} className="flex flex-col gap-5 p-5 rounded-xl border border-gray-300">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold">Task {taskIndex + 1}</h5>
            <button type="button" aria-label={`Remove task ${taskIndex + 1}`} onClick={() => removeTask(taskIndex)}>
              <AiFillCloseCircle className="text-red-600 w-6 h-6" />
            </button>
          </div>
          <FormInput label="Task Name" name={`groups.${groupIndex}.tasks.${taskIndex}.name`} />
          <FormInput label="Description" name={`groups.${groupIndex}.tasks.${taskIndex}.description`} />
          <FormInput
            label="Quantity"
            name={`groups.${groupIndex}.tasks.${taskIndex}.quantity`}
            type="number"
            step="any"
          />
          <FormInput label="Rate" name={`groups.${groupIndex}.tasks.${taskIndex}.rate`} type="number" step="any" />
          <FormInput
            label="Total"
            name={`groups.${groupIndex}.tasks.${taskIndex}.total`}
            type="number"
            step="any"
            readOnly
          />
          <MaterialFields groupIndex={groupIndex} taskIndex={taskIndex} />
        </div>
      ))}
      <ErrorMessage
        errors={errors}
        name={`groups.${groupIndex}.tasks.root`}
        render={({ message }) => <p className="text-red-600">{message}</p>}
      />
    </div>
  );
};
