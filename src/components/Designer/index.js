import React, { Component } from 'react'
import  * as THREE from 'three'
import STLLoader from 'three-stl-loader'
import {
  addResizeEvent
} from 'services/resize'

import ColourSelector from './components/ColourSelector'
import AnimateHandleButton from './components/AnimateHandleButton'
import Loader from 'components/Loader'

import {
  colours,
  elements,
  flashAnimateTime,
  openAngle,
  angleAnimateTime
} from './services/config'
import './styles.css'

class Designer extends Component {

  state = { 
    isColourSelectorVisible: false,
    isStandOpen: false,
    selectedColour: null,
    selectedElementId: null,
    isMoved: false,
    isHandlesOpen: false,
    isAnimatingHandles: false
  }

  isTicking = false
  lastX = 0

  constructor(props) {
    super(props)
    
    // TOUCH/MOUSE/RESIZE EVENTS
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onActionMove = this.onActionMove.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onActionStart = this.onActionStart.bind(this)
    this.onActionEnd = this.onActionEnd.bind(this)
    this.addEventListeners = this.addEventListeners.bind(this)
    this.removeEventListeners = this.removeEventListeners.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    this.setColour = this.setColour.bind(this)
    this.onAnimateHandle = this.onAnimateHandle.bind(this)
  }

  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.top = this.mount.offsetTop
    this.left = this.mount.offsetLeft
    this.height = height
    this.width = width

    //ADD SCENE
    this.scene = new THREE.Scene()

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 15)
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x6de2c3)
    this.scene.fog = new THREE.Fog(0x6de2c9, 2, 20)
    this.camera.position.set(1, 1.5, 2.8)
    this.camera.lookAt(this.scene.position)
    
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    this.renderer.shadowMap.enabled = true

    this.domElement = this.renderer.domElement
    this.mount.appendChild(this.domElement)
  
    // ORBIT CONTROLS (CUSTOM)
    this.camera_pivot = new THREE.Object3D()
    this.Y_AXIS = new THREE.Vector3( 0, 1, 0 )
    this.scene.add( this.camera_pivot )
    this.camera_pivot.add( this.camera )
    this.camera.lookAt( this.camera_pivot.position )
  
    // GROUND PLANE
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(40, 40),
      new THREE.MeshPhongMaterial({ 
        color: 0x6de2c3
  
      })
    )
    plane.rotation.x = - Math.PI / 2
    plane.position.y = - 0.5
    this.scene.add(plane)
    plane.receiveShadow = true

    // LIGHTS
    this.scene.add(new THREE.HemisphereLight(0x443333, 0x111122))
    this.addShadowedLight(1, 1, 1, 0xffffff, 1.35)
    this.addShadowedLight(0.5, 1, - 1, 0x999999, 1)

    // LOADER
    const threeSTLLoader = STLLoader(THREE)
    this.intersectMeshes = [] 
    this.loader = new threeSTLLoader()
    Object.keys(elements).forEach((elementId) => {
      this.loadStl(elementId, elements[elementId])
    })

    // ADD EVENTLISTENERS
    this.addEventListeners()
  }

  addEventListeners() {
    const passiveOption = {
      passive: true
    }
    this.domElement.addEventListener('mousedown', this.onMouseDown, false)
    this.domElement.addEventListener('mouseup', this.onMouseUp, false)
    this.domElement.addEventListener('touchstart', this.onActionStart, passiveOption)
    this.domElement.addEventListener('touchmove', this.onActionMove, passiveOption)
    this.domElement.addEventListener('touchend', this.onActionEnd, passiveOption)

    addResizeEvent(this.onWindowResize)
  }

  removeEventListeners() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown, false)
    this.domElement.removeEventListener('mouseup', this.onMouseUp, false)
    this.domElement.removeEventListener('touchstart', this.onActionStart, false)
    this.domElement.removeEventListener('touchmove', this.onActionMove, false)
    this.domElement.removeEventListener('touchend', this.onActionEnd, false)
  }

  componentWillUnmount(){
    this.removeEventListeners()
  }

  loadStl(id, element) {
    const y = element.y || .5
    const rotationY = element.rotationY || 0

    this.loader.load(element.stl, (geometry) => {

      geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0))

      const mesh = new THREE.Mesh(geometry, element.material)
      mesh.position.set(0, y, 0)
      mesh.scale.set(0.01, 0.01, 0.01)
      mesh.rotation.set(0, rotationY ,  0)
      mesh.castShadow = true
      mesh.receiveShadow = true
        
      mesh.callback = () => {
        this.selectElement(id)
      }
        
      this.scene.add(mesh)

      if (element.isEditable) {
        const selectMaterial =  new THREE.MeshPhongMaterial({
          color: 0xffffff, 
          opacity: 0,
          transparent: true
        })

        const selectMesh = new THREE.Mesh(geometry, selectMaterial)
        selectMesh.position.set(0, y, 0)
        selectMesh.scale.set(0.01, 0.01, 0.01)
        selectMesh.rotation.set(0, rotationY ,  0)

        element.selectMaterial = selectMaterial
        element.mesh = mesh
        element.selectMesh = selectMesh
        
        this.scene.add(selectMesh)
      }
        
      this.intersectMeshes.push(mesh)
      this.renderScene()
    })
  }

  addShadowedLight(x, y, z, color, intensity) {
    const directionalLight = new THREE.DirectionalLight(color, intensity)
    directionalLight.position.set(x, y, z)
    directionalLight.castShadow = true

    this.scene.add(directionalLight)
    
    const d = 1
    directionalLight.shadow.camera.left = - d
    directionalLight.shadow.camera.right = d
    directionalLight.shadow.camera.top = d
    directionalLight.shadow.camera.bottom = - d
    directionalLight.shadow.camera.near = .5
    directionalLight.shadow.camera.far = 8
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.bias = - 0.002
  }

  selectElement(selectedElementId) {
    const element = elements[selectedElementId]

    if (element.isEditable) {
      this.setState({
        selectedElementId,
        selectedColour: element.colour,
        isColourSelectorVisible: true
      })
    
      this.flashSelectedElement()
    } else {
      this.disableColourSelector()
    }
  } 

  animateFlash(start) {
    const {
      selectedElementId
    } = this.state

    const animateProgress = performance.now() - start
    const opacity = 1 - (1 / flashAnimateTime) * animateProgress
    const selectedElement = elements[selectedElementId]

    selectedElement.selectMaterial.opacity = opacity

    if (animateProgress < flashAnimateTime) {
      window.requestAnimationFrame(() => {
        this.animateFlash(start)
      })
    } else {
      selectedElement.selectMaterial.opacity = 0
    }

    this.renderScene()
  }

  flashSelectedElement() {
    const {
      selectedElementId
    } = this.state

    const selectedElement = elements[selectedElementId]
    selectedElement.selectMaterial.opacity = 1
    this.animateFlash(performance.now())
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
    this.isTicking = false
  }

  setColour(selectedColour) {
    const {
      selectedElementId
    } = this.state

    const selectedElement = elements[selectedElementId]
    selectedElement.colour = selectedColour
    selectedElement.material.color.setHex(colours[selectedColour])

    this.setState({
      selectedColour
    })
    
    this.renderScene()
  }

  onMouseDown(event) {
    this.onActionStart(event)
    this.domElement.addEventListener('mousemove', this.onActionMove, false)
  }
  
  onActionMove(event) {
    const {
      isMoved
    } = this.state

    if (!isMoved) {
      this.setState({
        isMoved: true
      })
    }

    if (!this.isTicking) {
      this.isTicking = true
      
      window.requestAnimationFrame(() => {
        let nowX
        if (event.clientX !== undefined) { 
          nowX = event.pageX
        } else if (event.changedTouches[0] !== undefined) {
          nowX = event.changedTouches[0].pageX
        }

        this.camera_pivot.rotateY((this.mouseX - nowX) * (2 * Math.PI)/this.width )
        this.mouseX = nowX

        this.renderScene()  
      })
    }
  }

  onMouseUp(event) {
    this.domElement.removeEventListener('mousemove', this.onActionMove, false)
    this.onActionEnd(event)
  }

  onActionStart(event) {
    this.setState({
      isMoved: false
    })

    if (event.clientX !== undefined) { 
      this.mouseX = event.pageX
    } else if (event.changedTouches[0] !== undefined) {
      this.mouseX = event.changedTouches[0].pageX
    }
  }

  onActionEnd(event) {
    const {
      isMoved
    } = this.state

    if (!isMoved) {
      this.detectIntersect(event)
    }
  }

  disableColourSelector() {
    this.setState({
      isColourSelectorVisible: false,
      selectedColour: null,
      selectedElementId: null,
    })
  }

  detectIntersect(event) {
    const {
      isMoved
    } = this.state

    if (!isMoved) {
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      
      if (event.clientX !== undefined) { 
        mouse.x = ((event.pageX - this.left) / this.width) *2 - 1
        mouse.y = -((event.pageY - this.top) / this.height) *2 + 1
      } else if (event.changedTouches[0] !== undefined) {
        mouse.x = ((event.changedTouches[0].pageX - this.left) / this.width) * 2 - 1
        mouse.y = -((event.changedTouches[0].pageY - this.top) / this.height) * 2 + 1
      }

      raycaster.setFromCamera(mouse, this.camera)

      const intersects = raycaster.intersectObjects(this.intersectMeshes) 

      if (intersects.length > 0) {
        intersects[0].object.callback()
      } else {
        this.disableColourSelector()
      }
    }
  }

  onWindowResize() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    
    this.top = this.mount.offsetTop
    this.left = this.mount.offsetLeft
    this.height = height
    this.width = width

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height) 

    this.renderScene()
  }

  onAnimateHandle() {
    const {
      isAnimatingHandles,
      isHandlesOpen
    } = this.state

    if (!isAnimatingHandles) {
      this.animateHandle(performance.now(), isHandlesOpen)
      this.setState({
        isAnimatingHandles: true,
        isHandlesOpen: !isHandlesOpen
      })
    }
  }

  animateHandle(start, isHandlesOpen) {
    const animateProgress = performance.now() - start
    let angle = (openAngle / angleAnimateTime) * animateProgress
  
    if (isHandlesOpen) {
      angle = openAngle - angle
      angle = (angle < 0)? 0: angle
    } else {
      angle = (angle > openAngle)? openAngle: angle
    }
  
    elements.handle1.mesh.rotation.x = THREE.Math.degToRad(angle)
    elements.handle1.selectMesh.rotation.x = THREE.Math.degToRad(angle)
    elements.handle2.mesh.rotation.x = -THREE.Math.degToRad(angle)
    elements.handle2.selectMesh.rotation.x = -THREE.Math.degToRad(angle)
  
    this.renderScene()
  
    if (animateProgress < angleAnimateTime) {
      window.requestAnimationFrame(() => {
        this.animateHandle(start, isHandlesOpen)
      })
    } else {
      this.setState({
        isAnimatingHandles: false
      })
    }
  }

  render() {
    const { 
      isColourSelectorVisible,
      selectedColour
    } = this.state

    return (
      <div 
        className="designer" 
        ref={(mount) => { this.mount = mount }}
      >
        <ColourSelector 
          setColour={this.setColour}
          {...{
            isColourSelectorVisible,
            selectedColour
          }}
        /> 
        <AnimateHandleButton
          onAnimateHandle = {this.onAnimateHandle}
        />   
        <Loader/>
      </div>
    )
  }
}

export default Designer
