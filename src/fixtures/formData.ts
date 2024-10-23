import { Task, Group, Material, TFormData } from '../types/index';

const exampleMaterials: Material[] = [
  { name: 'Steel', quantity: 10, rate: 50, total: 500 },
  { name: 'Wood', quantity: 5, rate: 20, total: 100 },
];

const exampleTasks: Task[] = [
  {
    name: 'Cut Steel',
    description: 'Cutting steel to size',
    quantity: 5,
    rate: 100,
    total: 500,
    materials: [exampleMaterials[0]],
  },
  {
    name: 'Assemble Wood',
    description: 'Assembling wooden parts',
    quantity: 3,
    rate: 60,
    total: 180,
    materials: [exampleMaterials[1]],
  },
];

const exampleGroups: Group[] = [
  {
    name: 'Group A',
    tasks: [exampleTasks[0]],
  },
  {
    name: 'Group B',
    tasks: [exampleTasks[1]],
  },
];

const exampleFormData: TFormData = {
  client: 'Example Client',
  groups: exampleGroups,
};

export default exampleFormData;
