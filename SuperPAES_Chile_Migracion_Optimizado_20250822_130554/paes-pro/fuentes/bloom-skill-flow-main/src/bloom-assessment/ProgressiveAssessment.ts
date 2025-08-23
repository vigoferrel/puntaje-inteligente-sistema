import { BloomLevelDetector } from './BloomLevelDetector';
import type { AssessmentSession, TechQuestion, TechDomain, BloomAssessmentResult, AdaptiveAssessmentResult } from '../types/bloom';
import { quantumRandomSync } from '../../../../lib/utils/quantumRandom';

interface QuestionSelectionStrategy {
  maxQuestions: number;
  confidenceThreshold: number;
  adaptiveStrategy: 'conservative' | 'aggressive' | 'balanced';
}

export class ProgressiveAssessment {
  private bloomDetector: BloomLevelDetector;
  private questionBank: Map<string, TechQuestion[]> = new Map();
  private strategy: QuestionSelectionStrategy;

  constructor(bloomDetector: BloomLevelDetector, strategy?: Partial<QuestionSelectionStrategy>) {
    this.bloomDetector = bloomDetector;
    this.strategy = {
      maxQuestions: 5,
      confidenceThreshold: 0.8,
      adaptiveStrategy: 'balanced',
      ...strategy
    };
    
    this.initializeQuestionBank();
  }

  async conductAdaptiveAssessment(
    userId: string,
    techDomain: TechDomain
  ): Promise<AdaptiveAssessmentResult> {
    
    const session: AssessmentSession = {
      userId,
      techDomain: techDomain.id,
      startTime: new Date(),
      questions: [],
      responses: [],
      currentEstimatedLevel: 2, // Start at L2 (Understanding)
      confidence: 0.5
    };

    console.log(`Starting adaptive assessment for ${userId} in ${techDomain.name}`);

    // Progressive questioning strategy
    let questionCount = 0;
    while (questionCount < this.strategy.maxQuestions && session.confidence < this.strategy.confidenceThreshold) {
      try {
        const nextQuestion = await this.selectOptimalQuestion(session, techDomain);
        
        if (!nextQuestion) {
          console.warn('No suitable question found, terminating assessment');
          break;
        }

        // In a real implementation, this would present the question to the user
        // For now, we'll simulate getting a response
        const userResponse = await this.simulateUserResponse(nextQuestion);
        
        const bloomAssessment = await this.bloomDetector.analyzeResponseBloomLevel(
          nextQuestion,
          userResponse,
          techDomain
        );

        // Update session with new information
        session.questions.push(nextQuestion);
        session.responses.push({
          question: nextQuestion,
          response: userResponse,
          bloomAssessment,
          timeSpent: Math.floor(quantumRandomSync() * 120) + 30 // 30-150 seconds using quantum random
        });

        // Bayesian update of estimated level
        session.currentEstimatedLevel = this.updateEstimatedLevel(
          session.currentEstimatedLevel,
          bloomAssessment,
          session.confidence
        );

        session.confidence = this.calculateConfidence(session);

        console.log(`Question ${questionCount + 1}: Level ${bloomAssessment.dominantLevel}, Confidence: ${session.confidence.toFixed(2)}`);

        questionCount++;

        // Early termination if high confidence
        if (session.confidence > 0.85) {
          console.log('High confidence achieved, terminating early');
          break;
        }

      } catch (error) {
        console.error('Error in assessment iteration:', error);
        break;
      }
    }

    return this.generateFinalAssessment(session);
  }

  private async selectOptimalQuestion(
    session: AssessmentSession,
    domain: TechDomain
  ): Promise<TechQuestion | null> {
    const availableQuestions = this.questionBank.get(domain.id) || [];
    
    if (availableQuestions.length === 0) {
      console.warn(`No questions available for domain: ${domain.id}`);
      return null;
    }

    // Question selection strategy based on:
    // 1. Current estimated level ± 1 level
    // 2. Unexplored skill areas
    // 3. Maximum information gain

    const usedQuestionIds = new Set(session.questions.map(q => q.id));
    const candidateQuestions = availableQuestions.filter(q => !usedQuestionIds.has(q.id));

    if (candidateQuestions.length === 0) {
      console.warn('All questions have been used');
      return null;
    }

    const targetLevels = this.getTargetLevels(session);
    const suitableQuestions = candidateQuestions.filter(q => 
      targetLevels.includes(q.targetBloomLevel)
    );

    if (suitableQuestions.length === 0) {
      // Fallback to any available question using quantum random
      const randomIndex = Math.floor(quantumRandomSync() * candidateQuestions.length);
      return candidateQuestions[randomIndex];
    }

    // Select question with highest information gain potential
    return this.selectHighestInformationGainQuestion(suitableQuestions, session);
  }

  private getTargetLevels(session: AssessmentSession): number[] {
    const currentLevel = Math.round(session.currentEstimatedLevel);
    const strategy = this.strategy.adaptiveStrategy;

    switch (strategy) {
      case 'conservative':
        return [Math.max(1, currentLevel - 1), currentLevel];
      case 'aggressive':
        return [currentLevel, Math.min(5, currentLevel + 1)];
      case 'balanced':
      default:
        return [
          Math.max(1, currentLevel - 1),
          currentLevel,
          Math.min(5, currentLevel + 1)
        ];
    }
  }

  private selectHighestInformationGainQuestion(
    questions: TechQuestion[],
    session: AssessmentSession
  ): TechQuestion {
    // For now, use a simple scoring system
    // In a more sophisticated system, this would calculate expected information gain
    
    const scoredQuestions = questions.map(question => {
      let score = 0;
      
      // Prefer questions at current estimated level
      const levelDiff = Math.abs(question.targetBloomLevel - session.currentEstimatedLevel);
      score += (5 - levelDiff) * 10;
      
      // Prefer different question types for variety
      const usedTypes = session.questions.map(q => q.type);
      if (!usedTypes.includes(question.type)) {
        score += 5;
      }
      
      // Prefer scenario questions for higher levels
      if (question.type === 'scenario' && session.currentEstimatedLevel >= 3) {
        score += 3;
      }
      
      return { question, score };
    });

    // Sort by score and return the highest
    scoredQuestions.sort((a, b) => b.score - a.score);
    return scoredQuestions[0].question;
  }

  private updateEstimatedLevel(
    currentEstimate: number,
    newAssessment: any,
    currentConfidence: number
  ): number {
    // Weighted average based on confidence
    const newLevel = newAssessment.dominantLevel;
    const newConfidence = newAssessment.confidence;
    
    // Higher confidence assessments have more weight
    const totalWeight = currentConfidence + newConfidence;
    const weightedEstimate = (currentEstimate * currentConfidence + newLevel * newConfidence) / totalWeight;
    
    return Math.max(1, Math.min(5, weightedEstimate));
  }

  private calculateConfidence(session: AssessmentSession): number {
    if (session.responses.length === 0) return 0.5;
    
    // Calculate confidence based on:
    // 1. Consistency of bloom levels detected
    // 2. Individual assessment confidences
    // 3. Number of questions answered
    
    const bloomLevels = session.responses.map(r => r.bloomAssessment.dominantLevel);
    const confidences = session.responses.map(r => r.bloomAssessment.confidence);
    
    // Consistency factor (lower variance = higher confidence)
    const mean = bloomLevels.reduce((a, b) => a + b, 0) / bloomLevels.length;
    const variance = bloomLevels.reduce((acc, level) => acc + Math.pow(level - mean, 2), 0) / bloomLevels.length;
    const consistencyFactor = Math.max(0, 1 - variance / 4); // Normalize variance
    
    // Average individual confidence
    const avgIndividualConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    
    // Sample size factor (more questions = higher confidence, up to a point)
    const sampleSizeFactor = Math.min(1, session.responses.length / 3);
    
    // Combined confidence
    const combinedConfidence = (consistencyFactor * 0.4 + avgIndividualConfidence * 0.4 + sampleSizeFactor * 0.2);
    
    return Math.round(combinedConfidence * 100) / 100;
  }

  private generateFinalAssessment(session: AssessmentSession): AdaptiveAssessmentResult {
    const finalBloomLevel = Math.round(session.currentEstimatedLevel);
    const overallConfidence = session.confidence;
    
    // Determine assessment quality
    let assessmentQuality: 'high' | 'medium' | 'low';
    if (overallConfidence >= 0.8 && session.responses.length >= 3) {
      assessmentQuality = 'high';
    } else if (overallConfidence >= 0.6 && session.responses.length >= 2) {
      assessmentQuality = 'medium';
    } else {
      assessmentQuality = 'low';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(session, finalBloomLevel, assessmentQuality);

    console.log(`Assessment completed: Level ${finalBloomLevel}, Confidence: ${overallConfidence.toFixed(2)}, Quality: ${assessmentQuality}`);

    return {
      session,
      finalBloomLevel,
      overallConfidence,
      recommendations
    };
  }

  private generateRecommendations(
    session: AssessmentSession,
    bloomLevel: number,
    quality: 'high' | 'medium' | 'low'
  ): string[] {
    const recommendations: string[] = [];
    
    // Quality-based recommendations
    if (quality === 'low') {
      recommendations.push('Consider retaking the assessment with more detailed responses for better accuracy');
    }
    
    // Level-based recommendations
    switch (bloomLevel) {
      case 1:
        recommendations.push('Focus on memorizing fundamental concepts and syntax');
        recommendations.push('Practice basic exercises to build foundation knowledge');
        break;
      case 2:
        recommendations.push('Work on explaining concepts in your own words');
        recommendations.push('Study how different technologies connect and work together');
        break;
      case 3:
        recommendations.push('Practice implementing solutions to real-world problems');
        recommendations.push('Build projects that demonstrate practical application of skills');
        break;
      case 4:
        recommendations.push('Focus on debugging and optimizing existing code');
        recommendations.push('Compare different approaches to solving the same problem');
        break;
      case 5:
        recommendations.push('Review and evaluate others\' code for quality and best practices');
        recommendations.push('Make architectural decisions for complex systems');
        break;
    }
    
    // Weakness-based recommendations
    const weakAreas = session.responses.flatMap(r => r.bloomAssessment.skillBreakdown.weak);
    const uniqueWeakAreas = [...new Set(weakAreas)];
    
    if (uniqueWeakAreas.length > 0) {
      recommendations.push(`Focus on improving: ${uniqueWeakAreas.join(', ')}`);
    }
    
    return recommendations;
  }

  // Simulate user response for testing (in real implementation, this would come from UI)
  private async simulateUserResponse(question: TechQuestion): Promise<string> {
    const responses: Record<string, string[]> = {
      'multiple-choice': [
        'Option A seems correct because it follows the standard pattern',
        'I think it\'s Option B',
        'Option C - this approach handles edge cases better'
      ],
      'open-ended': [
        'This concept works by creating a connection between the client and server, allowing data to flow bidirectionally',
        'The main advantage is performance optimization through caching',
        'You would implement this by first setting up the configuration, then handling the data processing'
      ],
      'code-analysis': [
        'This code has a potential memory leak in the loop',
        'The function returns undefined when the condition is not met',
        'There\'s a syntax error on line 3 - missing semicolon'
      ],
      'scenario': [
        'I would start by analyzing the requirements and breaking down the problem into smaller components',
        'The best approach would be to use a microservices architecture',
        'First, I\'d implement error handling, then optimize for performance'
      ]
    };
    
    const typeResponses = responses[question.type] || responses['open-ended'];
    return typeResponses[Math.floor(quantumRandomSync() * typeResponses.length)];
  }

  private initializeQuestionBank(): void {
    // Initialize with sample questions for different domains
    // In production, this would load from a database
    
    const javascriptQuestions: TechQuestion[] = [
      {
        id: 'js-001',
        text: 'What is the difference between let, const, and var in JavaScript?',
        type: 'open-ended',
        targetBloomLevel: 2,
        techDomain: 'javascript',
        difficulty: 'beginner',
        expectedResponseType: 'text'
      },
      {
        id: 'js-002', 
        text: 'Implement a function that debounces another function with a specified delay.',
        type: 'code-analysis',
        targetBloomLevel: 4,
        techDomain: 'javascript',
        difficulty: 'advanced',
        expectedResponseType: 'code'
      },
      {
        id: 'js-003',
        text: 'Which array method would you use to transform each element in an array?',
        type: 'multiple-choice',
        targetBloomLevel: 1,
        techDomain: 'javascript',
        difficulty: 'beginner',
        expectedResponseType: 'multiple-choice',
        options: ['forEach', 'map', 'filter', 'reduce']
      }
    ];

    const reactQuestions: TechQuestion[] = [
      {
        id: 'react-001',
        text: 'Explain the difference between state and props in React components.',
        type: 'open-ended',
        targetBloomLevel: 2,
        techDomain: 'react',
        difficulty: 'beginner',
        expectedResponseType: 'text'
      },
      {
        id: 'react-002',
        text: 'How would you optimize a React component that re-renders unnecessarily?',
        type: 'scenario',
        targetBloomLevel: 4,
        techDomain: 'react',
        difficulty: 'advanced',
        expectedResponseType: 'text'
      }
    ];

    this.questionBank.set('javascript', javascriptQuestions);
    this.questionBank.set('react', reactQuestions);
    this.questionBank.set('python', []); // Would be populated in production
  }

  // Public method to add questions (for extensibility)
  addQuestion(domainId: string, question: TechQuestion): void {
    const existingQuestions = this.questionBank.get(domainId) || [];
    existingQuestions.push(question);
    this.questionBank.set(domainId, existingQuestions);
  }

  // Get available domains
  getAvailableDomains(): string[] {
    return Array.from(this.questionBank.keys());
  }

  // Get question count for a domain
  getQuestionCount(domainId: string): number {
    return this.questionBank.get(domainId)?.length || 0;
  }
}
