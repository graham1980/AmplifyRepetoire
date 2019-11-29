import React from 'react'
import {AppContext} from './AppProvider';
import { Button, Header, Image, Modal,Input,Form } from 'semantic-ui-react'

export default function(){
    return(<AppContext.Consumer>
        {({title,options,selectedCategory,handleAddRecipe,handleTitleChange,handleCategoryChange}) => 
            <Modal trigger={<Button>Add Recipe</Button>}>
            <Modal.Header>Add Recipe</Modal.Header>
            <Modal.Content>
            <Form>
        <Form.Group>
          <label>Title</label>
          <Form.Field control="input" type="text" placeholder="title"  onChange={handleTitleChange} value={title} />
        </Form.Group>
        <Form.Group>
          <label>Category</label>
          <Form.Field control="select" value={selectedCategory} onChange={handleCategoryChange}>
          {options.map(option => (
                        <option 
                          key={option.value} 
                          value={option.value} 
                          label={option.label} />
                      ))}
          </Form.Field>
        </Form.Group>
        </Form>
        </Modal.Content>
        <Modal.Actions>
        <Button variant="secondary">
            Cancel
          </Button>
          <Button color="green" variant="primary" onClick={handleAddRecipe}>
            Save
          </Button>
          </Modal.Actions> 
          </Modal>
          
        }
        </AppContext.Consumer>)

}