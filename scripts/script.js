const API_KEY = ''

const artist = 'Alkaloid'
const album = 'Liquid Anatomy'

/*
const API_REQUEST = new URL('http://ws.audioscrobbler.com/2.0/');
API_REQUEST.searchParams.set('method', 'album.getinfo');
API_REQUEST.searchParams.set('api_key', API_KEY);
API_REQUEST.searchParams.set('artist', artist);
API_REQUEST.searchParams.set('album', album)
API_REQUEST.searchParams.set('format', 'json') */



const artistDiv = document.querySelector('.artistInformation');
const albumDiv = document.querySelector('.albumInformation');
const trackLst = document.querySelector('.trackList')

const artistInput = document.querySelector('#search');
const searchBtn = document.querySelector('.searchButton')

const getArtistInfo= () => {
    API_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${API_KEY}&format=json`
    fetch(API_REQUEST)
        .then(response => response.json()
        .then(data => parseData(data)))
        .catch(error => console.error('Virhe', error))
}

const getAlbumInfo = () => {
    const API_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
    fetch(API_REQUEST)
        .then(response => {
          if (!response.ok) {
            throw new Error('Virhe')
          } 
          return response.json();
        })
        .then(data => {
          renderInfo(data);
        })
        .catch(error => {
          console.error('Virhe', error)
        })
}


// API Request returns track duration in seconds, formatting to mm:ss
const durationFormat = (duration) => {
    const initVal = Math.max(0, Number(duration) || 0);
    const hours = Math.floor(initVal / 3600);
    const mins = Math.floor((initVal % 3600) / 60);
    const secs = Math.floor(initVal % 60);
    return hours > 0  
    ? `${hours}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}` : `${mins}:${String(secs).padStart(2, '0')}`
}


// Create content for album div
const albumInfo = (title, value) => {
    const row = document.createElement('tr');
    const heading = document.createElement('th'); 
    heading.scope = 'row';
    heading.textContent = title;

    const info = document.createElement('td');
    info.textContent = value ?? '';

    row.append(heading, info);
    return row
}

const createSonglist = (data) => {
    const tracks = data.album.tracks
    const tbl = document.createElement('table')
    tbl.classList.add('tracklistTbl')

    const tHead = tbl.createTHead();
    const tBody = tbl.createTBody();
    const tFoot = tbl.createTFoot();

    const hRow = tHead.insertRow();
    
    const songListFrag = document.createDocumentFragment();
    ['#', 'Title', 'Duration'].forEach(label => {
      const songListHead = document.createElement('th');
      songListHead.scope = 'col';
      songListHead.textContent = label;
      songListHead.classList.add(`track${label}`);
      songListFrag.appendChild(songListHead);
    })
    hRow.append(songListFrag)
    
    //Looping track info into the table
    tracks.track.forEach(track => {
      formatted = durationFormat(track.duration)
      const trackInfo = tBody.insertRow();
      [track['@attr']?.rank, track.name, formatted].forEach(value => {
        const trackData = trackInfo.insertCell();
        trackData.textContent = value;
      })
    })
    
    //Table footer for displaying total album runtime
    const songListFooter = tFoot.insertRow();
    const slFooterHead = document.createElement('th');
    slFooterHead.scope = 'row';
    slFooterHead.colSpan = '2';
    slFooterHead.textContent = 'Total runtime'
    songListFooter.appendChild(slFooterHead)
    
    let total = 0;
    tracks.track.forEach(track => {
      total += track.duration;
    })
    const formattedTotal = document.createElement('td')
    formattedTotal.textContent = durationFormat(total)
    songListFooter.appendChild(formattedTotal)

     
    
    trackLst.appendChild(tbl);
}



const renderInfo = (data) => {
    const albumCover = document.createElement('img')
    albumCover.classList.add('albumCover')
    albumCover.src = data.album.image[3]['#text']
    
    const albumInfoHeading = document.createElement('h2')
    albumInfoHeading.classList.add('albumInfoHeading')
    albumInfoHeading.textContent = 'Album Information'
    
    // Album information
    const albumInfoTbl = document.createElement('table');
    albumInfoTbl.classList.add('albumInfoTbl');


    albumInfoTbl.append(
      albumInfo('Artist', data.album.artist),
      albumInfo('Album', data.album.name),
      albumInfo('Release', '1993')
    )
    

    albumDiv.append(albumCover, albumInfoHeading, albumInfoTbl)
    createSonglist(data)
}

searchBtn.addEventListener('click', getAlbumInfo);