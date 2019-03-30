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

  return <div className="footer">
    Footer
  </div>
}

CopyContainer.propTypes = { 
  title: string.isRequired,
  copy: string.isRequired,
}

export default CopyContainer