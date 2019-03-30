import React from 'react'
import classNames from 'classnames'
import './styles.css'
import {
  func,
  bool,
  string
} from 'prop-types'

function ColourButton(props) {
  const {
    setColour,
    colour,
    isSelected
  } = props

  return <div 
    className={
      classNames(
        'colour-button', 
        `colour-button__colour--${colour}`,
        { 
          'colour-button--selected': isSelected 
        }
      )
    }
    data-colour={colour}
    onClick={() => setColour(colour)}
  ></div>
}

ColourButton.propTypes = { 
  colour: string.isRequired,
  isSelected: bool.isRequired,
  setColour: func.isRequired
}

export default ColourButton