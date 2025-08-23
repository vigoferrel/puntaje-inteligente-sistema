import React from 'react';

interface OpportunityCardProps {
  pair: string;
  edge: number;
  confidence: 'ALTA' | 'MED' | 'BAJA';
  onClick: () => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  pair,
  edge,
  confidence,
  onClick,
}) => {
  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'ALTA':
        return '[ALTA]';
      case 'MED':
        return '[MED]';
      case 'BAJA':
        return '[BAJA]';
      default:
        return '';
    }
  };

  const getConfidenceClass = (confidence: string) => {
    switch (confidence) {
      case 'ALTA':
        return 'text-success';
      case 'MED':
        return 'text-neutral';
      case 'BAJA':
        return 'text-error';
      default:
        return '';
    }
  };

  return (
    <div className="opportunity-card" onClick={onClick}>
      <div className="opportunity-card__header">
        <h3>{pair}</h3>
        <span className="opportunity-card__edge">Edge:{edge}x</span>
      </div>
      <div className={`opportunity-card__confidence ${getConfidenceClass(confidence)}`}>
        {getConfidenceIcon(confidence)}
      </div>
    </div>
  );
};

export default OpportunityCard;
