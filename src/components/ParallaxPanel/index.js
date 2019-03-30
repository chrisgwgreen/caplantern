import React, { Component } from 'react'
import {addResizeEvent} from 'services/resize'
import {
  element
} from 'prop-types'
import './styles.css'

class ParallaxPanel extends Component {

  top = 0
  height = 0
  range = 0
  state = {
    y: 0
  }
  isTicking = false

  constructor() {
    super()

    this.onResizeEvent = this.onResizeEvent.bind(this)
    this.fixedParallax = this.fixedParallax.bind(this)  
    this.rangeParallax = this.rangeParallax.bind(this)    
    this.lockingParallax = this.lockingParallax.bind(this) 
    this.scroll = this.scroll.bind(this) 
  }
  
  onResizeEvent() {
    const boundingClientRect = this.parallax.getBoundingClientRect()
    this.top = Math.ceil(boundingClientRect.top + window.scrollY)
    this.height = boundingClientRect.height
  }

  componentDidMount() {
    const {
      type, 
      range
    } = this.props

    this.onResizeEvent()
    addResizeEvent(this.onResizeEvent)
    
    switch(type) {
    case 'fixed':
      this.parallaxEvent = this.fixedParallax
      break
    case 'range':
      this.parallaxEvent = this.rangeParallax
      this.range = range || 400
      break
    case 'locking':
      this.parallaxEvent = this.lockingParallax
      break
    default:
      this.parallaxEvent = this.lockingParallax
    }

    window.addEventListener('scroll', this.parallaxEvent, {
      passive: true
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.parallaxEvent, false)
  }

  scroll() {
    if(!this.isTicking) {
      this.isTicking = true
      window.requestAnimationFrame(() => {
        this.parallaxEvent()
      })
    }
  }

  rangeParallax() {
    let scrollY = window.scrollY
    scrollY = (scrollY < 0) ? 0 : scrollY

    if (scrollY < this.top + this.height && scrollY >= this.top - this.height)
      this.setState({
        y: -Math.ceil(((this.top - scrollY)/ this.height) * this.range)
      })
    this.isTicking = false  
  }

  fixedParallax() {    
    
    let scrollY = window.scrollY
    scrollY = (scrollY < 0) ? 0 : scrollY

    if (scrollY < this.top + this.height && scrollY >= this.top - this.height)
      this.setState({
        y: Math.ceil(scrollY - this.top)
      })
    this.isTicking = false    
  }

  lockingParallax() {
    let scrollY = window.scrollY
    scrollY = (scrollY < 0) ? 0 : scrollY
    
    if (scrollY < this.top  && scrollY >= this.top - this.height) {
      this.setState({
        y: Math.ceil(scrollY - this.top)
      })  
    } else if (this.state.y !== 0) {
      this.setState({
        y: 0
      })
    }

    this.isTicking = false  
  }

  render() {
    const {
      children
    } = this.props
    const {
      y
    } = this.state

    return (
      <section className="parallax-panel" ref={(parallax) => { this.parallax = parallax }}>
        <div 
          className="parallax-panel__container"
          style={{
            transform: `translateY(${y}px)`,
          }}
        > 
          {children}
        </div>
      </section> 
    )
  }
}

ParallaxPanel.propTypes = {
  children: element.isRequired
}

export default ParallaxPanel
