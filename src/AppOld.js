import React from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createRecipe, updateRecipe, deleteRecipe } from './graphql/mutations';
import { listRecipes,searchRecipes } from './graphql/queries';
import {Container, Row, Col, Button, ButtonGroup, ButtonToolbar, ListGroup, Modal, Form, Badge} from 'react-bootstrap';
import _ from 'lodash';

class AppOld extends React.Component{

  state = {
    id: "",
    title: "",
    recipes: [],
    openModal: false,
    categories: ["Starter","Main Course", "Dessert"],
    selectedCategory: "",
    options: [],
    searchTerm: "",
    searchResults: [],
    isSearching: false
  }

  async componentDidMount(){
    const result = await API.graphql(graphqlOperation(listRecipes));
    this.setState({recipes: result.data.listRecipes.items});

    const options = this.state.categories
    .map(category => ({ value: category, label: category}))

  this.setState({options})
  }

  hasExistingRecipe = () => {
    const {recipes, id} = this.state;
    if(id) {
      const isRecipe = recipes.findIndex(title => title.id === id) > -1
      return isRecipe;
    }
    return false;
  }

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

  handleSetRecipe = ({title, category, id}) => { this.setState({title, selectedCategory: category, id, openModal: true}) }

  handleTitleChange = event => {
    this.setState({title: event.target.value})
  }

  handleCategoryChange = event => {
    this.setState({selectedCategory: event.target.value})
  }

  handleSearchChange = searchTerm => {
    this.setState({searchTerm:searchTerm.target.value})
  }

  handleSearch = async event => {
    console.log(event.target.value);
  }

  render(){

    const {recipes, title, selectedCategory, openModal} = this.state;

  return (
    <Container>
      <Row className="p-1"> 
        <Col>
          <ButtonToolbar>
            <Button variant="primary" size="lg" onClick={() => this.setState({openModal:true})} className="text-center">
              Add Recipe
            </Button>
          </ButtonToolbar>  
        </Col>
      </Row>
      <Row className="p-1">
        <Col>
          <Form onSubmit={this.handleSearch}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control 
                type="text" 
                placeholder="Search Recipes..." 
                value={this.state.searchTerm}
                onChange={this.handleSearchChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={this.handleSearch}>
              Search
            </Button>
          </Form>
        </Col>
      </Row>
            
      <Row>
        <Col>
          <ListGroup>
          {recipes.map(item => (
          <ListGroup.Item key={item.id}>
            {item.title}
            <ButtonGroup className="float-right">
              <Button variant="primary" size="sm" onClick={() => this.handleSetRecipe(item)} >Edit</Button>
              <Button variant="danger" size="sm" onClick={() => this.handleDeleteRecipe(item.id)} >Delete</Button>
            </ButtonGroup>
            <Badge pill variant="primary" className="float-right">
            {item.category}
            </Badge>&nbsp;     
          </ListGroup.Item>
          )
          )}            
          </ListGroup>
        </Col>
      </Row>

      <Modal show={openModal} onHide={() => this.setState({openModal:false})}>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="title"  onChange={this.handleTitleChange.bind(this)} value={title} />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" value={selectedCategory} onChange={this.handleCategoryChange.bind(this)}>
          {this.state.options.map(option => (
                        <option 
                          key={option.value} 
                          value={option.value} 
                          label={option.label} />
                      ))}
          </Form.Control>
        </Form.Group>
</Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.setState({openModal:false})}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleAddRecipe}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
        </Container>
  );
}
}

export default withAuthenticator(AppOld, {includeGreetings: true});
