/* eslint-disable-next-line no-redeclare */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FormResult } from '../FormResult';
import exampleFormData from '../../fixtures/formData';
import { TFormData } from '../../types';

const renderComponentWithState = (state: TFormData) => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/form-result', state: { formData: state } }]}>
      <Routes>
        <Route path="/form-result" element={<FormResult />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('FormResult Component', () => {
  it('should render Form Results correctly', () => {
    renderComponentWithState(exampleFormData);
    expect(screen.getByText('Form Results')).toBeInTheDocument();
    expect(screen.getByText('Task Total')).toBeInTheDocument();
    expect(screen.getByText(680)).toBeInTheDocument();
    expect(screen.getByText('Material Total')).toBeInTheDocument();
    expect(screen.getByText('Net Total')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText(600)).toBeInTheDocument();

    expect(screen.getByText('Grand Total')).toBeInTheDocument();
  });

  it('should render the correct values', () => {
    renderComponentWithState(exampleFormData);
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('should render the Back button', () => {
    renderComponentWithState(exampleFormData);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
