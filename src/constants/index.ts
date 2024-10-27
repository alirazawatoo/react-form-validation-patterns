import { TFormData, Group, Material, Task } from '../types';

export const DEFAULT_MATERIAL_VALUE: Material = {
  name: '',
  quantity: 0,
  rate: 0,
  total: 0,
};

export const DEFAULT_TASK_VALUE: Task = {
  name: '',
  description: '',
  quantity: 0,
  rate: 0,
  total: 0,
  materials: [DEFAULT_MATERIAL_VALUE],
};

export const DEFAULT_GROUP_VALUE: Group = {
  name: '',
  tasks: [DEFAULT_TASK_VALUE],
};

export const DEFAULT_FORM_VALUES: TFormData = {
  client: '',
  groups: [DEFAULT_GROUP_VALUE],
};
