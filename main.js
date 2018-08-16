var input = ''
var artistsarray = []
var resultsarray = []

var results = document.querySelector('.results')
document.querySelector('#search').addEventListener('click', function search(e) {
  e.preventDefault()
  input = document.querySelector('input').value
  console.log(input)
  results = document.querySelector('.results')
  while (results.hasChildNodes()) {
    results.removeChild(results.lastChild)
  }
  results.innerHTML = `Now Searching for ${input}...`
  fetch(`https://api.soundcloud.com/users/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f&q=${input}`)
    .then(function(response) {
      results.innerHTML = ''
      return response.json()
    })
    .then(function artistsearch(json) {
      console.log(json)
      for (var i = 0; i < json.length; i++) {
        var artistwrapper = document.createElement('div')
        artistwrapper.className = 'artistwrapper'
        var artistimg = document.createElement('img')
        artistimg.src = json[i].avatar_url
        artistimg.id = 'clickimg'
        artistwrapper.appendChild(artistimg)
        var artistname = document.createElement('span')
        artistname.innerHTML = json[i].username
        artistwrapper.appendChild(artistname)
        var artistid = document.createElement('div')
        artistid.id = json[i].id
        artistwrapper.appendChild(artistid)
        results.appendChild(artistwrapper)
      }
      artistsarray = document.querySelectorAll('.artistwrapper')
      for (var i = 0; i < artistsarray.length; i++) {
        artistsarray[i].childNodes[0].addEventListener('click', function() {
          while (results.hasChildNodes()) {
            results.removeChild(results.lastChild)
          }
          var backbutton = document.createElement('a')
          backbutton.className = 'material-icons'
          backbutton.id = 'back'
          backbutton.className = 'btn-floating btn-large waves-effect waves-light blue'
          backbutton.innerHTML = 'back'

          document.querySelector('.search-form').appendChild(backbutton)
          var artist = this.parentNode.childNodes[2].id
          results.innerHTML = `Now Searching for songs...`
          fetch(`https://api.soundcloud.com/users/${artist}/tracks/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f`)
            .then(function(response2) {
              results.innerHTML = ''
              return response2.json()
            })
            .then(function(json2) {
              for (var i = 0; i < json2.length; i++) {
                var resultwrapper = document.createElement('div')
                resultwrapper.className = 'resultwrapper'
                var songimage = document.createElement('img')
                songimage.src = json2[i].artwork_url
                songimage.id = 'clickimg'
                resultwrapper.appendChild(songimage)
                var songtitle = document.createElement('span')
                songtitle.innerHTML = json2[i].title
                resultwrapper.appendChild(songtitle)
                var artistname = document.createElement('h3')
                artistname.innerHTML = json2[i].user.username
                resultwrapper.appendChild(artistname)
                var songurl = document.createElement('div')
                songurl.id = json2[i].stream_url
                resultwrapper.appendChild(songurl)
                var results = document.querySelector('.results')
                results.appendChild(resultwrapper)
              }
              resultsarray = document.querySelectorAll('.resultwrapper')
              return json2
            })
            .then(function(json2) {
              for (var j = 0; j < resultsarray.length; j++) {
                resultsarray[j].childNodes[0].addEventListener('click', function() {
                  var musiclink = this.parentNode.childNodes[3].id + '/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f'
                  var playback = document.querySelector('audio')
                  playback.src = musiclink
                  playback.autoplay = 'autoplay'
                  var canvas = document.querySelector('canvas')
                  var ctx = canvas.getContext('2d')
                  var audio = document.querySelector('audio')
                  audio.crossOrigin = 'anonymous'
                  var audioContext = new AudioContext()
                  var source = audioContext.createMediaElementSource(audio)
                  var analyser = audioContext.createAnalyser()
                  source.connect(analyser)
                  analyser.connect(audioContext.destination)

                  setInterval(function() {
                    var freqData = new Uint8Array(analyser.frequencyBinCount)
                    var height = 300
                    var width = 10
                    analyser.getByteFrequencyData(freqData)

                    ctx.clearRect(0, 0, 1000, 300)

                    for (var i = 0; i < freqData.length; i++) {
                      var magnitude = freqData[i] / 2
                      ctx.fillRect(i * 1.5, height, 1, -magnitude * 2)
                    }
                  }, 33)
                })
              }
              document.querySelector('#back').addEventListener('click', function() {
                while (results.hasChildNodes()) {
                  results.removeChild(results.lastChild)
                }
                document.querySelector('.search-form').removeChild(document.querySelector('.search-form').lastChild)
                artistsearch(json)
              })
            })
        })
      }
    })
})
