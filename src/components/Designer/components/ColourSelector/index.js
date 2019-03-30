import React, { Component } from 'react'
import ColourButton from './components/ColourButton'
import {colours} from 'components/Designer/services/config'
import classNames from 'classnames'
import {
  func,
  bool,
  string
} from 'prop-types'
import './styles.css'

class ColourSelector extends Component {
  render() {
    const {
      setColour,
      isColourSelectorVisible,
      selectedColour
    } = this.props

    return (
      <aside className={
        classNames(
          'colour-selector',
          {
            'colour-selector--enabled': isColourSelectorVisible
          }
        )
      }>
        <div className="colour-selector__container">
          {
            Object.keys(colours).map(colour => {
              return <ColourButton 
                key={`colour-${colour}`} 
                colour={colour}
                setColour={setColour}
                isSelected={colour === selectedColour}
              />
            })
          }
        </div>
      </aside> 
    )
  }
}

ColourSelector.propTypes = { 
  setColour: func.isRequired,
  isColourSelectorVisible: bool.isRequired,
  selectedColour: string
}

export default ColourSelector
