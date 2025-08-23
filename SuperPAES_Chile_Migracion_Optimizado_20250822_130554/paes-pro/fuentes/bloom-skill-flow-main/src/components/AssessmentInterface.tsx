
import React, { useState, useEffect } from 'react';
import type { WidgetProgress } from '../types/bloom';

interface AssessmentInterfaceProps {
  techDomain: string;
  onStart: () => void;
  onProgress: (progress: Partial<WidgetProgress>) => void;
  maxQuestions: number;
  timeLimit: number;
  customBranding: boolean;
}

const AssessmentInterface: React.FC<AssessmentInterfaceProps> = ({
  techDomain,
  onStart,
  onProgress,
  maxQuestions,
  timeLimit,
  customBranding
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    experience: ''
  });

  const handleStart = () => {
    setIsStarted(true);
    onStart();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const getDomainDisplayName = (domain: string): string => {
    const displayNames: Record<string, string> = {
      javascript: 'JavaScript',
      react: 'React',
      python: 'Python',
      nodejs: 'Node.js',
      typescript: 'TypeScript'
    };
    return displayNames[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
  };

  const getEstimatedQuestions = (maxQuestions: number): string => {
    if (maxQuestions <= 3) return '3-4';
    if (maxQuestions <= 5) return '4-5';
    if (maxQuestions <= 7) return '5-7';
    return `5-${maxQuestions}`;
  };

  return (
    <div className="skillnest-widget">
      {/* Header */}
      <div className="skillnest-widget-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          {getDomainDisplayName(techDomain)} Bloom Assessment
        </h2>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
          Discover your cognitive skill level in {formatTime(timeLimit)} or less
        </p>
        {!customBranding && (
          <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
            Powered by Skillnest AI
          </p>
        )}
      </div>

      {/* Content */}
      <div className="skillnest-widget-content">
        {!isStarted ? (
          <div>
            {/* Assessment Overview */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: '#374151' }}>
                What You'll Get:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#6b7280' }}>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    background: '#3b82f6', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    marginRight: '0.75rem' 
                  }}>
                    ✓
                  </span>
                  Your Bloom cognitive level (L1-L5) for {getDomainDisplayName(techDomain)}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#6b7280' }}>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    background: '#3b82f6', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    marginRight: '0.75rem' 
                  }}>
                    ✓
                  </span>
                  Personalized learning path recommendations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#6b7280' }}>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    background: '#3b82f6', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    marginRight: '0.75rem' 
                  }}>
                    ✓
                  </span>
                  Skill gap analysis and improvement suggestions
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#6b7280' }}>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    background: '#3b82f6', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    marginRight: '0.75rem' 
                  }}>
                    ✓
                  </span>
                  Next steps for advancing to higher cognitive levels
                </li>
              </ul>
            </div>

            {/* Assessment Details */}
            <div style={{ 
              background: '#f9fafb', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Assessment Details:
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
                <p style={{ margin: '0 0 0.25rem 0' }}>
                  • <strong>Questions:</strong> {getEstimatedQuestions(maxQuestions)} adaptive questions
                </p>
                <p style={{ margin: '0 0 0.25rem 0' }}>
                  • <strong>Time:</strong> ~{formatTime(timeLimit)} (average completion: 8-12 minutes)
                </p>
                <p style={{ margin: '0 0 0.25rem 0' }}>
                  • <strong>AI-Powered:</strong> Semantic analysis of your responses
                </p>
                <p style={{ margin: '0' }}>
                  • <strong>Privacy:</strong> Your data is used only for assessment results
                </p>
              </div>
            </div>

            {/* Optional User Info Form */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.75rem', color: '#374151' }}>
                Optional: Tell us about yourself (for better recommendations)
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  className="skillnest-input"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  style={{ fontSize: '0.9rem' }}
                />
                <input
                  type="email"
                  placeholder="Email for results (optional)"
                  className="skillnest-input"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  style={{ fontSize: '0.9rem' }}
                />
                <select
                  className="skillnest-input"
                  value={userInfo.experience}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, experience: e.target.value }))}
                  style={{ fontSize: '0.9rem' }}
                >
                  <option value="">Experience level (optional)</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>
            </div>

            {/* Start Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                className="skillnest-btn skillnest-btn-primary"
                onClick={handleStart}
                style={{
                  fontSize: '1rem',
                  padding: '0.75rem 2rem',
                  fontWeight: '600',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                Start Assessment
              </button>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#9ca3af', 
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                No registration required • Takes 8-15 minutes
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '1.5rem' }}>🧠</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Assessment Starting...
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Our AI is preparing personalized questions based on your {getDomainDisplayName(techDomain)} assessment.
              </p>
            </div>

            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <p style={{ fontSize: '0.8rem', color: '#0369a1', margin: 0 }}>
                💡 <strong>Tip:</strong> Be thorough in your explanations. Our AI analyzes the depth and sophistication of your reasoning to determine your Bloom level.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentInterface;
