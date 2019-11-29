import React from 'react';
import './App.css';
import styled,{css} from 'styled-components';
import AppLayout from './AppLayout';
import {AppProvider} from './AppProvider';
import Content from './Content';
import RecipeList from './RecipeList';
import Search from './Search';
import AddRecipe from './AddRecipe';
import { withAuthenticator } from 'aws-amplify-react';

function App(){
    return(
        <AppLayout>
            <AppProvider>
                <Content>
                    <AddRecipe />
                    <Search />
                    <RecipeList />
                </Content>
            </AppProvider>
        </AppLayout>
    );
}

export default withAuthenticator(App, {includeGreetings: true});//, authenticatorComponents: [AddRecipe]});;
//export default App;