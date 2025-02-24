import React from 'react';
import { screen, render } from '@testing-library/react';
import VitalsBiometricsInput from './vitals-biometrics-input.component';
import userEvent from '@testing-library/user-event';

const mockOnChange = jest.fn();
describe('<VitalsBiometricsInput/>', () => {
  const mockProps = {
    title: 'Heart Rate',
    textFields: [
      {
        name: 'heartRate',
        type: 'number',
        value: 120,
      },
    ],
    unitSymbol: 'bpm',
  };

  it('should display the correct text input with correct value', async () => {
    render(
      <VitalsBiometricsInput
        title={mockProps.title}
        onInputChange={mockOnChange}
        textFields={mockProps.textFields}
        unitSymbol={mockProps.unitSymbol}
      />,
    );
    expect(screen.getByText(/Heart Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/bpm/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    const inputTextBox = await screen.findByRole('spinbutton');
    userEvent.type(inputTextBox, '75');
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it('should display the correct text area with correct value', async () => {
    render(
      <VitalsBiometricsInput
        title="Notes"
        onInputChange={mockOnChange}
        textFields={[
          {
            name: 'Notes',
            type: 'textArea',
            value: '',
          },
        ]}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should disable input when disable prop is true', async () => {
    render(
      <VitalsBiometricsInput
        title={mockProps.title}
        onInputChange={mockOnChange}
        textFields={mockProps.textFields}
        unitSymbol={mockProps.unitSymbol}
        disabled={true}
        isValidRange={true}
      />,
    );
    expect(screen.getByText(/Heart Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/bpm/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    const inputTextBox = await screen.findByRole('spinbutton');
    userEvent.type(inputTextBox, '7');
    expect(inputTextBox).toHaveProperty('disabled');
    expect(inputTextBox).toHaveClass('danger');
    expect(mockOnChange).toHaveBeenCalled();
  });
});
