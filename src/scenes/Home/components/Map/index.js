import React, { Component } from 'react'
import {addResizeEvent} from 'services/resize'
import Loader from 'components/Loader'
import {
  mapboxToken,
  defaultLng,
  defaultLat,
  defaultZoom,
  circleRadius
} from './services/config'
import './styles.css'

class Map extends Component {
  constructor() {
    super()
    this.getLocation = this.getLocation.bind(this)
  }

  componentDidMount() {
    addResizeEvent(this.getLocation)

    this.mapImage = new Image()
    this.mapContainer.appendChild(this.mapImage)
    this.getLocation()
  }

  getMapBoxString(options) {
    const {
      geojson,
      longitude,
      latitude,
      width,
      height
    } = options

    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/geojson(${encodeURI(JSON.stringify(geojson))})/${longitude},${latitude},${defaultZoom}/${width}x${height}?access_token=${mapboxToken}`
  }

  getLocation() {
    const width = (this.mapContainer.clientWidth > 1280) ? 1280 : this.mapContainer.clientWidth
    const height = this.mapContainer.clientHeight
       
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const {
          latitude,
          longitude
        } = position.coords
        
        const geojson = this.createGeoJSONCircle([longitude, latitude], circleRadius)
        this.mapImage.src = this.getMapBoxString({
          geojson,
          longitude,
          latitude,
          width,
          height
        })
        
      })
    } else {
      const geojson = this.createGeoJSONCircle([defaultLng, defaultLat], circleRadius)
      this.mapImage.src = this.getMapBoxString({
        geojson,
        longitude: defaultLng,
        latitude: defaultLat,
        width,
        height
      })
    }
  }

  createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64

    const coords = {
      latitude: center[1],
      longitude: center[0]
    }

    const km = radiusInKm
    const ret = []
    const distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180))
    const distanceY = km/110.574

    let theta
    let x
    let y
    let i = 0

    for(; i < points; i += 1) {
      theta = (i/points)*(2*Math.PI)
      x = distanceX*Math.cos(theta)
      y = distanceY*Math.sin(theta)
      ret.push([coords.longitude+x, coords.latitude+y])
    }

    ret.push(ret[0])

    return {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [ret]
      },
      'properties': {
        'name': 'GPGP',
      }
    }
  }

  render() {
    return (
      <div className="map" ref={(mapContainer) => { this.mapContainer = mapContainer }}>
        <Loader/>
      </div>
    )
  }
}

export default Map
