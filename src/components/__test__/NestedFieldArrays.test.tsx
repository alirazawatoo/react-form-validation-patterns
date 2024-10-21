import { render, screen, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DynamicForm } from '../DynamicForm';
import { FormResult } from '../FormResult';

const renderApp = () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<DynamicForm />} />
        <Route path="/results" element={<FormResult />} />
      </Routes>
    </MemoryRouter>
  );
  return user;
};

const group = (n: number) => screen.getByRole('group', { name: `Group ${n}` });
const task = (scope: HTMLElement, n: number) => within(scope).getByRole('group', { name: `Task ${n}` });
const material = (scope: HTMLElement, n: number) => within(scope).getByRole('group', { name: `Material ${n}` });

const replace = async (user: UserEvent, input: HTMLElement, value: string) => {
  await user.clear(input);
  await user.type(input, value);
};

// Task-level inputs come first in DOM order, the task's materials after them.
const fillTask = async (user: UserEvent, scope: HTMLElement, name: string, quantity: string, rate: string) => {
  await replace(user, within(scope).getAllByLabelText('Task Name')[0], name);
  await replace(user, within(scope).getAllByLabelText('Description')[0], `${name} work`);
  await replace(user, within(scope).getAllByLabelText('Quantity')[0], quantity);
  await replace(user, within(scope).getAllByLabelText('Rate')[0], rate);
};

const fillMaterial = async (user: UserEvent, scope: HTMLElement, name: string, quantity: string, rate: string) => {
  await replace(user, within(scope).getByLabelText('Material Name'), name);
  await replace(user, within(scope).getByLabelText('Quantity'), quantity);
  await replace(user, within(scope).getByLabelText('Rate'), rate);
};

describe('nested field arrays', () => {
  it('gives each group its own task list', async () => {
    const user = renderApp();
    await user.click(screen.getByRole('button', { name: 'Add group' }));
    await user.click(within(group(2)).getByRole('button', { name: 'Add task' }));

    expect(within(group(2)).getAllByRole('group', { name: /^Task \d$/ })).toHaveLength(2);
    expect(within(group(1)).getAllByRole('group', { name: /^Task \d$/ })).toHaveLength(1);
  });

  it('keeps later rows and renumbers them when a middle task is removed', async () => {
    const user = renderApp();
    const addTask = within(group(1)).getByRole('button', { name: 'Add task' });
    await user.click(addTask);
    await user.click(addTask);
    await user.type(within(task(group(1), 1)).getAllByLabelText('Task Name')[0], 'Strip');
    await user.type(within(task(group(1), 2)).getAllByLabelText('Task Name')[0], 'Prime');
    await user.type(within(task(group(1), 3)).getAllByLabelText('Task Name')[0], 'Paint');

    await user.click(screen.getByRole('button', { name: 'Remove task 2' }));

    expect(
      within(group(1))
        .getAllByLabelText('Task Name')
        .map((input) => (input as HTMLInputElement).value)
    ).toEqual(['Strip', 'Paint']);
    expect(screen.queryByRole('group', { name: 'Task 3' })).not.toBeInTheDocument();
  });

  it('calculates each material total from its own row', async () => {
    const user = renderApp();
    await user.click(within(task(group(1), 1)).getByRole('button', { name: 'Add material' }));
    await fillMaterial(user, material(task(group(1), 1), 1), 'Tile', '4', '2.5');
    await fillMaterial(user, material(task(group(1), 1), 2), 'Grout', '2', '7');

    expect(within(material(task(group(1), 1), 1)).getByLabelText('Total')).toHaveValue(10);
    expect(within(material(task(group(1), 1), 2)).getByLabelText('Total')).toHaveValue(14);
  });

  it('shows an empty state once every group is removed and lets you start again', async () => {
    const user = renderApp();
    await user.click(screen.getByRole('button', { name: 'Remove group 1' }));

    expect(screen.getByText('No groups yet. Add a group to start the estimate.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add group' }));
    expect(within(group(1)).getByRole('group', { name: 'Material 1' })).toBeInTheDocument();
  });

  it('totals two groups on the summary and leaves out a removed group', async () => {
    const user = renderApp();
    await user.type(screen.getByLabelText('Client Name'), 'Demo client');
    await user.type(within(group(1)).getAllByLabelText('Group Name')[0], 'Kitchen');
    await fillTask(user, task(group(1), 1), 'Tile', '2', '50');
    await fillMaterial(user, material(task(group(1), 1), 1), 'Adhesive', '3', '10');

    for (const name of ['Bathroom', 'Hallway']) {
      await user.click(screen.getByRole('button', { name: 'Add group' }));
      const groups = screen.getAllByRole('group', { name: /^Group \d$/ });
      const added = groups[groups.length - 1];
      await user.type(within(added).getAllByLabelText('Group Name')[0], name);
      await fillTask(user, task(added, 1), `${name} task`, '1', '100');
      await fillMaterial(user, material(task(added, 1), 1), 'Paint', '1', '20');
    }
    await user.click(screen.getByRole('button', { name: 'Remove group 3' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('heading', { name: 'Form Results' })).toBeInTheDocument();
    const totals = Object.fromEntries(
      screen.getAllByRole('term').map((term) => [term.textContent, term.nextElementSibling?.textContent])
    );
    expect(totals).toEqual({
      'Task Total': '200',
      'Material Total': '50',
      'Net Total': '250',
      Discount: '20%',
      'Grand Total': '200',
    });
    expect(screen.getByText('Demo client · 2 groups · 2 tasks')).toBeInTheDocument();
  });
});

describe('validation messages', () => {
  it('shows a nested error on blur and clears it on the next blur once fixed', async () => {
    const user = renderApp();
    const name = within(material(task(group(1), 1), 1)).getByLabelText('Material Name');
    await user.click(name);
    await user.tab();

    expect(await screen.findByText('Material name is required')).toBeInTheDocument();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Material name is required');

    await user.type(name, 'Plasterboard');
    await user.tab();
    expect(screen.queryByText('Material name is required')).not.toBeInTheDocument();
    expect(name).toHaveAttribute('aria-invalid', 'false');
  });

  it('re-validates while typing after a failed submit', async () => {
    const user = renderApp();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Client name is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Client Name'), 'D');
    expect(screen.queryByText('Client name is required')).not.toBeInTheDocument();
  });

  it('reports range errors for quantities and rates', async () => {
    const user = renderApp();
    const taskRow = task(group(1), 1);
    await replace(user, within(taskRow).getAllByLabelText('Quantity')[0], '0.5');
    await replace(user, within(material(taskRow, 1)).getByLabelText('Rate'), '-3');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Task quantity must be at least 1')).toBeInTheDocument();
    expect(screen.getByText('Material rate cannot be negative')).toBeInTheDocument();
    expect(screen.getByText('Some fields need attention. Fix the highlighted entries and submit again.')).toBeVisible();
  });

  it('flags only the rows in the group that is incomplete', async () => {
    const user = renderApp();
    await user.type(screen.getByLabelText('Client Name'), 'Demo client');
    await user.type(within(group(1)).getAllByLabelText('Group Name')[0], 'Kitchen');
    await fillTask(user, task(group(1), 1), 'Tile', '1', '10');
    await fillMaterial(user, material(task(group(1), 1), 1), 'Tile', '1', '10');
    await user.click(screen.getByRole('button', { name: 'Add group' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await within(group(2)).findByText('Group name is required')).toBeInTheDocument();
    expect(within(group(1)).queryAllByRole('alert')).toHaveLength(0);
  });
});
