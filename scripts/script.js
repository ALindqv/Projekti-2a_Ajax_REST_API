API_KEY = ''

const artistInfo = document.querySelector('.artistInformation');
const albumInfo = document.querySelector('.albumInformation');
const trackLst = document.querySelector('.trackList')

const artistInput = document.querySelector('#search');
const searchBtn = document.querySelector('.searchButton')


data = ''

const getArtistInfo= () => {
    API_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${API_KEY}&format=json`
    fetch(API_REQUEST)
        .then(response => response.json()
        .then(data => parseData(data)))
        .catch(error => console.error('Virhe', error))
}
/*
const getAlbumInfo = () => {
    //API_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
    API_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=Wormrot&album=Dirge&format=json`
    fetch(API_REQUEST)
        .then(response => {
          if (!response.ok) {
            throw new Error('Virhe')
          } 
          return response.json();
        })
        .then(d => {
          data=d;
          renderInformation();
        })
        .catch(error => {
          console.error('Virhe')
        })
}*/


// API Request returns track duration in seconds, formatting to mm:ss
const durationToMinutes = (duration) => {

    const seconds = Math.max(0, Number(duration) || 0)
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`
}
/*
const totalDurationCount = () => {

}*/

const createSonglist = () => {
    const tracks = data.album.tracks
    const tbl = document.createElement('table')
    tbl.classList.add('tracklistTbl')

    const tHead = tbl.createTHead();
    const tBody = tbl.createTBody();
    const tFoot = tbl.createTFoot();

    const headers = tHead.insertRow();
    ['#', 'Title', 'Duration'].forEach(label => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      th.classList.add(`track${label}`);
      headers.appendChild(th);
    })

    tracks.track.forEach(track => {
      formatted = durationToMinutes(track.duration)
      const trackInfo = tBody.insertRow();
      [track['@attr']?.rank, track.name, formatted].forEach(value => {
        const trackData = trackInfo.insertCell();
        trackData.textContent = value;
      })
    })
    /*
    const footer = tFoot.insertRow();
    ['','',tracks.track[1].duration].forEach(val => {

    })*/ 
    
    trackLst.appendChild(tbl);
}



const renderInformation = () => {
    const albumData = data.album;

    const artistName = document.createElement('h1')
    artistName.classList.add('artistName')
    artistName.textContent = albumData.artist

    const albumCover = document.createElement('img')
    albumCover.classList.add('albumCover')
    albumCover.src = albumData.image[3]['#text']
    
    const albumInfoHeading = document.createElement('h2')
    albumInfoHeading.classList.add('albumInfoHeading')
    albumInfoHeading.textContent = 'Album Information'
    
    // Album information
    const albumInfoTbl = document.createElement('table');
    albumInfoTbl.classList.add('albumInfoTbl');

    const artistTr = document.createElement('tr')
    const artistTh = document.createElement('th')
    const artistTd = document.createElement('td')
    
    artistTh.textContent = 'Artist'
    artistTd.textContent = albumData.artist

    artistTr.append(artistTh, artistTd)

    const albumTr = document.createElement('tr')
    const albumTh = document.createElement('th')
    const albumTd = document.createElement('td')
    
    albumTh.textContent = 'Album'
    albumTd.textContent = albumData.name

    albumTr.append(albumTh, albumTd)

    const releaseTr = document.createElement('tr')
    const releaseTh = document.createElement('th')
    const releaseTd = document.createElement('td')
    
    releaseTh.textContent = 'Release'
    releaseTd.textContent = '1993'

    releaseTr.append(releaseTh, releaseTd)

    albumInfoTbl.append(artistTr, albumTr, releaseTr)

    

    createSonglist()

    artistInfo.appendChild(artistName)
    albumInfo.append(albumCover, albumInfoHeading, albumInfoTbl)
}

searchBtn.addEventListener('click', renderInformation);