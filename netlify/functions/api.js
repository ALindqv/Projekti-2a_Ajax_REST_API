export async function handler(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: corsHeaders(),
            body: ''
        };
    }

    try {
        const API_KEY = process.env.LASTFM_API_KEY
        if (!API_KEY) {
            return jsonResponse(500, {error: 'API key missing'});
        }

        if (event.httpMethod !== 'GET') {
            return jsonResponse(405, {error: 'Method not allowed'});
        }

        const params = event.queryStringParameters || {};
        const action = (params.action || '').toLowerCase();
        const artist = params.artist || '';
        const album = params.album || '';

        
        const baseUrl = 'https://ws.audioscrobbler.com/2.0/';
        const urlParams = new URLSearchParams({ api_key: API_KEY, format: 'json' });

        switch(action) {
            case 'albuminfo':
                urlParams.set('method', 'album.getinfo');
                urlParams.set('artist', artist);
                urlParams.set('album', album);
                break;
            
            case 'artistinfo':
                urlParams.set('method', 'artist.getinfo');
                urlParams.set('artist', artist);
                break;
            
            case 'artistalbums':
                urlParams.set('method', 'artist.gettopalbums');
                urlParams.set('artist', artist);
                break;
        }

        const url = `${baseUrl}?${String(urlParams)}`;

        //Fetch request
        const response = await fetch(url, {headers: {'Accept': 'application/json'} });

        //Handle errors cleanly
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return jsonResponse(response.status, {error: 'Invalid json'});
        }

        if  (!response.ok || data.error) {
            const status = response.ok ? 502 : response.status;
            return jsonResponse(status, {upstreamError: data});
        }

        //Successful request
        return {
            statusCode: 200,
            headers: {
                ...corsHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } catch(err) {
        console.log(err);
        return jsonResponse(500, {error: 'Server error'});
    }
}

const corsHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
}

const jsonResponse = (statusCode, payload) => {
    return {
        statusCode,
        headers: {
            ...corsHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
}

