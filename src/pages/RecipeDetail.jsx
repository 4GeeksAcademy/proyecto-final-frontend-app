import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api.js';
import Footer from '../components/layout/Footer.jsx';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipeDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/recipe/${id}`);
            setRecipe(response.data);
        } catch (err) {
            setError('Error al cargar los detalles de la receta.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta receta?');
        if (!confirmDelete) return;

        try {
            await api.delete(`/recipe/${id}`);
            navigate('/saved-recipes');
        } catch (err) {
            console.error('Error al eliminar la receta:', err);
            setError('Error al eliminar la receta. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        fetchRecipeDetail();
    }, [id]);

    console.log(recipe);
    return (
        <div>
            <Sidebar />
            <div className="recipe-detail content">
                {loading ? (
                    <p>Cargando receta...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (

                    <div className="recipe-card-horizontal">
                        <h3 className="recipe-title">{recipe.titulo}</h3>

                        <div className="recipe-section">
                            <p><strong>Descripción:</strong> {recipe.descripcion}</p>
                        </div>

                        <div className="recipe-section">
                            <p><strong>Ingredientes:</strong></p>
                            <ul>
                                {recipe.ingredients.split('\n').map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                )) || '<li>No especificados</li>'}
                            </ul>
                        </div>

                        <div className="recipe-section">
                            <p><strong>Pasos:</strong></p>
                            <ol>
                                {recipe.pasos.split('\n').map((step, index) => (
                                    <li key={index}>{step}</li>
                                )) || '<li>No especificados</li>'}
                            </ol>
                        </div>
                        <div className="recipe-section">
                            <p><strong>Valores nutricionales:</strong></p>
                            <ol>
                                {recipe.nutrientes.split('\n').map((e, index) => (
                                    <li key={index}>{e}</li>
                                )) || '<li>No especificados</li>'}
                            </ol>
                        </div>
                        <div className="recipe-section">
                            <div className="d-flex justify-content-between">
                                <p><strong>Calorías:</strong> {recipe.calorias || 'No especificadas'}</p>
                                <p><strong>Tiempo de preparación:</strong> {recipe.tiempo_elaboracion || 'No especificado'}</p>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <img className="img-chef me-4" src={recipe.foto_url} alt="ai-chef" />
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
