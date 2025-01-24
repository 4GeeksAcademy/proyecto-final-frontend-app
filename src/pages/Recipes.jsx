import { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { generateRecipeWithAI } from '../services/aiService';
import '../styles/recipes.css';
import Footer from '../components/layout/Footer';
import RandomIcon from '../components/RandomIcon.jsx';
import api from '../services/api';
import UserContext from '../context/UserContext'; 
import LoginModal from '../components/modals/LoginModal'; 
import RegistrationModal from '../components/modals/RegistrationModal'; 

function Recipes() {
  const { user } = useContext(UserContext); 
  const [searchQuery, setSearchQuery] = useState('');
  const [aiRecipe, setAiRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false); 

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type, message: '' }), 2000);
  };

  const handleSearchAI = async () => {
    if (!user) {
      if (!hasSearchedOnce) {
        setHasSearchedOnce(true);
      } else {
        setShowLoginModal(true);
        return;
      }
    }

    setLoading(true);
    setError('');
    setAiRecipe('');
    setSearchQuery('');

    try {
      const recipe = await generateRecipeWithAI(searchQuery);
      setAiRecipe(recipe);
    } catch (err) {
      setError('Error al generar la receta con IA');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const parsedRecipe = aiRecipe && aiRecipe.description ? JSON.parse(aiRecipe.description) : null;

  const saveRecipe = async () => {
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

    try {
      const response = await api.post('/recipe/save', recipeData);
      if (response.status === 200) {
        showAlert('success', 'Receta guardada con éxito');
      } else {
        showAlert('success', 'Receta guardada con éxito');
      }
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      showAlert('danger', 'Error al guardar la receta');
    }
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false); 
    setShowRegistrationModal(true);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="w-100 content">
          {alert.show && (
            <div
              className="alert-overlay"
              onClick={() => setAlert({ show: false, type: '', message: '' })}
            >
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            </div>
          )}

          <h1 className="my-4 text-center">¿Qué cocinamos hoy?</h1>

          <div>
            <div className="d-flex justify-content-end align-items-center mb-4">
              <p className="conversation me-3 my-auto">
                ¡Hola! ¿Con qué ingredientes cocinamos hoy? Puedo prepararte una receta genial en segundos. ¡Haz la prueba!
              </p>
              <img
                className="img-chef me-4"
                src="https://cdn.pixabay.com/photo/2024/08/20/13/12/ai-generated-8983262_960_720.jpg"
                alt="ai-chef"
              />
            </div>
            <div className="d-flex justify-content-start align-items-center mb-4">
              <img
                className="img-chef mx-4"
                src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="ai-chef"
              />
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
                    {loading ? <i class="bi bi-send-check-fill"></i> : <i class="bi bi-send-fill"></i>}
                  </button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container text-center">
              <RandomIcon />
              <p className="mt-3">Generando receta...</p>
            </div>
          ) : (
            parsedRecipe && (
              <div className="recipe-card-horizontal">
                <div className="recipe-title">
                  <h1 className="recipe-title fs-1 text-center">{parsedRecipe.name}</h1>
                </div>
                <div className="recipe-header">
                  <div className="d-flex flex-column w-50">
                    <img
                      className="recipe-image mb-4"
                      src={parsedRecipe.image}
                      alt="foto-receta"
                    />
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
                      ))}
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
                      ))}
                    </ul>
                  </div>

                  <div className="recipe-section">
                    <p><strong>Pasos:</strong></p>
                    <ol>
                      {parsedRecipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="recipe-actions d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-primary"
                    onClick={saveRecipe}
                    title="Guardar receta"
                  >
                    <i className="bi bi-floppy-fill"></i>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />


      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onRegisterClick={handleRegisterClick}
      />

      {/* Modal de Registro */}
      <RegistrationModal
        show={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
  );
}

export default Recipes;