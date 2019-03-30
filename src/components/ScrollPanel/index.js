import React, { Component } from 'react'
import classNames from 'classnames'
import './styles.css'

class ScrollPanel extends Component {

  scroll(isDown) {
    let top
    let pageYOffset = window.pageYOffset
    const boundingClientRect = this.scrollPanel.getBoundingClientRect()

    if (isDown) {
      top = pageYOffset + ( window.innerHeight + boundingClientRect.top)
    } else {  
      top = (boundingClientRect.top === 0) ? pageYOffset - window.innerHeight : pageYOffset + boundingClientRect.top
    }

    window.scrollTo({
      top,
      left: 0,
      behavior: 'smooth'
    })
  }

  render() {
    const {
      children
    } = this.props

    return (
      <section 
        className={classNames(
          'scroll-panel'
        )}
        ref={(scrollPanel) => { this.scrollPanel = scrollPanel }}
      >
        <button 
          className="scroll-panel__scroll-up"
          onClick={()=>this.scroll(false)}
        >Scroll Up</button>   
        {children}
        <button 
          className="scroll-panel__scroll-down"
          onClick={()=>this.scroll(true)}
        >Scroll Down</button>
      </section> 
    )
  }
}

export default ScrollPanel
