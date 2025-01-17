// // import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/layout/Sidebar';
// import api from '../services/api.js';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import '../styles/mealPlan.css'
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const MealPlan = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [mealPlan, setMealPlan] = useState({});
//   const navigate = useNavigate();

//   const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
//   const meals = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena'];


//   const fetchSavedRecipes = async () => {
//     try {
//       const response = await api.get('/recipe/saved');
//       setRecipes(response.data);
//     } catch (err) {
//       console.error('Error al cargar recetas:', err);
//     }
//   };

//   const handleDrop = (day, meal, recipe, sourceKey) => {
//     setMealPlan((prev) => {
//       const updatedPlan = { ...prev };

//       if (sourceKey) {
//         delete updatedPlan[sourceKey];
//       }

//       updatedPlan[`${day}-${meal}`] = recipe;

//       localStorage.setItem('mealPlan', JSON.stringify(updatedPlan)); // Guardar en localStorage
//       return updatedPlan;
//     });
//   };


//   const handleRemove = (day, meal) => {
//     setMealPlan((prev) => {
//       const updatedPlan = { ...prev };
//       delete updatedPlan[`${day}-${meal}`];
//       localStorage.setItem('mealPlan', JSON.stringify(updatedPlan));
//       return updatedPlan;
//     });
//   };

//   const handleDragStart = (e, recipe, sourceKey) => {
//     e.dataTransfer.setData('recipe', JSON.stringify(recipe));
//     // Con esto saco la clave de la celda original
//     e.dataTransfer.setData('sourceKey', sourceKey);
//   };



//   useEffect(() => {
//     fetchSavedRecipes();

//     const savedMealPlan = JSON.parse(localStorage.getItem('mealPlan'));
//     if (savedMealPlan) {
//       setMealPlan(savedMealPlan);
//     }
//   }, []);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           infinite: true,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   console.log(recipes)

//   return (
//     <div>
//       <Sidebar />
//       <div className="meal-plan content">
//         <h2 className="text-center my-4">Plan Semanal de Comidas</h2>

//         <table className="table border-rounded">
//           <thead>
//             <tr>
//               <th className="bg-transparent"></th>
//               {daysOfWeek.map((day) => (
//                 <th key={day} className="text-center">{day}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {meals.map((meal) => (
//               <tr key={meal}>
//                 <td className="day-cell"><strong className="day-text">{meal}</strong></td>
//                 {daysOfWeek.map((day) => (
//                   <td
//                     key={`${day}-${meal}`}
//                     onDrop={(e) => {
//                       const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
//                       const sourceKey = e.dataTransfer.getData('sourceKey');
//                       handleDrop(day, meal, recipe, sourceKey);
//                     }}
//                     onDragOver={(e) => e.preventDefault()}
//                     className="meal-cell" 
//                   >
//                     {mealPlan[`${day}-${meal}`] ? (
//                       <div
//                         className="meal-item d-flex flex-column justify-content-between text-center"
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, mealPlan[`${day}-${meal}`], `${day}-${meal}`)} // Agregar sourceKey
//                       >
//                         <strong>{mealPlan[`${day}-${meal}`].titulo}</strong>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <p className="my-auto">{mealPlan[`${day}-${meal}`].calorias} Calorías</p>
//                           <i className="trash-icon bi bi-trash my-auto text-light bg-danger rounded h6 p-1 ms-2"
//                             onClick={() => handleRemove(day, meal)}></i>
//                         </div>
//                       </div>
//                     ) : (
//                       <p className="text-muted text-center h-100 m-0 d-flex justify-content-center align-items-center"><i className="bi bi-plus-square-dotted"></i></p>
//                     )}

//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <h3 className="my-4">Recetas Guardadas</h3>
//         <div className="recipe-slider mb-5 bg-success bg-opacity-25">
//           <Slider {...settings}>
//             {recipes.map((recipe) => (
//               <div
//                 key={recipe.id}
//                 className="p-3 bg-success bg-opacity-25"
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, recipe)}>
//                 <div className="card">
//                   <img src={recipe.url}
//                     alt={recipe.titulo}
//                     className="card-img-top" />
//                   <div className="card-body d-flex flex-column justify-content-between text-center">
//                     <h5 className="card-title">{recipe.titulo}</h5>
//                     <button
//                       onClick={() => navigate(`/recipe/${recipe.id}`)}
//                       className="btn btn-success"
//                     >Ver Detalles
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//         {/* <div className="recipe-slider mb-5">
//           <Slider {...sliderSettings}>
//             {recipes.map((recipe) => (
//               <div
//                 key={recipe.id}
//                 className="p-3"
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, recipe)}>
//                 <div className="card">
//                   <h4>{recipe.titulo}</h4>
//                   <p>Calorías: {recipe.calorias}</p>
//                 </div>
//                 <div className="card-body">
//                   <h5 className="card-title">{recipe.title}</h5>
//                   <a href={`/recipes/${recipe.id}`} className="btn btn-success">
//                     Ver Receta
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div> */}
//       </div >
//     </div >
//   );
// };

// export default MealPlan;
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api.js';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/mealPlan.css';
import { useNavigate } from 'react-router-dom';

const MealPlan = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [expandedColumns, setExpandedColumns] = useState({});  // Estado para controlar las columnas expandidas
  const navigate = useNavigate();

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const meals = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena'];

  const fetchSavedRecipes = async () => {
    try {
      const response = await api.get('/recipe/saved');
      setRecipes(response.data);
    } catch (err) {
      console.error('Error al cargar recetas:', err);
    }
  };

  const handleDrop = (day, meal, recipe, sourceKey) => {
    setMealPlan((prev) => {
      const updatedPlan = { ...prev };
      if (sourceKey) {
        delete updatedPlan[sourceKey];
      }
      updatedPlan[`${day}-${meal}`] = recipe;
      localStorage.setItem('mealPlan', JSON.stringify(updatedPlan));
      return updatedPlan;
    });
  };

  const handleRemove = (day, meal) => {
    setMealPlan((prev) => {
      const updatedPlan = { ...prev };
      delete updatedPlan[`${day}-${meal}`];
      localStorage.setItem('mealPlan', JSON.stringify(updatedPlan));
      return updatedPlan;
    });
  };

  const handleDragStart = (e, recipe, sourceKey) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
    e.dataTransfer.setData('sourceKey', sourceKey);
  };

  // Función para alternar el estado de expansión de las columnas
  const toggleColumn = (day) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [day]: !prev[day],  // Alternar el valor actual de la columna
    }));
  };

  useEffect(() => {
    fetchSavedRecipes();

    const savedMealPlan = JSON.parse(localStorage.getItem('mealPlan'));
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <Sidebar />
      <div className="meal-plan content">
        <h2 className="text-center my-4">Plan Semanal de Comidas</h2>

        <table className="table border-rounded">
          <thead>
            <tr>
              <th className="bg-transparent"></th>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="text-center"
                  onClick={() => toggleColumn(day)} // Alternar expansión
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal}>
                <td className="day-cell"><strong className="day-text">{meal}</strong></td>
                {daysOfWeek.map((day) => (
                  <td
                    key={`${day}-${meal}`}
                    className="meal-cell"
                    style={{
                      visibility: expandedColumns[day] ? 'visible' : 'collapse',  // Usamos visibility en lugar de d-none
                    }}
                    onDrop={(e) => {
                      const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
                      const sourceKey = e.dataTransfer.getData('sourceKey');
                      handleDrop(day, meal, recipe, sourceKey);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {mealPlan[`${day}-${meal}`] ? (
                      <div
                        className="meal-item d-flex flex-column justify-content-between text-center"
                        draggable
                        onDragStart={(e) => handleDragStart(e, mealPlan[`${day}-${meal}`], `${day}-${meal}`)}
                      >
                        <strong>{mealPlan[`${day}-${meal}`].titulo}</strong>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="my-auto">{mealPlan[`${day}-${meal}`].calorias} Calorías</p>
                          <i className="trash-icon bi bi-trash my-auto text-light bg-danger rounded h6 p-1 ms-2"
                            onClick={() => handleRemove(day, meal)}></i>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted text-center h-100 m-0 d-flex justify-content-center align-items-center">
                        <i className="bi bi-plus-square-dotted"></i>
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="my-4">Recetas Guardadas</h3>
        <div className="recipe-slider mb-5 bg-success bg-opacity-25">
          <Slider {...settings}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-3 bg-success bg-opacity-25"
                draggable
                onDragStart={(e) => handleDragStart(e, recipe)}>
                <div className="card">
                  <img src={recipe.url}
                    alt={recipe.titulo}
                    className="card-img-top" />
                  <div className="card-body d-flex flex-column justify-content-between text-center">
                    <h5 className="card-title">{recipe.titulo}</h5>
                    <button
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                      className="btn btn-success"
                    >Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
