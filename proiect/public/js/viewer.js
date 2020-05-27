let map
let markers = new Map()
 
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('/')

  socket.on('locationsUpdate', locations => {
    markers.forEach((marker, id) => {
      marker.setMap(null)
      markers.delete(id)
    })

    locations.forEach(([id, position]) => {
      if (position.lat && position.lng) {
        const marker = new google.maps.Marker({
          position,
          map,
          label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '25px',
        text: "driver",
        backgroundColor: 'black'
      },
      icon:{
        url: 'driver.png',
        scaledSize: new google.maps.Size(60, 60),
        //origin: new google.maps.Point(0,0), // origin
        //anchor: new google.maps.Point(0, 0)
      }
        })
       
      }
    })
  })

  setInterval(() => {
    socket.emit('requestLocations')
  }, 2000)
})

function initMap() {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 10
    })
  }, err => {
    console.error(err)
  })
}


