import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { generateRecipeWithAI, chatWithAI } from '../services/aiService';
import '../styles/recipes.css'
import Footer from '../components/layout/Footer';
import api from '../services/api.js';
import RandomIcon from '../components/RandomIcon.jsx';


function Recipes() {
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el texto del buscador
  const [aiRecipe, setAiRecipe] = useState(''); // Estado para la receta generada por IA
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(''); // Estado de errores
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [chatHistory, setChatHistory] = useState([]);


  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 2000);
  };

  const handleSearchAI = async () => {
    setLoading(true);
    setError('');
    setAiRecipe(''); // Limpiar la receta anterior
    setSearchQuery('');

    try {
      const recipe = await generateRecipeWithAI(searchQuery);
      setAiRecipe(recipe);
    } catch (err) {
      setError('Error al generar la receta con IA');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const parsedRecipe = aiRecipe?.description ? JSON.parse(aiRecipe.description) : null;


  const saveRecipe = async () => {
    console.log('parsedRecipe:', parsedRecipe);
    try {
      if (!parsedRecipe) {
        showAlert('danger', 'La receta no está disponible');
        return;
      }

      const recipeData = {
        titulo: parsedRecipe.name,
        ingredients: parsedRecipe.ingredients.join('\n'),
        descripcion: parsedRecipe.description,
        pasos: parsedRecipe.steps.join('\n'),
        calorias: parsedRecipe.calories,
        foto_url: parsedRecipe.image,
        nutrientes: parsedRecipe.nutritional_values.join('\n'),
        tiempo_elaboracion: parsedRecipe.prep_time,
      };

      console.log('Datos enviados:', recipeData);

      const response = await api.post('/recipe/save', recipeData);
      showAlert('success', 'Receta guardada con éxito');
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      showAlert('danger', 'Error al guardar la receta');
    }
  };

  const handleChatWithAI = async () => {
    console.log("Valor de searchQuery antes de enviar:", searchQuery);
    console.log("Chat history antes de enviar:", chatHistory);
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const newMessage = { role: 'user', content: searchQuery };
      const updatedChatHistory = [...chatHistory, newMessage];
      const response = await chatWithAI(updatedChatHistory, searchQuery.trim());

      const aiMessage = { role: 'assistant', content: response };
      setChatHistory([...updatedChatHistory, aiMessage]);
    } catch (err) {
      setError('Error al obtener respuesta de la IA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="w-100 content">
          {alert.show && (
            <div className="alert-overlay"
              onClick={() => setAlert({ show: false, type: '', message: '' })}>
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            </div>
          )}
          <h2 className="mt-2 mb-4 text-center">¿Qué cocinamos hoy?</h2>
          {/* Buscador */}
          <div>
            <div className="d-flex justify-content-end align-items-center">
              <p className="conversation me-3 my-auto">¡Hola! ¿Con qué ingredientes cocinamos hoy? Puedo prepararte una receta genial en segundos. ¡Haz la prueba!</p>
              <img className="img-chef me-4" src="https://cdn.pixabay.com/photo/2024/08/20/13/12/ai-generated-8983262_960_720.jpg" alt="ai-chef" />
            </div>
            <div className="chat-history px-3 pb-3">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex align-items-center mb-2 ${msg.role === 'user' ? 'justify-content-start' : 'justify-content-end'}`}
                >
                  {msg.role === 'user' && (
                    <img className="img-chef me-4" src="https://cdn.pixabay.com/photo/2024/08/20/13/12/ai-generated-8983262_960_720.jpg" />
                  )}

                  <p className={`conversation my-4 ${msg.role === 'user' ? 'text-primary' : 'me-3 my-auto text-dark'}`}>
                    <strong>{msg.role === 'user' ? 'Tú' : 'Asistente de cocina'}</strong>
                    <br />
                    {msg.content}
                  </p>

                  {msg.role !== 'user' && (
                    <img className="img-chef ms-4" src="https://cdn.pixabay.com/photo/2024/08/20/13/12/ai-generated-8983262_960_720.jpg" />
                  )}
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-start align-items-center my-4">
              <img className="img-chef mx-4" src="https://cdn.pixabay.com/photo/2024/08/20/13/12/ai-generated-8983262_960_720.jpg" alt="ai-chef" />
              <div className="mb-4 own-conversation">
                <textarea
                  type="text"
                  className="form-control mb-4"
                  placeholder="Ejemplo: pollo, zanahorias y patatas"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                ></textarea>
                <div className="recipe-generate-button">
                  <button
                    className="btn btn-primary w-25"
                    onClick={handleSearchAI}
                    disabled={loading || !searchQuery.trim()}
                    title="Generar receta"
                  >
                    {loading ? <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                      <span role="status">👩‍🍳</span>
                    </div> : '👩‍🍳'}
                  </button>
                  <button className="btn btn-secondary ms-2"
                    onClick={handleChatWithAI} disabled={loading || !searchQuery.trim()}
                    title="Preguntar a la IA">
                    {loading ? <span>🤖 Cargando...</span> : '🤖 Preguntar'}
                  </button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </div>

              </div>
            </div>
          </div>
          {/* Resultado de la receta */}

          {/* Resultado de la receta o icono aleatorio */}
          {loading ? (
            <div className="loading-container text-center">
              <RandomIcon />
              <p className="mt-3">Generando receta...</p>
            </div>
          ) : (
            aiRecipe && (
              <div className="recipe-card-horizontal">
                <div className="recipe-title">
                  <h1 className="recipe-title fs-1 text-center">{parsedRecipe.name}</h1>
                </div>
                <div className="recipe-header">
                  <div className="d-flex flex-column w-50">
                    <img className="recipe-image mb-4" src={parsedRecipe.image} alt="foto-receta" />
                  </div>
                  <div className="recipe-info w-50 my-auto">
                    <p>{parsedRecipe.description}</p>
                  </div>
                </div>
                <div className="recipe-header flex-wrap">
                  <div>
                    <p><strong>Valores nutricionales:</strong></p>
                    <ul>
                      {parsedRecipe.nutritional_values.map((e, index) => (
                        <li key={index}>{e}</li>
                      )) || '<li>No especificados</li>'}
                    </ul>
                  </div>

                  <p><strong>Calorías:</strong> {parsedRecipe.calories || 'No especificadas'}</p>
                  <p><strong>Tiempo de preparación:</strong> {parsedRecipe.prep_time || 'No especificado'}</p>
                </div>
                <div className="recipe-content">
                  <div className="recipe-section">
                    <p><strong>Ingredientes:</strong></p>
                    <ul>
                      {parsedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      )) || '<li>No especificados</li>'}
                    </ul>
                  </div>

                  <div className="recipe-section">
                    <p><strong>Pasos:</strong></p>
                    <ol>
                      {parsedRecipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      )) || '<li>No especificados</li>'}
                    </ol>
                  </div>
                </div>
                <div className="recipe-actions d-flex justify-content-end mt-2">
                  <button className="btn btn-primary"
                    onClick={saveRecipe}
                    title="Guardar receta">
                    <i class="bi bi-floppy-fill"></i></button>
                </div>

              </div>
            )
          )}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>

  );
}

export default Recipes;



