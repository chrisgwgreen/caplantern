import React, { Component } from 'react'
import {isWebGLAvailable} from 'services/webgl'

import ParallaxPanel from 'components/ParallaxPanel'
import Designer from 'components/Designer'
import HeroVideo from 'components/HeroVideo'
import ParallaxImage from 'components/ParallaxImage'
import ContentContainer from 'components/ContentContainer'
import CopyContainer from 'components/CopyContainer'
import Map from './components/Map'

class Home extends Component {
  render() {
    const designer = (isWebGLAvailable()) ? <Designer/> : null
    
    return (
      <div className="home">        
        <HeroVideo 
          src={'https://player.vimeo.com/video/272984380?api=1&background=1&muted=1&loop=1&autoplay=1'}
        /> 

        <ContentContainer 
          colour="yellow"
          leftContent={
            <img src="./images/bottle.png" alt="bottle" height="599px"/>
          }
          rightContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
        />

        <ParallaxImage type="range" range={200} src="./images/bottles1.jpg" alt="Waste Plastic"/>
        
        <ParallaxPanel type="locking">
          <Map/>
        </ParallaxPanel>

        <ContentContainer 
          colour="red"
          leftContent={
            <img src="./images/bottle.png" alt="bottle" height="599px"/>
          }
          rightContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
        />

        <ParallaxImage type="range" range={200} src="./images/ocean.jpg" alt="Natural Image"/>
        
        <ContentContainer 
          colour="white"
          leftContent={
            <img src="./images/bottle.png" alt="bottle" height="599px"/>
          }
          rightContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
        />

        <ContentContainer 
          colour="dark-blue"
          leftContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
          rightContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
        />
        
        <ParallaxImage type="range" range={300} src="./images/unfolded-blue.png" alt="Natural Image"/>
        
        <ContentContainer 
          colour="light-blue"
          leftContent={
            <img src="./images/bottle.png" alt="bottle" height="599px"/>
          }
          rightContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
        />

        {designer}
        
        <ContentContainer 
          colour="yellow"
          leftContent={
            <img src="./images/bottle.png" alt="bottle" height="599px"/>
          }
          rightContent={
            <CopyContainer
              title="The Great Pacific Garbage Patch" 
              copy="The Great Pacific Garbage Patch is the largest accumulation of ocean plastic in the world covering an estimated surface of 1.6 million square kilometers."
            />
          }
        />

        <ParallaxImage type="range" range={400} src="./images/campfire.jpg" alt="Natural Image"/>
        
        <div className="home-container home-container--black">
          FOOTER
        </div>    
      </div>
    )
  }
}

export default Home
