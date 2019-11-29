import React from 'react';
import {AppContext} from './AppProvider';

export default function(props){
    return(
        <AppContext.Consumer>
            {({recipes}) => {
                if(!recipes){
                    return <div>Loading Recipes</div>
                }
                return <div>{props.children}</div>
            }}
        </AppContext.Consumer>
    )
}