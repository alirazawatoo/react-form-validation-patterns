export type Task = {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
  materials: Material[];
};

export type Material = {
  name: string;
  quantity: number;
  rate: number;
  total: number;
};

export type Group = {
  name: string;
  tasks: Task[];
};

export type TFormData = {
  client: string;
  groups: Group[];
};
