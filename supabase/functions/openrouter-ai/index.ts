
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Environment variables and constants
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const APP_URL = "https://puntaje-inteligente-sistema.lovable.app";

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Available models in cascading priority order
const MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'anthropic/claude-3-haiku:2024-04-29',
  'meta-llama/llama-3-70b-instruct'
];

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verify API key exists
    if (!verifyApiKeyExists()) {
      return createErrorResponse('OpenRouter API key no está configurado. Por favor, configura la clave en los secretos de Supabase.', 500);
    }

    // Parse request data
    const { action, payload } = await parseRequestData(req);
    
    // Process the requested action
    return await processAction(action, payload);
  } catch (error) {
    console.error('Error in OpenRouter AI function:', error);
    return createErrorResponse(error.message, 500);
  }
});

/**
 * Verifies if the OpenRouter API key exists
 */
function verifyApiKeyExists(): boolean {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is not configured");
    return false;
  }
  return true;
}

/**
 * Parses the request body to extract action and payload
 */
async function parseRequestData(req: Request): Promise<{ action: string; payload: any }> {
  try {
    const requestData = await req.json();
    const action = requestData.action;
    const payload = requestData.payload;
    console.log(`Processing ${action} request with payload:`, JSON.stringify(payload));
    return { action, payload };
  } catch (jsonError) {
    console.error("Error parsing request JSON:", jsonError);
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Routes the request to the appropriate handler based on the action
 */
async function processAction(action: string, payload: any): Promise<Response> {
  switch (action) {
    case 'generate_exercise':
      return await generateExercise(payload);
    case 'analyze_performance':
      return await analyzePerformance(payload);
    case 'provide_feedback':
      return await provideFeedback(payload);
    default:
      console.error(`Invalid action specified: ${action}`);
      return createErrorResponse(`Acción inválida: ${action}`, 400);
  }
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(message: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Creates a standardized success response
 */
function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify({ result: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Handles the generate_exercise action
 */
async function generateExercise({ skill, prueba, difficulty, previousExercises = [] }) {
  console.log(`Generating ${difficulty} exercise for skill: ${skill} in test: ${prueba}`);
  
  const systemPrompt = `You are an expert education AI specialized in generating exercises for the Chilean PAES exam. 
  Create one exercise for the skill "${skill}" in the test "${prueba}" with difficulty level "${difficulty}".
  The exercise should include:
  1. A context passage for reading comprehension (approximately 150-200 words)
  2. A clear question
  3. Four options for multiple choice (only one correct)
  4. The correct answer (which must exactly match one of the options)
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

/**
 * Handles the analyze_performance action
 */
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

/**
 * Handles the provide_feedback action
 */
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
    userPrompt = `Student message: ${userMessage || "Hola"}
    Context: ${context || 'Chilean PAES exam preparation, focus on reading comprehension'}`;
  }

  const response = await callOpenRouter(systemPrompt, userPrompt);
  
  if (response.error) {
    console.error('Error in provideFeedback:', response.error);
    throw new Error(response.error);
  }
  
  const responseData = processAIResponse(response.result);
  return createSuccessResponse(responseData);
}

/**
 * Process and normalize AI response data
 */
function processAIResponse(result: any) {
  // Handle string responses
  if (typeof result === 'string') {
    return { response: result };
  } 
  
  // Handle object responses
  if (result && typeof result === 'object') {
    // Ensure we have a response property
    if (!result.response && typeof result !== 'string') {
      result.response = "Lo siento, no pude generar una respuesta adecuada.";
    }
    return result;
  }
  
  // Fallback for unexpected formats
  return { response: "Lo siento, no pude generar una respuesta adecuada." };
}

/**
 * Calls the OpenRouter API with cascading model fallback strategy
 */
async function callOpenRouter(systemPrompt: string, userPrompt: string) {
  try {
    console.log('Calling OpenRouter with system prompt:', systemPrompt.substring(0, 100) + '...');
    console.log('User prompt:', userPrompt.substring(0, 100) + '...');
    
    if (!OPENROUTER_API_KEY) {
      console.error('Missing OpenRouter API key');
      throw new Error('OpenRouter API key is not configured');
    }
    
    const requestStartTime = Date.now();
    
    // Try each model in order until one works
    let response;
    let attempts = 0;
    const maxAttempts = MODELS.length;
    
    while (attempts < maxAttempts) {
      const currentModel = MODELS[attempts];
      console.log(`Attempting with model: ${currentModel} (attempt ${attempts + 1}/${maxAttempts})`);
      
      response = await attemptModelRequest(currentModel, systemPrompt, userPrompt);
      
      if (response.ok) {
        break;
      } else if (response.status === 429) {
        // Rate limit encountered, try next model
        console.warn(`Rate limit hit for model ${currentModel}, trying next model...`);
        attempts++;
      } else {
        // Other error, break and handle below
        break;
      }
    }

    const requestDuration = Date.now() - requestStartTime;
    console.log(`OpenRouter API call completed in ${requestDuration}ms with status: ${response.status}`);

    if (!response.ok) {
      return handleApiError(response, attempts >= maxAttempts);
    }

    return await processSuccessfulResponse(response);
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    return createErrorResponse(`Error calling OpenRouter: ${error.message}`, 500);
  }
}

/**
 * Attempts to call an OpenRouter model with the given prompts
 */
async function attemptModelRequest(
  model: string, 
  systemPrompt: string, 
  userPrompt: string
): Promise<Response> {
  const requestBody = JSON.stringify({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });
  
  console.log('Request body:', requestBody.substring(0, 200) + '...');
  
  return await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': APP_URL,
      'X-Title': 'PAES Preparation Platform'
    },
    body: requestBody
  });
}

/**
 * Handles errors from the OpenRouter API
 */
async function handleApiError(response: Response, allModelsAttempted: boolean): Promise<Response> {
  const errorText = await response.text();
  console.error('OpenRouter API error response:', errorText);
  
  let errorData;
  try {
    errorData = JSON.parse(errorText);
  } catch (e) {
    errorData = { error: { message: errorText } };
  }
  
  const errorMessage = errorData.error?.message || errorText || 'Unknown error';
  const statusCode = response.status;
  
  if (statusCode === 429 && allModelsAttempted) {
    return new Response(
      JSON.stringify({ 
        error: `Todos los modelos están experimentando rate limiting. Por favor, intenta de nuevo más tarde.`,
        fallbackResponse: {
          response: "Lo siento, estoy experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos."
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  return new Response(
    JSON.stringify({ error: `Error de OpenRouter (${statusCode}): ${errorMessage}` }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Processes successful responses from the OpenRouter API
 */
async function processSuccessfulResponse(response: Response): Promise<Response> {
  const responseText = await response.text();
  console.log('Raw response text:', responseText.substring(0, 200) + '...');
  
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('Error parsing JSON response:', e);
    return createErrorResponse(`Error parsing JSON response: ${e.message}`);
  }
  
  console.log('OpenRouter response received, first 200 chars of content:', 
    data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
  
  const content = data.choices?.[0]?.message?.content || null;
  const parsedContent = extractJsonFromContent(content);
  
  return createSuccessResponse(parsedContent || content || null);
}

/**
 * Attempts to extract JSON data from response content
 */
function extractJsonFromContent(content: string | null): any {
  if (!content) return null;
  
  try {
    // If already an object, return as is
    if (typeof content === 'object') {
      return content;
    }
    
    // Look for JSON pattern in the string
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON pattern found, return content as is
    return content;
  } catch (e) {
    console.log('Could not parse content as JSON, returning raw content:', e);
    return content;
  }
}
