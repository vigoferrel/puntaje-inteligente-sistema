import type { TechQuestion, TechDomain, BloomAssessmentResult } from '../types/bloom';

interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

interface BloomAnalysisParams {
  question: TechQuestion;
  response: string;
  domain: TechDomain;
  bloomCriteria: Record<number, string[]>;
}

export class OpenAIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private baseURL = 'https://api.openai.com/v1';

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature || 0.1;
  }

  async analyzeBloomLevel(params: BloomAnalysisParams): Promise<BloomAssessmentResult> {
    const prompt = this.buildBloomAnalysisPrompt(params);
    
    try {
      const response = await this.makeOpenAIRequest([
        {
          role: 'system',
          content: `You are an expert educational psychologist specializing in Bloom's Taxonomy for technical skills assessment.

BLOOM LEVELS FOR TECH SKILLS:
L1 - REMEMBER: Recall syntax, commands, basic concepts
L2 - UNDERSTAND: Explain how technologies work, interpret code
L3 - APPLY: Implement solutions, use frameworks correctly  
L4 - ANALYZE: Debug issues, compare approaches, break down problems
L5 - EVALUATE: Review code quality, assess architecture decisions

Analyze the response and return ONLY a JSON object with this structure:
{
  "dominantLevel": 1-5,
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation",
  "keyIndicators": ["indicator1", "indicator2"],
  "suggestions": "specific feedback",
  "skillBreakdown": {
    "strong": ["skill1", "skill2"],
    "weak": ["weakness1", "weakness2"]
  }
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return this.parseBloomAssessment(response);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  private buildBloomAnalysisPrompt(params: BloomAnalysisParams): string {
    const { question, response, domain, bloomCriteria } = params;
    
    return `
ASSESSMENT CONTEXT:
- Tech Domain: ${domain.name}
- Question Type: ${question.type}
- Expected Bloom Level: ${question.targetBloomLevel}

QUESTION:
${question.text}

${question.codeSnippet ? `CODE SNIPPET:\n${question.codeSnippet}` : ''}

USER RESPONSE:
${response}

DOMAIN CRITERIA:
${JSON.stringify(bloomCriteria, null, 2)}

ANALYSIS INSTRUCTIONS:
1. Identify cognitive processes demonstrated in the response
2. Match response complexity to Bloom taxonomy levels
3. Consider domain-specific knowledge depth
4. Provide confidence score based on response clarity
5. Suggest specific improvements for next level advancement
`;
  }

  private async makeOpenAIRequest(messages: OpenAIMessage[]): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: this.temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private parseBloomAssessment(aiResponse: string): BloomAssessmentResult {
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        dominantLevel: parsed.dominantLevel || 2,
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || 'Analysis completed',
        keyIndicators: Array.isArray(parsed.keyIndicators) ? parsed.keyIndicators : [],
        suggestions: parsed.suggestions || 'Continue practicing',
        skillBreakdown: {
          strong: Array.isArray(parsed.skillBreakdown?.strong) ? parsed.skillBreakdown.strong : [],
          weak: Array.isArray(parsed.skillBreakdown?.weak) ? parsed.skillBreakdown.weak : []
        }
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Return fallback assessment
      return {
        dominantLevel: 2,
        confidence: 0.3,
        reasoning: 'Assessment completed with limited analysis',
        keyIndicators: ['Basic understanding demonstrated'],
        suggestions: 'Continue practicing and exploring the topic',
        skillBreakdown: {
          strong: ['Basic concepts'],
          weak: ['Advanced application']
        }
      };
    }
  }

  async generateLearningRecommendations(
    bloomLevel: number,
    techDomain: string,
    weakAreas: string[]
  ): Promise<string[]> {
    const prompt = `
Generate 3-5 specific learning recommendations for someone at Bloom Level ${bloomLevel} in ${techDomain}.

Weak areas to address: ${weakAreas.join(', ')}

Focus on actionable next steps that bridge to the next Bloom level.
Return as a JSON array of strings.
`;

    try {
      const response = await this.makeOpenAIRequest([
        {
          role: 'system',
          content: 'You are a learning path expert. Generate practical, specific recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const recommendations = JSON.parse(response);
      return Array.isArray(recommendations) ? recommendations : [response];
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      return [
        'Practice coding exercises regularly',
        'Study documentation and best practices',
        'Build small projects to apply concepts',
        'Join developer communities for feedback'
      ];
    }
  }
}
