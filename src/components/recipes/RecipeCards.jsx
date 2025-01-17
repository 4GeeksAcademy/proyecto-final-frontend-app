import React from 'react';
import Slider from 'react-slick';
import '../../styles/recipeCards.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function RecipeCards() {
  const recipes = [
    { id: 1, title: 'Pizza Margarita', image: 'https://cdn.pixabay.com/photo/2021/07/19/16/04/pizza-6478478_1280.jpg' },
    { id: 2, title: 'Ensalada César', image: 'https://cdn.pixabay.com/photo/2022/05/20/08/55/pasta-7209002_1280.jpg' },
    { id: 3, title: 'Tacos al Pastor', image: 'https://cdn.pixabay.com/photo/2023/08/08/08/46/tacos-8176774_1280.jpg' },
    { id: 4, title: 'Sushi Variado', image: 'https://cdn.pixabay.com/photo/2020/04/04/15/07/sushi-5002639_1280.jpg' },
  ];

  const settings = {
    dots: true, // 
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
    <div className="recipe-slider mb-5">
      <Slider {...settings}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="p-3">
            <div className="card">
              <img src={recipe.image}
                alt={recipe.title}
                className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <a href={`/recipes/${recipe.id}`} className="btn btn-success">
                  Ver Receta
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );

}

export default RecipeCards;