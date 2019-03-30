import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import {initResize} from 'services/resize'

import Home from 'scenes/Home'

ReactDOM.render(
  <Home />, 
  document.getElementById('root'),
  () => {
    initResize()
  }
)

serviceWorker.unregister()
