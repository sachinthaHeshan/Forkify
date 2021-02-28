import * as model from './model.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime'
import {async} from 'regenerator-runtime';

// const recipeContainer = document.querySelector('.recipe');

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
    //get search quary
    const query = searchView.getQuery();
    if(!query) return;
     
    //load search results
    await model.loadSearchResults(query); 

    //reder it
    console.log(model.state.search.results)

  }catch(error){
    console.log(error)
  }
};

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}; 

init();