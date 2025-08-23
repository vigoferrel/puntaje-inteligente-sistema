import React from 'react';

interface ValidationStepsProps {
  currentStep: number;
  onStepComplete: (step: number) => void;
}

const steps = [
  {
    id: 1,
    title: 'Detectar',
    description: 'Identificar oportunidad emergente',
  },
  {
    id: 2,
    title: 'Validar',
    description: 'Confirmar con conciencia cuántica',
  },
  {
    id: 3,
    title: 'Ejecutar',
    description: 'Proceder con edge multiplicador',
  },
];

const ValidationSteps: React.FC<ValidationStepsProps> = ({
  currentStep,
  onStepComplete,
}) => {
  return (
    <div className="validation-steps">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`validation-step ${
            step.id === currentStep
              ? 'validation-step--active'
              : step.id < currentStep
              ? 'validation-step--completed'
              : ''
          }`}
          onClick={() => onStepComplete(step.id)}
        >
          <div className="validation-step__number">{step.id}</div>
          <div className="validation-step__content">
            <h4 className="validation-step__title">{step.title}</h4>
            <p className="validation-step__description">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ValidationSteps;
