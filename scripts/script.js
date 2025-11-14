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

//DOM elements
const artistDiv = document.querySelector('.artistInformation');
const albumDiv = document.querySelector('.albumInformation');
const trackLstDiv = document.querySelector('.trackList');
const albumLstPlaceholder = document.querySelector('#albumDivInit')

const artistInput = document.querySelector('.searchInput');
const artistSearchForm = document.querySelector('.artistSearch');
const searchBtn = document.querySelector('.searchButton');

const artistList = document.querySelector('.artistList')

const nullReplace = 'N/A'

//#endregion

//#region 2. Api requests

const getArtistInfo = async artist => {
  const res = await fetch(`/api?action=artistInfo&artist=${encodeURIComponent(artist)}`);
  if (!res.ok) throw new Error(`Artist info request error: ${res.status}`);
  return res.json();
}

const getArtistAlbums = async artist => {
  const res = await fetch(`/api?action=artistAlbums&artist=${encodeURIComponent(artist)}`)
  if (!res.ok) throw new Error(`Albums request error: ${res.status}`);
  return res.json();
}

const getAlbumInfo = async (artist, album) => {
  const res = await fetch(`/api?action=albumInfo&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
  if (!res.ok) throw new Error(`Album info request error: ${res.status}`) 
  return res.json();
}


//#endregion

//#region 3. Handling data

//Handling single track or missing tracks albums
const normaliseTracks = (tracks) => {
    if (Array.isArray(tracks)) {
        return tracks;
    } else if (tracks == null) {
        return [];
    } else {
        return [tracks];
    }
}

//API data for track duration is in seconds, format to look better 
const durationFormat = (duration) => {
    if (duration === null) return nullReplace; //Consistent display for null values

    const initVal = Math.max(0, Number(duration) || 0);
    const hours = Math.floor(initVal / 3600);
    const mins = Math.floor((initVal % 3600) / 60);
    const secs = Math.floor(initVal % 60);

    //formatting seconds display to either h:mm:ss or m:ss
    return hours > 0  
    ? `${hours}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}` 
    : `${mins}:${String(secs).padStart(2, '0')}`
}

//LastFM data does not offer release year, get it from tags
const yearFromTags = (tags) => {
    //Normalising tags into an array for cleaner handling. Remove falsy values -> empty array
    const tagArr = Array.isArray(tags) ? tags : [tags].filter(Boolean);

    const currentYear = new Date().getFullYear();

        const parseTags = (value) => {
            const text = String(value ?? '').trim();
            if (!/^\d{4}$/.test(text)) return null; //Using regex to only accept 4 digit values
            const releaseYear = Number(text);

            //Limiting the range of accepted years for better results
            if (releaseYear < 1900 || releaseYear > currentYear +1) return null;
            return releaseYear
        };
    
    //Loop through the tags data to find the first valid value
    for (const tag of tagArr) {
        const year = parseTags(tag?.name);
        if (year !== null) return year; //Exit loop early if valid year tag found
    }; return nullReplace;
}

//#endregion

//#region 4. Content for artist div

const createAlbumList = (artist) => {
  getArtistAlbums(artist).then((data) => {
    let albumData = data;
    const albums = albumData.topalbums;
    const albumListFrag = document.createDocumentFragment();
    const albumUl = document.createElement('ul')
        albumUl.classList.add('albumList')
    
    albums.album.forEach(album => {
        const albumLi = Object.assign(document.createElement('li'), {
            textContent: album.name
        })
        albumUl.appendChild(albumLi)
    })

    //Event listener for all li elements using event delegation
    albumUl.addEventListener('click', (e) => {
    const li = e.target.closest('.albumList > li');
        if (!li || !albumUl.contains(li)) return; //Ignore clicks outside intended elements
        renderAlbum(artist, li.textContent.trim())
    })
    albumListFrag.append(albumUl)
    artistDiv.append(albumListFrag)
})
}

//Render artist information div content
const renderArtist = (artist) => {
    artistDiv.textContent = '';
    getArtistInfo(artist).then((data) => {
      let artistData = data
      const artistHead = document.createElement('h1');
          artistHead.classList.add('artistName');
          artistHead.textContent = artistData.artist.name
      

      const artistBio = Object.assign(document.createElement('div'), {
          id: 'artistBio',
          textContent: artistData.artist.bio.content
      });
      
      const albumListHead = document.createElement('h2')
          albumListHead.classList.add('albumListHeading')
          albumListHead.textContent = 'Releases'
      
      artistDiv.append(artistHead, artistBio, albumListHead)
      createAlbumList(artist)
    })
    
}

//#endregion

//#region 5. Content for album div

// Create the basic album info table
const albumInfo = (title, value) => {
    const row = document.createElement('tr');
    const heading = document.createElement('th'); 
        heading.scope = 'row';
        heading.textContent = title;

    const info = document.createElement('td');
        info.textContent = value;

    row.append(heading, info);
    return row
}


const createTracklist = (artist, album) => {
  getAlbumInfo(artist, album).then((data) => {
  let albumData = data
  
    const tracks = albumData?.album?.tracks?.track;
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
  })
}

const renderAlbum = (artist, album) => {
  albumDiv.textContent = '';
  getAlbumInfo(artist, album).then((data) => {
    const albumData = data
  
  // Album information
    const albumInfoTbl = document.createElement('table');
        albumInfoTbl.classList.add('albumInfoTbl');
  
    const albumCover = document.createElement('img');
        albumCover.classList.add('albumCover');
        albumCover.src = albumData.album.image[3]['#text'];
  
  
  
  const albumInfoHeading = document.createElement('h2')
    albumInfoHeading.classList.add('tracklistHeading');
    albumInfoHeading.textContent = 'Tracklist';

  //Populate info table with API data
  albumInfoTbl.append(
    albumInfo('Artist', albumData.album.artist),
    albumInfo('Album', albumData.album.name),
    albumInfo('Release', yearFromTags(albumData.album?.tags?.tag))
  )

  albumDiv.append(albumCover, albumInfoTbl, albumInfoHeading)
  createTracklist(artist, album)
  })
}

//#endregion

//#region 6. Event Listeners

//Event listener for li elements using event delegation
artistList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
        albumDiv.textContent = '';
        artistDiv.textContent = '';
        if (!li || !artistList.contains(li)) return; // Ignore clicks outside the li elements
        renderArtist(li.textContent.trim())
})

artistSearchForm.addEventListener('submit', (e) => {
  albumDiv.textContent = '';
  e.preventDefault();
  const artistValue = artistInput.value.trim(); 
  renderArtist(artistValue)
})

//#endregion