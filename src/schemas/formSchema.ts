import * as yup from 'yup';
import { TFormData } from '../types';

export const schema: yup.ObjectSchema<TFormData> = yup.object().shape({
  client: yup.string().required('Client name is required'),
  groups: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Group name is required'),
        tasks: yup
          .array()
          .of(
            yup.object().shape({
              name: yup.string().required('Task name is required'),
              description: yup.string().required('Task description is required'),
              quantity: yup.number().required('Task quantity is required').min(1, 'Task quantity must be at least 1'),
              rate: yup.number().required('Task rate is required').min(0, 'Task rate cannot be negative'),
              total: yup.number().required('Task total is required').min(0, 'Task total cannot be negative'),
              materials: yup
                .array()
                .of(
                  yup.object().shape({
                    name: yup.string().required('Material name is required'),
                    quantity: yup
                      .number()
                      .required('Material quantity is required')
                      .min(1, 'Material quantity must be at least 1'),
                    rate: yup.number().required('Material rate is required').min(0, 'Material rate cannot be negative'),
                    total: yup
                      .number()
                      .required('Material total is required')
                      .min(0, 'Material total cannot be negative'),
                  })
                )
                .required()
                .min(1, 'At least one material is required'),
            })
          )
          .required()
          .min(1, 'At least one task is required'),
      })
    )
    .required()
    .min(1, 'At least one group is required'),
});
