import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';
export const clearResults = () => elements.searchResultList.innerHTML = '';

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if(accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length
        }, 0);
        return `${newTitle.join(' ')} ...`;
    } 
    return title;
}

const renderRecipe = recipe => {
    const markup = `
          <li>
             <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                 <figure class="results__fig">
                     <img src="${recipe.image_url}" alt="${recipe.title}">
                 </figure>
                 <div class="results__data">
                      <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                      <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const renderButtons = (page) => {
    
};

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
}
