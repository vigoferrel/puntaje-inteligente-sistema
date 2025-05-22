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
      
      try {
        response = await attemptModelRequest(currentModel, systemPrompt, userPrompt);
        
        if (response.ok) {
          console.log(`Model ${currentModel} responded successfully with status:`, response.status);
          break;
        } else if (response.status === 429) {
          // Rate limit encountered, try next model
          console.warn(`Rate limit hit for model ${currentModel}, trying next model...`);
          attempts++;
        } else {
          // Other error, log and try next model
          const errorText = await response.text().catch(() => 'Could not read error response');
          console.error(`Error with model ${currentModel}: ${response.status}`, errorText);
          attempts++;
          
          if (attempts >= maxAttempts) {
            throw new Error(`All models failed. Last error: Status ${response.status}`);
          }
        }
      } catch (fetchError) {
        console.error(`Fetch error with model ${currentModel}:`, fetchError);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error(`Network error: ${fetchError.message}`);
        }
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
    
    // Create a fallback response
    const fallbackResponse = {
      response: "Lo siento, estoy experimentando problemas de conexión en este momento. Por favor, intenta de nuevo más tarde."
    };
    
    return { 
      error: `Error calling OpenRouter: ${error.message}`,
      fallbackResponse: fallbackResponse
    };
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
      
      // Provide a fallback response
      const fallbackResponse = {
        response: "Lo siento, no he podido analizar esta imagen. Por favor, intenta con otra o proporciona más detalles sobre lo que necesitas."
      };
      
      return { 
        error: `Error procesando imagen (${response.status}): ${errorText}`,
        fallbackResponse
      };
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
    
    // Provide a fallback response
    const fallbackResponse = {
      response: "Lo siento, no he podido analizar esta imagen debido a un error técnico. Por favor, intenta de nuevo más tarde."
    };
    
    return { 
      error: `Error llamando al modelo de visión: ${error.message}`,
      fallbackResponse
    };
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
  
  console.log(`Making request to model ${model}`);
  
  try {
    return await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.APP_URL,
        'X-Title': 'PAES Preparation Platform',
        'User-Agent': 'PAES-App/1.0'
      },
      body: requestBody
    });
  } catch (error) {
    console.error(`Network error during request to ${model}:`, error);
    throw error;
  }
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
  
  // Provide informative message based on error type
  let userMessage = 'Se produjo un error al comunicarse con el modelo de IA.';
  
  if (statusCode === 429 && allModelsAttempted) {
    userMessage = "Todos los modelos están experimentando alta demanda actualmente. Por favor, intenta de nuevo más tarde.";
  } else if (statusCode === 401 || statusCode === 403) {
    userMessage = "Error de autenticación con el servicio de IA. Por favor, verifica la configuración.";
  } else if (statusCode >= 500) {
    userMessage = "El servicio de IA está experimentando problemas técnicos. Por favor, intenta de nuevo más tarde.";
  }
  
  // Create a fallback response
  const fallbackResponse = {
    response: userMessage
  };
  
  return { 
    error: `Error de OpenRouter (${statusCode}): ${errorMessage}`,
    fallbackResponse
  };
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
    return { 
      error: `Error parsing JSON response: ${e.message}`,
      fallbackResponse: {
        response: "Recibí una respuesta del modelo que no pude procesar correctamente."
      }
    };
  }
  
  console.log('OpenRouter response received, first 200 chars of content:', 
    data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
  
  const content = data.choices?.[0]?.message?.content || null;
  const parsedContent = extractJsonFromContent(content);
  
  return { result: parsedContent || content || null };
}
