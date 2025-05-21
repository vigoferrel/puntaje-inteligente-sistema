
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("OpenRouter function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is not configured");
      throw new Error('OpenRouter API key is not configured');
    }

    const { action, payload } = await req.json();
    console.log(`Processing ${action} request with payload:`, JSON.stringify(payload));
    
    switch (action) {
      case 'generate_exercise':
        return await generateExercise(payload);
      case 'analyze_performance':
        return await analyzePerformance(payload);
      case 'provide_feedback':
        return await provideFeedback(payload);
      default:
        console.error(`Invalid action specified: ${action}`);
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
  console.log(`Generating ${difficulty} exercise for skill: ${skill} in test: ${prueba}`);
  console.log(`OpenRouter API key exists: ${!!OPENROUTER_API_KEY}`);
  console.log(`API key length: ${OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0}`);
  
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
    "id": "unique-id-string",
    "context": "The reading passage...",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation text",
    "skill": "${skill}",
    "difficulty": "${difficulty}"
  }`;

  const userPrompt = `Generate an original exercise that is not similar to these previous exercises: 
  ${JSON.stringify(previousExercises)}`;

  console.log('System prompt:', systemPrompt.substring(0, 100) + '...');
  console.log('User prompt:', userPrompt.substring(0, 100) + '...');

  return await callOpenRouter(systemPrompt, userPrompt);
}

async function analyzePerformance({ userId, skillLevels, exerciseResults }) {
  console.log(`Analyzing performance for user: ${userId}`);
  
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
  console.log(`Providing feedback based on user message: ${userMessage?.substring(0, 30)}...`);
  
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
    console.error('Error in provideFeedback:', response.error);
    throw new Error(response.error);
  }
  
  return new Response(
    JSON.stringify({ 
      result: { response: response.result || "Lo siento, no pude generar una respuesta adecuada." } 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function callOpenRouter(systemPrompt, userPrompt) {
  try {
    console.log('Calling OpenRouter with system prompt:', systemPrompt.substring(0, 100) + '...');
    console.log('User prompt:', userPrompt.substring(0, 100) + '...');
    
    if (!OPENROUTER_API_KEY) {
      console.error('Missing OpenRouter API key');
      throw new Error('OpenRouter API key is not configured');
    }
    
    const requestStartTime = Date.now();
    const requestBody = JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    console.log('Request body:', requestBody);
    
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://settifboilityelprvjd.supabase.co',
        'X-Title': 'PAES Preparation Platform'
      },
      body: requestBody
    });

    const requestDuration = Date.now() - requestStartTime;
    console.log(`OpenRouter API call completed in ${requestDuration}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: errorText } };
      }
      return new Response(
        JSON.stringify({ error: `OpenRouter API error: ${errorData.error?.message || errorText || 'Unknown error'}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return new Response(
        JSON.stringify({ error: `Error parsing JSON response: ${e.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('OpenRouter response received, first 200 chars of content:', 
      data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
    
    const content = data.choices?.[0]?.message?.content || null;
    
    // Try to parse JSON if content is available
    let parsedContent;
    if (content) {
      try {
        // First check if it's already a JSON object
        if (typeof content === 'object') {
          parsedContent = content;
        } else {
          // Try to extract JSON from string (handles cases where AI might add explanations)
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0]);
          } else {
            parsedContent = content; // Just use as-is if not JSON
          }
        }
      } catch (e) {
        console.log('Could not parse content as JSON, returning raw content:', e);
        parsedContent = content;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        result: parsedContent || content || null 
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
