let resizeEvents = []
let resizeDebounce

const initResize = () => { 
  window.addEventListener('resize', processResize, false)
}

const addResizeEvent = (event) => { 
  resizeEvents.push(event)
}

const clearResizeEvents = (event) => { 
  resizeEvents = []
}

const processResize= () => {
  clearTimeout(resizeDebounce)

  resizeDebounce = setTimeout(() => {
    resizeEvents.forEach(event => {
      window.requestAnimationFrame(() => event())
    })
  }, 200)
}

export {
  initResize,
  addResizeEvent,
  clearResizeEvents
} 