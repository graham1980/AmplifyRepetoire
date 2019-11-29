import React from 'react';
import {AppContext} from './AppProvider';
import { List } from 'semantic-ui-react';

function getRecipesToDisplay(recipes,filteredRecipes){
    if(filteredRecipes) return Object.values(filteredRecipes);
    else return recipes;
}

export default function({recipes}){
    return(<AppContext.Consumer>
            {({recipes,filteredRecipes}) => {

                let recipesToDisplay = getRecipesToDisplay(recipes,filteredRecipes);

                return <List selection verticalAlign='middle'>
                    <List.Header>
                        {recipesToDisplay.length} results
                    </List.Header>
                    {recipesToDisplay.map(recipe => (
                        <List.Item key={recipe.id}>
                            <List.Content floated='right'>
                                {recipe.category}
                            </List.Content>
                            <List.Icon name="food"/>
                            <List.Content>
                                    {recipe.title}
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            }}
        </AppContext.Consumer>)
}