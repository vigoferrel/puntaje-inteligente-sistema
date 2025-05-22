import { config, MODELS } from "../config.ts";
import { corsHeaders } from "../cors.ts";
import { extractJsonFromContent } from "../utils/response-utils.ts";

/**
 * Calls the OpenRouter API with cascading model fallback strategy
 */
export async function callOpenRouter(systemPrompt: string, userPrompt: string) {
  try {
    console.log('Calling OpenRouter with system prompt:', systemPrompt.substring(0, 100) + '...');
    console.log('User prompt:', userPrompt.substring(0, 100) + '...');
    
    if (!config.OPENROUTER_API_KEY) {
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
      return await handleApiError(response, attempts >= maxAttempts);
    }

    return await processSuccessfulResponse(response);
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    return { error: `Error calling OpenRouter: ${error.message}` };
  }
}

/**
 * Specific function to call vision models for image processing
 */
export async function callVisionModel(systemPrompt: string, userPrompt: string, imageData: string) {
  try {
    console.log('Calling vision model with system prompt:', systemPrompt.substring(0, 100) + '...');
    console.log('User prompt:', userPrompt.substring(0, 100) + '...');
    
    if (!config.OPENROUTER_API_KEY) {
      console.error('Missing OpenRouter API key');
      throw new Error('OpenRouter API key is not configured');
    }
    
    const requestStartTime = Date.now();
    
    // Use the Qwen vision model directly since it supports images
    const model = 'qwen/qwen2.5-vl-72b-instruct:free';
    console.log(`Using vision model: ${model}`);
    
    // Prepare content array with both text and image
    const messages = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user',
        content: [
          { type: 'text', text: userPrompt }
        ]
      }
    ];

    // Add image data based on format (URL or Base64)
    if (imageData.startsWith('data:image/')) {
      // Base64 image
      messages[1].content.push({
        type: 'image_url',
        image_url: { url: imageData }
      });
    } else {
      // URL image
      messages[1].content.push({
        type: 'image_url',
        image_url: { url: imageData }
      });
    }

    const requestBody = JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.5,
      max_tokens: 1200
    });
    
    console.log('Vision request body structure:', JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: '...' },
        { role: 'user', content: [{ type: 'text' }, { type: 'image_url' }] }
      ]
    }));
    
    const response = await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.APP_URL,
        'X-Title': 'PAES Preparation Platform'
      },
      body: requestBody
    });

    const requestDuration = Date.now() - requestStartTime;
    console.log(`OpenRouter Vision API call completed in ${requestDuration}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API vision error response:', errorText);
      return { error: `Error procesando imagen (${response.status}): ${errorText}` };
    }

    const responseText = await response.text();
    console.log('Raw vision response text:', responseText.substring(0, 200) + '...');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return { error: `Error al analizar respuesta JSON: ${e.message}` };
    }
    
    console.log('Vision response received, first 200 chars of content:', 
      data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
    
    const content = data.choices?.[0]?.message?.content || null;
    
    return { result: content };
  } catch (error) {
    console.error('Error calling vision model:', error);
    return { error: `Error llamando al modelo de visión: ${error.message}` };
  }
}

/**
 * Attempts to call an OpenRouter model with the given prompts
 */
export async function attemptModelRequest(
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
  
  return await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': config.APP_URL,
      'X-Title': 'PAES Preparation Platform'
    },
    body: requestBody
  });
}

/**
 * Handles errors from the OpenRouter API
 */
export async function handleApiError(response: Response, allModelsAttempted: boolean): Promise<any> {
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
    return { 
      error: `Todos los modelos están experimentando rate limiting. Por favor, intenta de nuevo más tarde.`,
      fallbackResponse: {
        response: "Lo siento, estoy experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos."
      }
    };
  }
  
  return { error: `Error de OpenRouter (${statusCode}): ${errorMessage}` };
}

/**
 * Processes successful responses from the OpenRouter API
 */
export async function processSuccessfulResponse(response: Response): Promise<any> {
  const responseText = await response.text();
  console.log('Raw response text:', responseText.substring(0, 200) + '...');
  
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('Error parsing JSON response:', e);
    return { error: `Error parsing JSON response: ${e.message}` };
  }
  
  console.log('OpenRouter response received, first 200 chars of content:', 
    data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
  
  const content = data.choices?.[0]?.message?.content || null;
  const parsedContent = extractJsonFromContent(content);
  
  return { result: parsedContent || content || null };
}
