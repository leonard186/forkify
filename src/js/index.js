import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 **/
const state = {}
window.state = state;
/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1. Get query from the view
    const query = searchView.getInput();

    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult)

        try {
            // 4. Search for recipes;
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.recipes);
        } catch(error) {
            alert('something went wrong with the search ...');
            clearLoader();
        }   
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
});

/**
 * Recipe Controller
 */

 const controlRecipe = async () => {
     //Get Id from URL
     const id = window.location.hash.replace('#', '');

     if(id) {
        //Prepare UI for changes
        
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search) searchView.highlightSelected(id)

        //Create new recipe object
        state.recipe = new Recipe(id);
        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe);


        } catch(error) {
                alert('Error processing recipe')
        }
     }
 };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */

const controlList = () => {
    //create a new list If there is none yet
    if(!state.list) state.list = new List();

    // add each ingredient to the list and user iterface
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    //handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
    }
});










// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
});

window.l = new List();