import React from 'react';
import {AppContext} from './AppProvider';
import { Input } from 'semantic-ui-react';
import _ from 'lodash';
import fuzzy from 'fuzzy';

const handleSearch = _.debounce((inputValue,recipes,setFilteredRecipes) => {
    let recipeTitles = recipes.map(recipe => recipe.title);
    let fuzzyResults = fuzzy
    .filter(inputValue, recipeTitles, {})
    .map(result => result.string);

    let filteredRecipes = _.pickBy(recipes, (result) => {
        let coinName = result.title;
        return _.includes(fuzzyResults, coinName);
      });

      setFilteredRecipes(filteredRecipes);
},500);

function filterResults(e,recipes,setFilteredRecipes) {
    let inputValue = e.target.value;
    handleSearch(inputValue,recipes,setFilteredRecipes);
}

export default function(){
    return(<AppContext.Consumer>
        {({recipes,setFilteredRecipes}) => 
            <Input icon='search' placeholder="Search..." onKeyUp={(e) => filterResults(e, recipes,setFilteredRecipes)} />
        }
        </AppContext.Consumer>)

}