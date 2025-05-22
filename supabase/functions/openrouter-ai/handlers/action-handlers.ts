
import { callOpenRouter, callVisionModel } from "../services/openrouter-service.ts";
import { createErrorResponse, createSuccessResponse, processAIResponse } from "../utils/response-utils.ts";

/**
 * Handles the generate_exercise action
 */
export async function generateExercise({ skill, prueba, difficulty, previousExercises = [] }) {
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

  const response = await callOpenRouter(systemPrompt, userPrompt);
  
  if (response.error) {
    return createErrorResponse(response.error);
  }
  
  return createSuccessResponse(response.result);
}

/**
 * Handles the analyze_performance action
 */
export async function analyzePerformance({ userId, skillLevels, exerciseResults }) {
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

  const response = await callOpenRouter(systemPrompt, userPrompt);
  
  if (response.error) {
    return createErrorResponse(response.error);
  }
  
  return createSuccessResponse(response.result);
}

/**
 * Handles the provide_feedback action
 */
export async function provideFeedback({ userMessage, context, exerciseAttempt, correctAnswer, explanation }) {
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
    return createErrorResponse(response.error);
  }
  
  const responseData = processAIResponse(response.result);
  return createSuccessResponse(responseData);
}

/**
 * Handles image processing requests using vision models
 */
export async function processImage({ image, prompt, context = '' }) {
  console.log(`Processing image with prompt: ${prompt?.substring(0, 50)}...`);

  if (!image) {
    return createErrorResponse("Se requiere una imagen para el procesamiento", 400);
  }

  // Validate image format
  if (!image.startsWith('data:image/') && !image.startsWith('http')) {
    return createErrorResponse("Formato de imagen inválido. Debe ser una URL o una imagen codificada en Base64", 400);
  }

  const systemPrompt = `Eres un asistente educativo especializado en comprensión lectora y análisis de textos para la preparación 
  del examen PAES chileno. Analiza detenidamente la imagen proporcionada y responde en español. 
  ${context ? `Contexto adicional: ${context}` : ''}`;

  const userPrompt = prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar. Luego, resume el contenido principal.";

  try {
    const response = await callVisionModel(systemPrompt, userPrompt, image);
    
    if (response.error) {
      console.error('Error in processImage:', response.error);
      return createErrorResponse(response.error);
    }

    const responseData = processAIResponse(response.result);
    return createSuccessResponse({
      response: responseData.response || responseData,
      extractedText: responseData.extractedText || null,
      analysis: responseData.analysis || null
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return createErrorResponse(`Error al procesar la imagen: ${error.message}`, 500);
  }
}
