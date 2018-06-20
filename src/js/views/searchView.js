import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
}

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

const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page + 1}>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults / resultsPerPage);
    let button;

    if(page === 1 && pages > 1) {
        //show Button that goes to next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        //show both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1) {
        //show only button that to go to the previous page
        button = createButton(page, 'prev')
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button)
};

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resultPerPage)


}
