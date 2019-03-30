import React, { Component } from 'react'
import {addResizeEvent} from 'services/resize'
import {
  number,
  string
} from 'prop-types'
import './styles.css'

import ParallaxPanel from 'components/ParallaxPanel'
import Loader from 'components/Loader'

class ParallaxImage extends Component {
  constructor() {
    super()

    this.repositionImage = this.repositionImage.bind(this)
  }

  componentDidMount(){
    const {
      src
    } = this.props

    addResizeEvent(this.repositionImage)

    this.image.addEventListener('load', (img)=> {
      this.widthToHeight = this.image.width/ this.image.height 
      this.heightToWidth = this.image.height / this.image.width
      this.repositionImage()
    })

    this.image.src = src
  }

  repositionImage() {
    const width =  this.imageContainer.clientWidth
    const height = this.imageContainer.clientHeight
    const calcWidth = Math.ceil(this.widthToHeight * height )
    const calcHeight = Math.ceil(this.heightToWidth * width )


    if (calcWidth < width) {
      this.image.width = width
      this.image.height = calcHeight
      this.image.style.top = `${-(calcHeight - height) / 2}px`
      this.image.style.left = 0
    }

    if (calcHeight < height) {
      this.image.width = calcWidth
      this.image.height = height
      this.image.style.top = 0
      this.image.style.left = `${-(calcWidth - width) / 2}px`
    }
  }

  render() {
    const {
      type,
      range,
      alt,
      src
    } = this.props

    return (
      <ParallaxPanel {...{type, range}}>
        <div 
          className="parallax-image"
          ref={(imageContainer) => { this.imageContainer = imageContainer }}
        >
          <img 
            className="parallax-image__image"
            alt={alt} 
            ref={(image) => { this.image = image }}
          />
          <Loader/>
        </div>
      </ParallaxPanel>
    )
  }
}

ParallaxImage.propTypes = { 
  type: string.isRequired,
  range: number,
  alt: string.isRequired,
  src: string.isRequired
}

export default ParallaxImage
