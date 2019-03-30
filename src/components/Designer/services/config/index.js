import  * as THREE from 'three'

const flashAnimateTime = 400
const openAngle = 70
const angleAnimateTime = 300

const colours = {
  blue: 0x1998CB,
  green: 0x14CC60,
  yellow: 0xF0CD13,
  red: 0xEC3C37,
  black: 0x000000,
}

const elements = {
  screw: {
    stl: './stl/screw.stl',
    material: new THREE.MeshPhongMaterial({
      specular: 0x111111, 
      shininess: 200,
      opacity: 0.7,
      transparent: true
    }),
    y: 0.54,
    isEditable: false,
  },
  body: {
    stl: './stl/body.stl',
    material: new THREE.MeshPhongMaterial({
      color: colours.green, 
      specular: 0x111111, 
      shininess: 200,
    }),
    isEditable: true,
    colour: 'green'
  },
  switch: {
    stl: './stl/switch.stl',
    material: new THREE.MeshPhongMaterial({
      color: colours.yellow, 
      specular: 0x111111, 
      shininess: 200,
    }),
    isEditable: true,
    colour: 'yellow'
  },
  handle1: {
    stl: './stl/handle.stl',
    material: new THREE.MeshPhongMaterial({
      color: colours.yellow, 
      specular: 0x111111, 
      shininess: 200, 
    }),
    isEditable: true,
    colour: 'yellow'
  },
  handle2: {
    stl: './stl/handle.stl',
    material: new THREE.MeshPhongMaterial({
      color: colours.yellow,
      specular: 0x111111, 
      shininess: 200,
    }),
    isEditable: true,
    colour: 'yellow',
    rotationY: Math.PI
  }
}

export {
  colours,
  elements,
  flashAnimateTime,
  openAngle,
  angleAnimateTime
}