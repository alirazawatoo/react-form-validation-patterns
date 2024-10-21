/* eslint-disable no-redeclare */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { DynamicForm } from '../DynamicForm';

const renderForm = () =>
  render(
    <MemoryRouter>
      <DynamicForm />
    </MemoryRouter>
  );

const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

describe('array-level validation messages', () => {
  it('asks for a group after the last group is removed', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Remove group 1' }));
    submit();
    expect(await screen.findByText('At least one group is required')).toBeInTheDocument();
  });

  it('asks for a task after the last task is removed', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Remove task 1' }));
    submit();
    expect(await screen.findByText('At least one task is required')).toBeInTheDocument();
  });

  it('asks for a material after the last material is removed', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Remove material 1' }));
    submit();
    expect(await screen.findByText('At least one material is required')).toBeInTheDocument();
  });
});

describe('number field messages', () => {
  it('explains a cleared task quantity in plain words', async () => {
    renderForm();
    fireEvent.change(screen.getAllByLabelText('Quantity')[0], { target: { value: '' } });
    submit();
    expect(await screen.findByText('Task quantity must be a number')).toBeInTheDocument();
  });

  it('explains a cleared material rate in plain words', async () => {
    renderForm();
    fireEvent.change(screen.getAllByLabelText('Rate')[1], { target: { value: '' } });
    submit();
    expect(await screen.findByText('Material rate must be a number')).toBeInTheDocument();
  });
});
