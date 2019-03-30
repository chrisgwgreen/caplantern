import React from 'react'
import classNames from 'classnames'
import {func} from 'prop-types'
import './styles.css'

function AnimateHandleButton(props) {
  const {
    onAnimateHandle
  } = props

  return <button 
    className={
      classNames(
        'animate-stand'
      )
    }
    onClick={()=>onAnimateHandle()}
  >
      Animate stand
  </button>   
}

AnimateHandleButton.propTypes = { 
  onAnimateHandle: func.isRequired 
}

export default AnimateHandleButton