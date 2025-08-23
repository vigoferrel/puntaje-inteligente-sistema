
import React, { useState } from 'react';
import type { WidgetResults } from '../types/bloom';

interface ResultsDashboardProps {
  results: WidgetResults;
  onRestart: () => void;
  theme: string;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  results, 
  onRestart, 
  theme 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'path' | 'skills'>('overview');

  const getBloomLevelName = (level: number): string => {
    const levels = {
      1: 'Remember',
      2: 'Understand',
      3: 'Apply',
      4: 'Analyze',
      5: 'Evaluate'
    };
    return levels[level as keyof typeof levels] || 'Unknown';
  };

  const getBloomLevelDescription = (level: number): string => {
    const descriptions = {
      1: 'You can recall basic facts, terms, and concepts',
      2: 'You can explain ideas and understand relationships',
      3: 'You can apply knowledge to solve problems',
      4: 'You can analyze information and break down problems',
      5: 'You can evaluate and make judgments about approaches'
    };
    return descriptions[level as keyof typeof descriptions] || '';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#10b981'; // green
    if (confidence >= 0.6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getConfidenceText = (confidence: number): string => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence - Consider Retaking';
  };

  const formatPercentage = (value: number): string => {
    return Math.round(value * 100) + '%';
  };

  const renderOverview = () => (
    <div>
      {/* Bloom Level Result */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          L{results.bloomLevel}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
          {getBloomLevelName(results.bloomLevel)} Level
        </h3>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
          {getBloomLevelDescription(results.bloomLevel)}
        </p>
      </div>

      {/* Confidence Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f9fafb',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151', margin: '0 0 0.25rem 0' }}>
            Assessment Confidence
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
            {getConfidenceText(results.confidence)}
          </p>
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: getConfidenceColor(results.confidence)
        }}>
          {formatPercentage(results.confidence)}
        </div>
      </div>

      {/* Top Recommendations */}
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
          Top Recommendations
        </h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {results.recommendations.slice(0, 3).map((recommendation, index) => (
            <div key={index} style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '0.85rem',
              color: '#92400e'
            }}>
              💡 {recommendation}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLearningPath = () => (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
        Your Personalized Learning Path
      </h3>

      {/* Current to Target Level */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#3b82f6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 auto 0.5rem auto'
          }}>
            L{results.learningPath.currentBloomLevel}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Current</p>
        </div>
        
        <div style={{
          flex: 1,
          height: '2px',
          background: 'linear-gradient(to right, #3b82f6, #10b981)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '1.5rem'
          }}>
            →
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 auto 0.5rem auto'
          }}>
            L{results.learningPath.targetBloomLevel}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Target</p>
        </div>
      </div>

      {/* Learning Modules */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
          Recommended Learning Modules
        </h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {results.learningPath.learningModules.map((module, index) => (
            <div key={module.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151', margin: 0 }}>
                  {index + 1}. {module.title}
                </h5>
                <span style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '500'
                }}>
                  L{module.bloomLevel}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                Estimated time: {module.estimatedHours} hours
              </p>
              {module.skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {module.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '3px',
                      fontSize: '0.7rem'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1.5rem'
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0369a1', marginBottom: '0.5rem' }}>
          Estimated Timeline
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#0369a1', margin: 0 }}>
          📅 Complete this learning path in approximately <strong>{results.learningPath.estimatedDuration} hours</strong> of focused study (2-3 weeks at 10-15 hours/week)
        </p>
      </div>
    </div>
  );

  const renderSkillsAnalysis = () => (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
        Skills Analysis
      </h3>

      {/* Strong Skills */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#059669', marginBottom: '0.75rem' }}>
          ✅ Strong Areas
        </h4>
        {results.skillBreakdown.strong.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {results.skillBreakdown.strong.map((skill, index) => (
              <span key={index} style={{
                background: '#d1fae5',
                color: '#065f46',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                border: '1px solid #a7f3d0'
              }}>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>
            Complete more assessments to identify strong areas
          </p>
        )}
      </div>

      {/* Areas for Improvement */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#dc2626', marginBottom: '0.75rem' }}>
          🎯 Areas for Improvement
        </h4>
        {results.skillBreakdown.weak.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {results.skillBreakdown.weak.map((skill, index) => (
              <span key={index} style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                border: '1px solid #fca5a5'
              }}>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>
            No specific weak areas identified - continue building on your strengths
          </p>
        )}
      </div>

      {/* Assessment Details */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
          Assessment Details
        </h4>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.5' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Bloom Level:</strong> {results.bloomLevel} - {getBloomLevelName(results.bloomLevel)}
          </p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Confidence:</strong> {formatPercentage(results.confidence)}
          </p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Key Indicators:</strong> {results.assessmentData.keyIndicators.join(', ') || 'Analysis completed'}
          </p>
          <p style={{ margin: '0' }}>
            <strong>AI Analysis:</strong> {results.assessmentData.reasoning}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="skillnest-widget">
      {/* Header */}
      <div className="skillnest-widget-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Your Bloom Assessment Results
        </h2>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
          Cognitive skill level analysis complete
        </p>
      </div>

      {/* Content */}
      <div className="skillnest-widget-content">
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'path', label: 'Learning Path' },
            { id: 'skills', label: 'Skills Analysis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ marginBottom: '1.5rem' }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'path' && renderLearningPath()}
          {activeTab === 'skills' && renderSkillsAnalysis()}
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid #e5e7eb' 
        }}>
          <button
            className="skillnest-btn skillnest-btn-secondary"
            onClick={onRestart}
            style={{ flex: 1 }}
          >
            Take Another Assessment
          </button>
          <button
            className="skillnest-btn skillnest-btn-primary"
            onClick={() => {
              // In a real implementation, this would navigate to Skillnest platform
              window.open('https://skillnest.com/signup', '_blank');
            }}
            style={{ flex: 1 }}
          >
            Get Full Learning Plan
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            Want more detailed analysis and guided learning?{' '}
            <a 
              href="https://skillnest.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none' }}
            >
              Visit Skillnest.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
