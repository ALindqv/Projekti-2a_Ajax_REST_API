/**
 * Code sections
 * 1. Global variables
 * 2. Api requests
 * 3. Handling data
 * 4. Content for artist div
 * 5. Content for album div
 * 6. Event listeners
 */


//#region 1. Global variables

const API_KEY = ''

const artist = 'Demilich'
const album = 'Preserved in Torment'

/*
const API_REQUEST = new URL('http://ws.audioscrobbler.com/2.0/');
API_REQUEST.searchParams.set('method', 'album.getinfo');
API_REQUEST.searchParams.set('api_key', API_KEY);
API_REQUEST.searchParams.set('artist', artist);
API_REQUEST.searchParams.set('album', album)
API_REQUEST.searchParams.set('format', 'json') */

const artistDiv = document.querySelector('.artistInformation');
const albumDiv = document.querySelector('.albumInformation');
const trackLstDiv = document.querySelector('.trackList');
const albumLstPlaceholder = document.querySelector('#albumDivInit')

const artistInput = document.querySelector('.searchInput');
const artistSearchForm = document.querySelector('.artistSearch');
const searchBtn = document.querySelector('.searchButton');

const artistList = document.querySelector('.artistList')
const artistButtons = document.querySelectorAll('.artistChoice');
const albumButtons = document.querySelectorAll('.albumEntry');

//#endregion

//#region 2. Api requests

const getArtistAlbums = (artist) => {
    API_REQUEST = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`
    fetch(API_REQUEST)
        .then(response => {
          if (!response.ok) {
            throw new Error('Virhe')
          } 
          return response.json();
        })
        .then(data => {
            renderArtist(data);
        })
        .catch(error => {
            console.error('Virhe', error)
        })
}

const getArtistInfo = (artist) => {
    const API_REQUEST = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`
    return fetch(API_REQUEST)
        .then((response) => 
          {return response.json().then((data) => {
          console.log(data);
          return data;
        })})
} 

const getAlbumInfo = (artist, album) => {
    const API_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
    fetch(API_REQUEST)
        .then(response => {
          if (!response.ok) {
            throw new Error('Virhe')
          } 
          return response.json();
        })
        .then(data => {
          renderAlbum(data);
        })
        .catch(error => {
          console.error('Virhe', error)
        })
}

//#endregion

//#region 3. Handling data

//Normalising track data into array to handle single track albums correctly
const normaliseTracks = (tracks) => {
    if (Array.isArray(tracks)) {
        return tracks;
    } else if (tracks == null) {
        return [];
    } else {
        return [tracks]
    }
}

//API data for track duration is in seconds, format to look better 
const durationFormat = (duration) => {
    const initVal = Math.max(0, Number(duration) || 0);
    const hours = Math.floor(initVal / 3600);
    const mins = Math.floor((initVal % 3600) / 60);
    const secs = Math.floor(initVal % 60);

    //formatting seconds display to either h:mm:ss or m:ss
    return hours > 0  
    ? `${hours}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}` 
    : `${mins}:${String(secs).padStart(2, '0')}` || 'N/A'
}

//#endregion

//#region 4. Content for artist div

const createAlbumList = (data) => {
    const albums = data.topalbums
    const albumListFrag = document.createDocumentFragment();
    const albumUl = document.createElement('ul')
        albumUl.classList.add('albumList')
    
    albums.album.forEach(album => {
        const albumLi = Object.assign(document.createElement('li'), {
            textContent: album.name
        })
        albumUl.appendChild(albumLi)
    })
    albumUl.addEventListener('click', (e) => {
    const li = e.target.closest('.albumList > li');
        if (!li || !albumUl.contains(li)) return; //Ignore clicks outside intended elements
        getAlbumInfo(artist, li.textContent.trim())
    })
    albumListFrag.append(albumUl)
    artistDiv.append(albumListFrag)
}

const getActivity = () => {
  let jsonData;
  getArtistInfo('Wormrot').then((data) => {
    jsonData = data
    console.log(jsonData)
  })
}

//Render artist information div content
const renderArtist = (data) => {
    artistDiv.innerHTML = '';

    const artistHead = document.createElement('h1');
        artistHead.classList.add('artistName');
        artistHead.textContent = data.topalbums.album[0].artist.name

    const artistBio = Object.assign(document.createElement('textarea'), {
        id: 'artistBio',
        textContent: 'Artist description',
        readOnly: 'true',
    });
        

    const albumListHead = document.createElement('h2')
        albumListHead.classList.add('albumListHeading')
        albumListHead.textContent = 'Releases'
    
    artistDiv.append(artistHead, artistBio, albumListHead)
    createAlbumList(data)
}

//#endregion

//#region 5. Content for album div

// Create content for album div
const albumInfo = (title, value) => {
    const row = document.createElement('tr');
    const heading = document.createElement('th'); 
        heading.scope = 'row';
        heading.textContent = title;

    const info = document.createElement('td');
        info.textContent = value ?? 'N/A';

    row.append(heading, info);
    return row
}


const createTracklist = (data) => {
    const tracks = data?.album?.tracks?.track;
    const tracklist = normaliseTracks(tracks)

    if (tracklist.length === 0) {
        const noTracks = document.createElement('p');
            noTracks.textContent = 'Tracks not available';
            albumDiv.appendChild(noTracks);
            return;
    }

    const tbl = document.createElement('table')
    tbl.classList.add('tracklistTbl')

    //colgroup and col elements for the table for styling
    const colGr = document.createElement('colgroup');
    const colClasses = ['numCol', 'titleCol', 'durationCol']
    colClasses.forEach(className => {
        const colElem = document.createElement('col');
        colElem.classList.add(className);
        colGr.appendChild(colElem)
    }); tbl.appendChild(colGr)

    const tHead = tbl.createTHead();
    const tBody = tbl.createTBody();
    const tFoot = tbl.createTFoot();

    const slHeadRow = tHead.insertRow();
    
    const songListFrag = document.createDocumentFragment();
    ['#', 'Title', 'Duration'].forEach(label => {
      const songListHead = document.createElement('th');
        songListHead.scope = 'col';
        songListHead.textContent = label;
        songListHead.classList.add(`track${label}`);
      songListFrag.appendChild(songListHead);
    }); slHeadRow.append(songListFrag)
    
    //Looping tracks info into the table
    
    tracklist.forEach(track => { 
      const formattedDuration = durationFormat(track.duration)
      const trackInfo = tBody.insertRow();
      [track['@attr'].rank, track.name, formattedDuration].forEach(value => {
        const trackData = trackInfo.insertCell();
        trackData.textContent = value;
      })
    })
    
    //Create table footer for displaying total album runtime
    const songListFooter = tFoot.insertRow();
    const slFooterHead = document.createElement('th');
        slFooterHead.scope = 'row';
        slFooterHead.colSpan = '2';
        slFooterHead.textContent = 'Total runtime'
    songListFooter.appendChild(slFooterHead)
    
    //Calculate total album runtime from duration array, starting sum at 0
    let total = tracklist.reduce((sum, track) => sum + Number(track.duration || 0), 0)


    // Display runtime in the footer
    const formattedRuntime = document.createElement('td');
    formattedRuntime.textContent = durationFormat(total);
    songListFooter.appendChild(formattedRuntime);

    
    albumDiv.appendChild(tbl);
}

const renderAlbum = (data) => {
  albumDiv.innerHTML = '';
  
  // Album information
    const albumInfoTbl = document.createElement('table');
        albumInfoTbl.classList.add('albumInfoTbl');
  
    const albumCover = document.createElement('img');
        albumCover.classList.add('albumCover');
        albumCover.src = data.album.image[3]['#text'];
  
  
  
  const albumInfoHeading = document.createElement('h2')
    albumInfoHeading.classList.add('tracklistHeading');
    albumInfoHeading.textContent = 'Tracklist';

  //Populate info table with API data
  albumInfoTbl.append(
    albumInfo('Artist', data.album.artist),
    albumInfo('Album', data.album.name),
    albumInfo('Release', '1993')
  )
  

  albumDiv.append(albumCover, albumInfoTbl, albumInfoHeading)
  createTracklist(data)
}

//#endregion

//#region 6. Event Listeners

//Event listener for li elements using event delegation
artistList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
        albumDiv.textContent = '';
        artistDiv.textContent = '';
        if (!li || !artistList.contains(li)) return; // Ignore clicks outside the li elements
        getArtistAlbums(li.textContent.trim())
        //getActivity()
})



artistSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const artistValue = artistInput.value.trim(); 
  
  getArtistAlbums(artistValue)
})

//#endregion