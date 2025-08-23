import { OpenAIService } from '../services/OpenAIService';
import type { BloomAssessmentResult, BloomLevelAssessment, TechQuestion, TechDomain } from '../types/bloom';

export class BloomLevelDetector {
  private openAIService: OpenAIService;
  private bloomCriteria: Record<string, Record<number, string[]>>;

  constructor(openAIService: OpenAIService) {
    this.openAIService = openAIService;
    this.bloomCriteria = this.initializeBloomCriteria();
  }

  async analyzeResponseBloomLevel(
    question: TechQuestion,
    userResponse: string,
    techDomain: TechDomain
  ): Promise<BloomLevelAssessment> {
    
    if (!userResponse.trim()) {
      return this.getEmptyResponseAssessment();
    }

    try {
      const result = await this.openAIService.analyzeBloomLevel({
        question,
        response: userResponse,
        domain: techDomain,
        bloomCriteria: this.bloomCriteria[techDomain.id] || this.bloomCriteria.default
      });

      // Convert BloomAssessmentResult to BloomLevelAssessment
      const bloomLevelAssessment: BloomLevelAssessment = {
        bloomLevel: result.dominantLevel,
        dominantLevel: result.dominantLevel,
        confidence: result.confidence,
        reasoning: result.reasoning,
        keyIndicators: result.keyIndicators,
        skillBreakdown: result.skillBreakdown,
        suggestions: result.suggestions
      };

      // Enhance result with domain-specific analysis
      return this.enhanceAssessmentResult(bloomLevelAssessment, question, userResponse, techDomain);
    } catch (error) {
      console.error('Bloom analysis error:', error);
      return this.getFallbackAssessment(question, userResponse);
    }
  }

  private initializeBloomCriteria(): Record<string, Record<number, string[]>> {
    return {
      javascript: {
        1: ['syntax recall', 'variable types', 'basic operators', 'function definition'],
        2: ['code interpretation', 'explaining concepts', 'describing behavior'],
        3: ['implementing solutions', 'using libraries', 'writing functions'],
        4: ['debugging code', 'comparing approaches', 'identifying patterns'],
        5: ['code review', 'architecture decisions', 'performance analysis']
      },
      react: {
        1: ['component syntax', 'JSX basics', 'props definition'],
        2: ['component lifecycle', 'state explanation', 'hook concepts'],
        3: ['building components', 'handling events', 'managing state'],
        4: ['optimizing performance', 'debugging issues', 'component design'],
        5: ['architecture patterns', 'testing strategies', 'best practices']
      },
      python: {
        1: ['syntax basics', 'data types', 'control structures'],
        2: ['OOP concepts', 'module imports', 'error types'],
        3: ['writing scripts', 'using libraries', 'data manipulation'],
        4: ['debugging programs', 'algorithm analysis', 'code optimization'],
        5: ['design patterns', 'system architecture', 'code quality']
      },
      default: {
        1: ['basic syntax', 'terminology recall', 'simple concepts'],
        2: ['concept explanation', 'relationship understanding', 'interpretation'],
        3: ['practical implementation', 'tool usage', 'problem solving'],
        4: ['comparative analysis', 'debugging', 'pattern recognition'],
        5: ['evaluation criteria', 'best practices', 'strategic decisions']
      }
    };
  }

  private enhanceAssessmentResult(
    result: BloomLevelAssessment,
    question: TechQuestion,
    response: string,
    domain: TechDomain
  ): BloomLevelAssessment {
    // Adjust confidence based on question type and domain
    let adjustedConfidence = result.confidence;
    
    if (question.type === 'multiple-choice' && result.dominantLevel > 3) {
      // Lower confidence for high bloom levels from multiple choice
      adjustedConfidence *= 0.8;
    }
    
    if (question.type === 'open-ended' && response.length > 200) {
      // Higher confidence for detailed open-ended responses
      adjustedConfidence = Math.min(1.0, adjustedConfidence * 1.1);
    }

    // Domain-specific adjustments
    const domainKeywords = this.getDomainKeywords(domain.id);
    const hasRelevantKeywords = domainKeywords.some(keyword => 
      response.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasRelevantKeywords) {
      adjustedConfidence = Math.min(1.0, adjustedConfidence * 1.05);
    }

    return {
      ...result,
      confidence: Math.round(adjustedConfidence * 100) / 100, // Round to 2 decimals
      reasoning: this.enhanceReasoning(result.reasoning, question, domain)
    };
  }

  private getDomainKeywords(domainId: string): string[] {
    const keywords: Record<string, string[]> = {
      javascript: ['function', 'variable', 'array', 'object', 'callback', 'promise', 'async'],
      react: ['component', 'props', 'state', 'hook', 'jsx', 'render', 'lifecycle'],
      python: ['class', 'function', 'list', 'dictionary', 'import', 'exception', 'iterator'],
      default: ['code', 'program', 'function', 'variable', 'data', 'algorithm']
    };
    
    return keywords[domainId] || keywords.default;
  }

  private enhanceReasoning(
    originalReasoning: string,
    question: TechQuestion,
    domain: TechDomain
  ): string {
    const domainContext = `This assessment was conducted within the ${domain.name} domain, `;
    const questionContext = `targeting Bloom level ${question.targetBloomLevel} (${this.getBloomLevelName(question.targetBloomLevel)}). `;
    
    return domainContext + questionContext + originalReasoning;
  }

  private getBloomLevelName(level: number): string {
    const levelNames = {
      1: 'Remember',
      2: 'Understand', 
      3: 'Apply',
      4: 'Analyze',
      5: 'Evaluate'
    };
    return levelNames[level as keyof typeof levelNames] || 'Unknown';
  }

  private getEmptyResponseAssessment(): BloomLevelAssessment {
    return {
      bloomLevel: 1,
      dominantLevel: 1,
      confidence: 0.1,
      reasoning: 'No response provided - unable to assess cognitive level',
      keyIndicators: [],
      suggestions: 'Please provide a response to demonstrate your understanding',
      skillBreakdown: {
        strong: [],
        weak: ['response-completion']
      }
    };
  }

  private getFallbackAssessment(question: TechQuestion, response: string): BloomLevelAssessment {
    // Simple heuristic-based assessment
    const responseLength = response.trim().length;
    const questionLevel = question.targetBloomLevel;
    
    let estimatedLevel = 1;
    if (responseLength > 50) estimatedLevel = 2;
    if (responseLength > 150) estimatedLevel = 3;
    
    // Don't exceed question's target level without sophisticated analysis
    estimatedLevel = Math.min(estimatedLevel, questionLevel);
    
    return {
      bloomLevel: estimatedLevel,
      dominantLevel: estimatedLevel,
      confidence: 0.4,
      reasoning: 'Fallback assessment based on response characteristics due to AI service unavailability',
      keyIndicators: [`response-length-${responseLength > 100 ? 'detailed' : 'brief'}`],
      suggestions: 'For more accurate assessment, please ensure AI service is available',
      skillBreakdown: {
        strong: responseLength > 100 ? ['communication'] : [],
        weak: responseLength < 50 ? ['detail-level'] : []
      }
    };
  }

  // Method to validate assessment results
  validateAssessment(assessment: BloomLevelAssessment): boolean {
    return (
      assessment.dominantLevel >= 1 && 
      assessment.dominantLevel <= 5 &&
      assessment.confidence >= 0 && 
      assessment.confidence <= 1 &&
      assessment.reasoning.length > 0
    );
  }
}
