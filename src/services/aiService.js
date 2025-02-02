import api from './api';

/**
 * Genera una receta usando la API de IA.
 * @param {string} prompt - La descripción de la receta que el usuario quiere crear.
 * @returns {Promise<Object>} - Retorna los datos de la receta generada.
 * @throws {Error} - Lanza un error si falla la solicitud.
 */
export const generateRecipeWithAI = async (prompt) => {
  console.log("Enviando al backend:", { prompt });
  try {
    const response = await api.post('/ai/generate', { prompt });
    return {
      name: prompt,
      description: response.data.recipe,
      image: response.data.image || 'https://via.placeholder.com/300',
      ingredients: response.data.ingredients || [],
      steps: response.data.steps || '',
      calories: response.data.calories || '',
      nutritional_value: response.data.nutritional_value || '',
      prep_time: response.data.prep_time || '',
    };
  } catch (error) {
    console.error('Error al generar la receta con IA:', error);
    throw new Error('Error al generar la receta con IA');
  }
};

export const chatWithAI = async (chatHistory, prompt) => {
  console.log("Enviando al backend:", { prompt, history: chatHistory });
  try {
    const response = await api.post('/ai/chat', { 
      prompt, 
      history: chatHistory 
    });
    console.log(response.data.response)
    return response.data.response;
  } catch (error) {
    console.error('Error en el chat con la IA:', error);
    throw error;
  }
};