import * as model from './model.js';
import recipeview from './views/recipeview.js';
import searchView from './views/viewsearch.js';
import resultsview from './views/resultsview.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';



import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
    module.hot.accept();
}




// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


// fetching from forkify api 
const controlRecipes = async function() {
    try {
        //resultsview.renderSpinner();

        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeview.renderSpinner()

        // update results view to mark selected search result 
        resultsview.render(model.getSearchResultsPage());
        bookmarksView.render(model.state.bookmarks)

        //loading recipe
        await model.loadRecipe(id);


        recipeview.render(model.state.recipe);

    } catch (err) {
        console.log(err);
        recipeview.renderError(``);
    }
};

const controlSearchResults = async function() {
    try {
        // 1) get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2) load serch results
        await model.loadSearchResults(query);

        // 3 render results
        // resultsview.render(model.state.search.results)
        resultsview.render(model.getSearchResultsPage());

        //4 render initial pagination buttons
        paginationView.render(model.state.search)
    } catch (err) {
        console.log(err);
    }
};
controlSearchResults();

const controlPagination = function(goToPage) {
    // 1 new render results

    resultsview.render(model.getSearchResultsPage(goToPage));

    //2  render new  pagination buttons
    paginationView.render(model.state.search)

}

const controlServings = function(newServings) {
    //update the recipe servings (in state)
    model.updateServings(newServings)

    //update recipe view
    // recipeview.render(model.state.recipe);
    recipeview.update(model.state.recipe);

}

const controlAddBookmark = function() {
    // add and remove bookmarks 
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // update recipe view 
    recipeview.render(model.state.recipe);

    // render bookmarks 
    bookmarksView.render(model.state.bookmarks)



}

const init = function() {
    recipeview.addHandlerRender(controlRecipes);
    recipeview.addHandlerUpdateServings(controlServings);
    recipeview.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);


};
init();