import React, { Component } from 'react'
import {addResizeEvent} from 'services/resize'
import mapboxgl from 'mapbox-gl'
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

    this.repositionMap = this.repositionMap.bind(this)
    this.getLocation = this.getLocation.bind(this)
  }

  componentDidMount() {
    addResizeEvent(this.repositionMap)
    this.repositionMap()

    mapboxgl.accessToken = mapboxToken
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9', 
      center: [defaultLng, defaultLat], 
      zoom: defaultZoom
    })
    this.map.scrollZoom.disable()
    this.map.on('load', () => this.getLocation())
  }

  renderCircle(lng, lat) {
    this.map.addSource('polygon', this.createGeoJSONCircle([lng, lat], circleRadius))
  
    this.map.addLayer({
      'id': 'polygon',
      'type': 'fill',
      'source': 'polygon',
      'layout': {},
      'paint': {
        'fill-color': 'blue',
        'fill-opacity': 0.6
      }
    })
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.map.flyTo({
          center: [
            position.coords.longitude,
            position.coords.latitude,
          ]
        })
        this.renderCircle(position.coords.longitude, position.coords.latitude)
      })
    } else {
      this.map.addSource('polygon', this.createGeoJSONCircle([defaultLng, defaultLat], circleRadius))
    }
  }
  
  updateMapPosition(position) {
    console.log(position)
  }

  repositionMap() {

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
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [ret]
          }
        }]
      }
    }
  }

  render() {
    return (
      <div className="map" ref={(mapContainer) => { this.mapContainer = mapContainer }}></div>
    )
  }
}

export default Map
