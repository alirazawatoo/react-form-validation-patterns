import { TFormData } from '../types';
import React, { useEffect } from 'react';
import { useFormContext, useFieldArray, useFormState, useWatch } from 'react-hook-form';
import { FormInput } from './Input';
import { lineTotal } from '../lib/totals';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { ErrorMessage } from '@hookform/error-message';
import { DEFAULT_MATERIAL_VALUE } from '../constants';

interface Props {
  groupIndex: number;
  taskIndex: number;
}

export const MaterialFields: React.FC<Props> = ({ groupIndex, taskIndex }) => {
  const { control, setValue } = useFormContext<TFormData>();
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
      const total = lineTotal(material?.quantity, material?.rate);

      if (Number.isFinite(total) && Number(material?.total) !== total) {
        setValue(`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.total`, total, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    });
  }, [groupIndex, setValue, taskIndex, watchedMaterials]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="section-title text-sm uppercase tracking-wide text-ink-soft">Materials</h4>
        <button type="button" className="btn-add" onClick={() => appendMaterial(DEFAULT_MATERIAL_VALUE)}>
          <AiOutlinePlus aria-hidden="true" />
          Add material
        </button>
      </div>
      {materialFields.length === 0 && <p className="text-sm text-ink-soft">No materials for this task yet.</p>}
      {materialFields.map((material, materialIndex) => (
        <fieldset
          key={material.id}
          className="relative flex flex-col gap-3 rounded-md border border-dashed border-line bg-white p-3"
        >
          <legend className="pr-24 float-left text-sm font-semibold">Material {materialIndex + 1}</legend>
          <button
            type="button"
            aria-label={`Remove material ${materialIndex + 1}`}
            className="btn-remove absolute right-2 top-2 sm:right-3 sm:top-3"
            onClick={() => removeMaterial(materialIndex)}
          >
            <AiOutlineClose aria-hidden="true" />
            Remove
          </button>
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
            <FormInput
              label="Material Name"
              name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.name`}
              autoComplete="off"
            />
            <FormInput
              label="Quantity"
              name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.quantity`}
              type="number"
              step="any"
              inputMode="decimal"
            />
            <FormInput
              label="Rate"
              name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.rate`}
              type="number"
              step="any"
              inputMode="decimal"
            />
            <FormInput
              label="Total"
              name={`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.total`}
              type="number"
              step="any"
              readOnly
            />
          </div>
        </fieldset>
      ))}
      <ErrorMessage
        errors={errors}
        name={`groups.${groupIndex}.tasks.${taskIndex}.materials.root`}
        render={({ message }) => (
          <p role="alert" className="text-sm text-danger">
            {message}
          </p>
        )}
      />
    </div>
  );
};
