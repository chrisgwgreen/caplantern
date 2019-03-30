import React from 'react'
import classNames from 'classnames'
import './styles.css'
import {
  element,
  string
} from 'prop-types'

function ContentContainer(props) {
  const {
    colour,
    leftContent,
    rightContent
  } = props

  return <div className= {
    classNames({
      [`content-container--${colour}`]: colour!== undefined
    })
  }>
    <div className= "content-container">
      <div className= "content-container__left-content">{leftContent}</div>
      <div className= "content-container__right-content">{rightContent}</div>
    </div>
  </div>
}

ContentContainer.propTypes = { 
  leftContent: element.isRequired,
  rightContent: element.isRequired,
  colour: string,
}

export default ContentContainer