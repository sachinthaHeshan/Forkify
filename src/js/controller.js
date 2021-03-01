import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// if(module.hot){
//   module.hot.accept();
// }
const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
  
    if(!id)return;
    recipeView.renderSpinner();

    //0 update
    resultsView.update(modal.getSearchResultsPage());

    //1updating
    bookmarksView.update(model.state.bookmarks);

    //2 loading recipes 
    await model.loadRecipe(id);

    //3 rendering recipe..
    recipeView.render(model.state.recipe); 
  }
  catch(error){
    recipeView.renderError();
    console.error(error)
  }
};

const controlSearchResults = async function(){

  try{
    resultsView.renderSpinner();
    // console.log(resultsView)

    //1 get search quary
    const query = searchView.getQuery();
    if(!query) return;
     
    //2 load search results
    await model.loadSearchResults(query); 

    //3 reder results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultspage());

    // 4render initi 
    paginationView.render(model.state.search)

  }catch(error){
    console.log(error)
  }
};

const controlPagination = function(goToPage){
     //1 reder new results
    resultsView.render(model.getSearchResultspage(goToPage));

    // 2 render new pagination btn
    paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe); 
  recipeView.update(model.state.recipe); 
};

const controlAddBookmark = function(){
  //1
  if(!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }
  else{
   model.deleteBookmark(model.state.recipe.id);
  }

  //2
  recipeView.update(model.state.recipe);

  //3
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecie = async function (newRecipe){
  try{
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '',`#${model.state.recipe.id}`);

    setTimeout(function(){
      addRecipeView.toggleWindow();
    },MODAL_CLOSE_SEC * 1000);
  }catch(error){
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHanlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipes);

}; 

init(); 