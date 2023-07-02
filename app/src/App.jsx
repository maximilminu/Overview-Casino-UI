import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const App = () =>{
    return (
        <h1>
          <FontAwesomeIcon icon={faCoffee} />
          Welcome to React App thats build using Webpack and Babel separately
        </h1>
    )
}

export default App