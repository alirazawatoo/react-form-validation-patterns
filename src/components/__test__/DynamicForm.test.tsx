/* eslint-disable no-redeclare */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import { DynamicForm } from '../DynamicForm';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

const renderComponent = (): void => {
  render(
    <Router navigator={history} location="/">
      <DynamicForm />
    </Router>
  );
};

describe('DynamicForm Component', () => {
  it('should render Form correctly', () => {
    renderComponent();
    expect(screen.getByText('Form')).toBeInTheDocument();
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('should render Groups correctly', () => {
    renderComponent();
    const inputField = screen.getByLabelText('Group Name');

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(inputField).toBeInTheDocument();

    fireEvent.change(inputField, { target: { value: 'New Group Name' } });

    expect(inputField).toHaveValue('New Group Name');
  });

  it('should render Tasks correctly', () => {
    renderComponent();

    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();

    const inputField = screen.getByLabelText('Task Name');
    const inputFieldDescription = screen.getByLabelText('Description');
    const inputFieldQuantity = screen.getAllByLabelText('Quantity') as HTMLInputElement[];
    const fieldQuantity = inputFieldQuantity[0];

    const inputFieldRate = screen.getAllByLabelText('Rate') as HTMLInputElement[];
    const fieldRate = inputFieldRate[0];

    const inputFieldTotal = screen.getAllByLabelText('Total') as HTMLInputElement[];
    const fieldTotal = inputFieldTotal[0];

    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'New Task Name' } });
    expect(inputField).toHaveValue('New Task Name');

    expect(inputFieldDescription).toBeInTheDocument();
    fireEvent.change(inputFieldDescription, {
      target: { value: 'New Task Description' },
    });
    expect(inputFieldDescription).toHaveValue('New Task Description');

    expect(fieldQuantity).toBeInTheDocument();
    fireEvent.change(fieldQuantity, { target: { value: 5 } });
    expect(fieldQuantity).toHaveValue(5);

    expect(fieldRate).toBeInTheDocument();
    fireEvent.change(fieldRate, { target: { value: 10 } });
    expect(fieldRate).toHaveValue(10);

    expect(fieldTotal).toBeInTheDocument();
    expect(fieldTotal).toHaveValue(50);
  });

  it('should render Material correctly', () => {
    renderComponent();
    expect(screen.getByText('Materials')).toBeInTheDocument();
    expect(screen.getByText('Material 1')).toBeInTheDocument();
    const inputField = screen.getByLabelText('Material Name');
    const inputFieldQuantity = screen.getAllByLabelText('Quantity') as HTMLInputElement[];
    const fieldQuantity = inputFieldQuantity[1];

    const inputFieldRate = screen.getAllByLabelText('Rate') as HTMLInputElement[];
    const fieldRate = inputFieldRate[1];

    const inputFieldTotal = screen.getAllByLabelText('Total') as HTMLInputElement[];
    const fieldTotal = inputFieldTotal[1];

    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'New Material Name' } });
    expect(inputField).toHaveValue('New Material Name');

    expect(fieldQuantity).toBeInTheDocument();
    fireEvent.change(fieldQuantity, { target: { value: 5 } });
    expect(fieldQuantity).toHaveValue(5);

    expect(fieldRate).toBeInTheDocument();
    fireEvent.change(fieldRate, { target: { value: 10 } });
    expect(fieldRate).toHaveValue(10);

    expect(fieldTotal).toBeInTheDocument();
    expect(fieldTotal).toHaveValue(50);
  });

  it('recalculates task and material totals when quantity or rate changes', () => {
    renderComponent();

    const taskQuantity = screen.getAllByLabelText('Quantity')[0] as HTMLInputElement;
    const taskRate = screen.getAllByLabelText('Rate')[0] as HTMLInputElement;
    const taskTotal = screen.getAllByLabelText('Total')[0] as HTMLInputElement;

    fireEvent.change(taskQuantity, { target: { value: 2 } });
    fireEvent.change(taskRate, { target: { value: 7 } });

    expect(taskTotal).toHaveValue(14);

    const materialQuantity = screen.getAllByLabelText('Quantity')[1] as HTMLInputElement;
    const materialRate = screen.getAllByLabelText('Rate')[1] as HTMLInputElement;
    const materialTotal = screen.getAllByLabelText('Total')[1] as HTMLInputElement;

    fireEvent.change(materialQuantity, { target: { value: 3 } });
    fireEvent.change(materialRate, { target: { value: 5 } });

    expect(materialTotal).toHaveValue(15);
  });

  it('adds a new group when clicking the "+" button', () => {
    renderComponent();

    const addGroupButton = screen.getByRole('button', { name: 'Add Group' });
    fireEvent.click(addGroupButton);
    expect(screen.getByText('Group 2')).toBeInTheDocument();
  });

  it('adds a new task when clicking the "+" button', () => {
    renderComponent();

    const addGroupButton = screen.getByRole('button', { name: 'Add Task' });
    fireEvent.click(addGroupButton);
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('adds a new material when clicking the "+" button', () => {
    renderComponent();

    const addGroupButton = screen.getByRole('button', { name: 'Add Material' });
    fireEvent.click(addGroupButton);
    expect(screen.getByText('Material 2')).toBeInTheDocument();
  });

  it('shows the form validation', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    expect(await screen.findByText('Client name is required')).toBeInTheDocument();
    expect(screen.getByText('Group name is required')).toBeInTheDocument();
    expect(screen.getByText('Task name is required')).toBeInTheDocument();
    expect(screen.getByText('Task description is required')).toBeInTheDocument();

    expect(screen.getByText('Material name is required')).toBeInTheDocument();
    expect(screen.getByText('Material quantity must be at least 1')).toBeInTheDocument();
  });

  it('submits the form with correct values', async () => {
    renderComponent();

    const clientNameInput = screen.getByLabelText('Client Name');
    fireEvent.change(clientNameInput, { target: { value: 'Test Client' } });

    const groupNameInput = screen.getByLabelText('Group Name');
    fireEvent.change(groupNameInput, { target: { value: 'Group 1' } });

    const inputField = screen.getByLabelText('Task Name');
    fireEvent.change(inputField, { target: { value: 'Task Name' } });

    const inputFieldDescription = screen.getByLabelText('Description');
    fireEvent.change(inputFieldDescription, {
      target: { value: 'Description' },
    });

    const materialField = screen.getByLabelText('Material Name');
    fireEvent.change(materialField, { target: { value: 'Material Name' } });

    const inputFieldQuantity = screen.getAllByLabelText('Quantity') as HTMLInputElement[];
    fireEvent.change(inputFieldQuantity[0], { target: { value: 3 } });
    fireEvent.change(inputFieldQuantity[1], { target: { value: 4 } });

    const inputFieldRate = screen.getAllByLabelText('Rate') as HTMLInputElement[];
    fireEvent.change(inputFieldRate[0], { target: { value: 3 } });
    fireEvent.change(inputFieldRate[1], { target: { value: 4 } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/results');
    });
  });
});
