import React, { useCallback } from 'react';
import { useForm, useFieldArray, SubmitHandler, FormProvider, useFormState } from 'react-hook-form';
import { FormInput } from './Input';
import { TFormData } from '../types';
import { TaskFields } from './TaskFields';
import { schema } from '../schemas/formSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiFillPlusCircle, AiFillCloseCircle } from 'react-icons/ai';
import { ErrorMessage } from '@hookform/error-message';
import { DEFAULT_FORM_VALUES, DEFAULT_GROUP_VALUE } from '../constants';
import { useNavigate } from 'react-router-dom';

export const DynamicForm: React.FC = () => {
  const methods = useForm<TFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const navigate = useNavigate();
  const { control, handleSubmit } = methods;
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({ control, name: 'groups' });
  const { errors } = useFormState({ control });

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
        className="bg-white flex flex-col gap-5 p-5 min-h-screen w-full md:w-1/2 md:rounded-2xl md:shadow-md"
      >
        <h1 className="text-3xl font-semibold self-center">Form</h1>
        <FormInput label="Client Name" name="client" />
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Groups</h2>
          <button type="button" aria-label="Add Group" onClick={() => appendGroup(DEFAULT_GROUP_VALUE)}>
            <AiFillPlusCircle className="text-green-700 w-6 h-6" />
          </button>
        </div>
        {groupFields.map((group, groupIndex) => (
          <div key={group.id} className="flex flex-col gap-5 p-5 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Group {groupIndex + 1}</h3>
              <button type="button" onClick={() => removeGroup(groupIndex)}>
                <AiFillCloseCircle className="text-red-600 w-6 h-6" />
              </button>
            </div>
            <FormInput label="Group Name" name={`groups.${groupIndex}.name`} />
            <TaskFields groupIndex={groupIndex} />
          </div>
        ))}
        <ErrorMessage
          errors={errors}
          name="groups.root"
          render={({ message }) => <p className="text-red-600">{message}</p>}
        />
        <button
          type="submit"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 w-fit self-center"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};
