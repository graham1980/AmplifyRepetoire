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
                    {recipesToDisplay.map(recipe => (
                        <List.Item key={recipe.id}>
                            <List.Content>
                                <List.Header>
                                    {recipe.title}
                                </List.Header>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            }}
        </AppContext.Consumer>)
}