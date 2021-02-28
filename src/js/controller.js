import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

if(module.hot){
  module.hot.accept();
}
const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
  
    if(!id)return;
    recipeView.renderSpinner();

    //1 loading recipes 
    await model.loadRecipe(id);

    //2 rendering recipe..
    recipeView.render(model.state.recipe); 

  }
  catch(error){
    recipeView.renderError();
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
    resultsView.render(model.getSearchResultspage(1));

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
const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination)
}; 

init(); 