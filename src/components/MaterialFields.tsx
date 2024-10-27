import React, { useEffect } from 'react';
import { useFormContext, useFieldArray, useFormState, useWatch } from 'react-hook-form';
import { FormInput } from './Input';
import { AiFillPlusCircle, AiFillCloseCircle } from 'react-icons/ai';
import { ErrorMessage } from '@hookform/error-message';
import { DEFAULT_MATERIAL_VALUE } from '../constants';

interface Props {
  groupIndex: number;
  taskIndex: number;
}

export const MaterialFields: React.FC<Props> = ({ groupIndex, taskIndex }) => {
  const { control, setValue } = useFormContext();
  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({ control, name: `groups.${groupIndex}.tasks.${taskIndex}.materials` });
  const { errors } = useFormState({ control });

  const watchedMaterials = useWatch({
    control,
    name: `groups.${groupIndex}.tasks.${taskIndex}.materials`,
  });

  useEffect(() => {
    if (!watchedMaterials) return;

    watchedMaterials.forEach((material, materialIndex) => {
      const quantity = Number(material?.quantity ?? 0);
      const rate = Number(material?.rate ?? 0);
      const total = Number.isFinite(quantity) && Number.isFinite(rate) ? quantity * rate : 0;

      if (!Number.isNaN(total)) {
        setValue(`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.total`, total, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    });
  }, [groupIndex, setValue, taskIndex, watchedMaterials]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold">Materials</h4>
        <button type="button" aria-label="Add Material" onClick={() => appendMaterial(DEFAULT_MATERIAL_VALUE)}>
          <AiFillPlusCircle className="text-green-700 w-6 h-6" />
        </button>
      </div>
      {materialFields.map((material, materialIndex) => (
        <div key={material.id} className="flex flex-col gap-5 p-5 rounded-xl border border-gray-300">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold">Material {materialIndex + 1}</h5>
            <button type="button" onClick={() => removeMaterial(materialIndex)}>
              <AiFillCloseCircle className="text-red-600 w-6 h-6" />
            </button>
          </div>
          <FormInput
            label="Material Name"
            name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.name`}
          />
          <FormInput
            label="Quantity"
            name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.quantity`}
            type="number"
          />
          <FormInput
            label="Rate"
            name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.rate`}
            type="number"
          />
          <FormInput
            label="Total"
            name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.total`}
            type="number"
            readOnly
          />
        </div>
      ))}
      <ErrorMessage
        errors={errors}
        name={`groups.${groupIndex}.tasks.${taskIndex}.materials`}
        render={({ message }) => <p className="text-red-600">{message}</p>}
      />
    </div>
  );
};
