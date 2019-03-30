import React from 'react'
import './styles.css'
import {
  string
} from 'prop-types'

function CopyContainer(props) {
  const {
    title,
    copy
  } = props

  return <div className="copy-container">
    <h3 className="copy-container__title">{title}</h3>
    <p className="copy-container__copy">{copy}</p>
  </div>
}

CopyContainer.propTypes = { 
  title: string.isRequired,
  copy: string.isRequired,
}

export default CopyContainer