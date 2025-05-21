
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured');
    }

    const { action, payload } = await req.json();
    
    switch (action) {
      case 'generate_exercise':
        return await generateExercise(payload);
      case 'analyze_performance':
        return await analyzePerformance(payload);
      case 'provide_feedback':
        return await provideFeedback(payload);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action specified' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in OpenRouter AI function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateExercise({ skill, prueba, difficulty, previousExercises = [] }) {
  const systemPrompt = `You are an expert education AI specialized in generating exercises for the Chilean PAES exam. 
  Create one exercise for the skill "${skill}" in the test "${prueba}" with difficulty level "${difficulty}".
  The exercise should include:
  1. A context passage for reading comprehension (approximately 150-200 words)
  2. A clear question
  3. Four options for multiple choice (only one correct)
  4. The correct answer
  5. A brief explanation of the solution
  
  Return your response in JSON format like:
  {
    "context": "The reading passage...",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation text"
  }`;

  const userPrompt = `Generate an original exercise that is not similar to these previous exercises: 
  ${JSON.stringify(previousExercises)}`;

  return await callOpenRouter(systemPrompt, userPrompt);
}

async function analyzePerformance({ userId, skillLevels, exerciseResults }) {
  const systemPrompt = `You are an educational analysis AI that specializes in identifying patterns in student performance.
  Analyze the given data about a student's performance and provide insights on:
  1. Strengths (skills where the student performs well)
  2. Areas for improvement
  3. Specific recommendations for study strategies
  4. Suggestions for next steps in their learning journey`;

  const userPrompt = `Analyze this student's performance data:
  Skill levels: ${JSON.stringify(skillLevels)}
  Recent exercise results: ${JSON.stringify(exerciseResults)}`;

  return await callOpenRouter(systemPrompt, userPrompt);
}

async function provideFeedback({ userMessage, context, exerciseAttempt, correctAnswer, explanation }) {
  const systemPrompt = `You are LectoGuía, an educational AI assistant specializing in helping students prepare for the Chilean PAES exam, 
  particularly in reading comprehension. You provide helpful, encouraging feedback to students in Spanish.
  Your responses should be informative but concise, focusing on practical advice and encouragement.
  Always respond in Spanish with a friendly, supportive tone.`;

  let userPrompt = '';
  
  if (exerciseAttempt && correctAnswer) {
    userPrompt = `The student was given this problem: ${exerciseAttempt.question}
    Their answer: ${exerciseAttempt.answer}
    The correct answer is: ${correctAnswer}
    Explanation: ${explanation}`;
  } else {
    userPrompt = `Student message: ${userMessage}
    Context: ${context || 'Chilean PAES exam preparation, focus on reading comprehension'}`;
  }

  const response = await callOpenRouter(systemPrompt, userPrompt);
  
  if (response.error) {
    throw new Error(response.error);
  }
  
  // Wrap the response in an object
  return new Response(
    JSON.stringify({ 
      result: { response: response.result || "Lo siento, no pude generar una respuesta adecuada." } 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function callOpenRouter(systemPrompt, userPrompt) {
  try {
    console.log('Calling OpenRouter with system prompt:', systemPrompt);
    console.log('User prompt:', userPrompt);
    
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://settifboilityelprvjd.supabase.co',
        'X-Title': 'PAES Preparation Platform'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return new Response(
        JSON.stringify({ error: `OpenRouter API error: ${errorData.error?.message || 'Unknown error'}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);
    
    return new Response(
      JSON.stringify({ 
        result: data.choices?.[0]?.message?.content || null 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    return new Response(
      JSON.stringify({ error: `Error calling OpenRouter: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
