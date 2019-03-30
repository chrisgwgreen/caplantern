import React, { Component } from 'react'
import {string} from 'prop-types'
import { addResizeEvent } from 'services/resize'
import './styles.css'

import ParallaxPanel from 'components/ParallaxPanel'
import Loader from 'components/Loader'

class HeroVideo extends Component {

  constructor() {
    super()
    this.repositionVideo = this.repositionVideo.bind(this)
  }

  componentDidMount(){
    this.repositionVideo()
    addResizeEvent(this.repositionVideo)
  }

  repositionVideo() {
    const width =  this.hero.clientWidth
    const height = this.hero.clientHeight
    const calcWidth = 16 * (height / 9)
    const calcHeight = 9 * (width / 16)

    if (calcWidth < width) {
      this.iframe.width = width
      this.iframe.height = calcHeight
      this.iframe.style.top = `${-(calcHeight - height) / 2}px`
      this.iframe.style.left = 0
    }

    if (calcHeight < height) {
      this.iframe.width = calcWidth
      this.iframe.height = height
      this.iframe.style.top = 0
      this.iframe.style.left = `${-(calcWidth - width) / 2}px`
    }
  }

  render() {
    const {
      src
    } = this.props
    return (
      <ParallaxPanel type="fixed">
        <div className="hero-video" ref={(hero) => { this.hero = hero }}>
          <iframe 
            className="hero-video__iframe"
            title="hero-video"
            ref={(iframe) => { this.iframe = iframe }}
            src={src}
            allow="autoplay"
          ></iframe>
          <Loader/>
        </div>
      </ParallaxPanel>
    )
  }
}

HeroVideo.propTypes = { 
  src: string.isRequired,
}

export default HeroVideo
