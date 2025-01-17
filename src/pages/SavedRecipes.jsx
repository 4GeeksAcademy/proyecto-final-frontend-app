import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import '../styles/savedRecipes.css'

const getSavedRecipes = async () => {
  const response = await api.get('/recipe/saved');
  console.log(response);
  return response.data;
};

const deleteRecipe = async (id) => {
  await api.delete(`/recipe/${id}`);
};

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 2000);
  };


  // Función para cargar recetas guardadas
  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const recipes = await getSavedRecipes();
      console.log(recipes);
      setSavedRecipes(recipes);
    } catch (err) {
      setError('Error al cargar las recetas guardadas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setSavedRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== id)
      );
      showAlert('success', 'Receta eliminada con éxito');
    } catch (err) {
      console.error('Error al eliminar la receta:', err);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  return (
    <div>
      <Sidebar />

      <div className="saved-recipes content">
        {alert.show && (
          <div className="alert-overlay"
            onClick={() => setAlert({ show: false, type: '', message: '' })}>
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          </div>
        )}
        <h2 className="text-center my-4">Recetas Guardadas</h2>
        {loading ? (
          <p>Cargando recetas...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : savedRecipes.length === 0 ? (
          <p>No tienes recetas guardadas aún.</p>
        ) : (
          <div className="recipe-list">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card w-100">
                <h3>{recipe.titulo}</h3>
                <p>{recipe.descripcion}</p>
                <p><strong>Tiempo de elaboración:</strong> {recipe.tiempo_elaboracion}</p>
                <p><strong>Calorías:</strong> {recipe.calorias}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="btn btn-success"
                  >Ver Detalles
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
