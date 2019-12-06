import React from 'react';
import _ from 'lodash';
import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { createRecipe, updateRecipe, deleteRecipe } from '../graphql/mutations';
import { listRecipes } from '../graphql/queries';
import aws_exports from '../aws-exports';
import {Container} from 'semantic-ui-react';

Amplify.configure(aws_exports);

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: "",
            title: "",
            //recipes: [],
            openModal: false,
            categories: ["Starter","Main Course", "Dessert"],
            selectedCategory: "",
            options: [],
            searchTerm: "",
            searchResults: [],
            setFilteredRecipes: this.setFilteredRecipes,
            handleAddRecipe: this.handleAddRecipe,
            handleTitleChange: this.handleTitleChange,
            handleCategoryChange: this.handleCategoryChange,
            handleDeleteRecipe:this.handleDeleteRecipe,
            modal: false,
            isSearching: false
        };
    }

    async componentDidMount() {
        const limit = 100;
        const result = await API.graphql(graphqlOperation(listRecipes,{limit}));
        
        this.setState({recipes: result.data.listRecipes.items});
    
        const options = this.state.categories
        .map(category => ({ value: category, label: category}))
    
      this.setState({options})
    }

    setFilteredRecipes = (filteredRecipes) => this.setState({filteredRecipes});
    setModal = () => this.setState({modal: true});

    handleAddRecipe = async event => {
        const {title,selectedCategory, recipes} = this.state;
    
        event.preventDefault();
        if(this.hasExistingRecipe()){
          this.handleUpdateRecipe()
        } else {
          const input = {title,category:selectedCategory}
          const result = await API.graphql(graphqlOperation(createRecipe, {input}))
          const newRecipe = result.data.createRecipe;
          const updatedRecipes = [newRecipe,...recipes];
          this.setState({recipes : updatedRecipes, title: ""});
        }
        this.setState({openModal:false});
    }

    hasExistingRecipe = () => {
        const {recipes, id} = this.state;
        if(id) {
          const isRecipe = recipes.findIndex(title => title.id === id) > -1
          return isRecipe;
        }
        return false;
    } 
    
    handleSetRecipe = ({title, category, id}) => { this.setState({title, selectedCategory: category, id, openModal: true}) }

    handleTitleChange = event => { this.setState({title: event.target.value}) }
  
    handleCategoryChange = event => { this.setState({selectedCategory: event.target.value}) }

    handleUpdateRecipe = async () => {
        const {recipes, id, title, selectedCategory} = this.state;
        const input = {
          id,
          title,
          category: selectedCategory
        }
        const result = await API.graphql(graphqlOperation(updateRecipe, {input}))
        const updatedRecipe = result.data.updateRecipe;
        const index = recipes.findIndex(title => title.id === updatedRecipe.id)
        const updatedRecipes = [
          ...recipes.slice(0,index),
          updatedRecipe,
          ...recipes.slice(index+1)
        ]
        this.setState({recipes:updatedRecipes,title:"", id:""});
      }
    
      handleDeleteRecipe = async recipeId => {
        const {recipes} = this.state;
        const input = { id: recipeId};
        const result = await API.graphql(graphqlOperation(deleteRecipe, {input}))
        const deletedRecipeId = result.data.deleteRecipe.id;
        const updatedRecipes = recipes.filter(title => title.id !== deletedRecipeId);
        this.setState({recipes: updatedRecipes})
      }    

    render(){
        return(
            <Container fluid>
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
            </Container>
        )
    }
}