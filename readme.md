# Projektin nimi ja tekijät
Projektin nimi ja kaikki mukana olevat tekijät. 
Projektin tekijä on Arttu Lindqvist.

## Verkkolinkit:
Pääset julkaistuun sovellukseen käsiksi osoitteessa [google.com](https://google.com)
Linkki projektin videoesittelyyn [google.com](https://google.com)

## Työn jakautuminen 
Miten työmäärä jaettiin? Kuka teki mitä? Miten yhteistyö sujui?


## Oma arvio työstä ja oman osaamisen kehittymisestä
Mielestäni onnistuin hyödyntämään tarjottua API dataa monipuolisesti ja muuntamaan sitä paremman näköiseksi.

Parantamista olisi

Sovelluksesta jäi puuttumaan hakukentän sisällön tarkastamisen toimintoja, esimerkiksi varmistaminen, että haettu artisti on olemassa LastFM-palvelussa.

Koen, että olen oppinut paljon API-datan hakemisesta ja AJAX-kutsujen käyttämisestä. Opin myös tapoja käsitellä saatua dataa tarvittaessa.

Epäselväksi jäi muut tavat säilyttää API-avainta turvallisesti, mutta tulen tutustumaan niihin tulevaisuuden projekteissa. Lisäksi en saanut paljon kokemusta XML-kutsuista, koska käytin datan hakemiseen vain fetchiä ja JSON-dataa.

Antaisin itselleni pisteitä seuraavasti: 9/10 p

## Palaute opettajalle kurssista sekä itse opetuksesta tähän saakka
Kurssi sekä lähiopetus ovat tuntuneet hyödylliseltä 
Oppimistani tukisi lisää jos kävisin useammin lähiopetuksessa


## Sisällysluettelo:

- [Tietoja sovelluksesta](#tietoja-sovelluksesta)
- [Tunnetut virheet/bugit](#unnetut-virheet/bugit)
- [Kuvakaappaukset](#kuvakaappaukset)
- [Teknologiat](#teknologiat)
- [Asennus](#asennus)
- [Lähestymistapa](#lähestymistapa)
- [Kiitokset](#kiitokset)
- [Lisenssi](#lisenssi)

## Tietoja sovelluksesta
[Projektin nimi] on sovellus, joka tarjoaa käyttäjälle tietoa erilaisista musiikkartisteista ja heidän julkaisuistaan. Sovellus tarjoaa valmiiksi muutaman artistin mutta hän voi myös vapaasti hakea artistia nimellä hakukentän avulla.

Sovellus hakee LastFM:stä dataa ja esittää ne sivulla. Käyttäjä saa seuraavaa tietoa:

Artisti:
- Kuvaus artistista
- Lista julkaisuista

Albumi:
- Albumin esittäjä
- Albumin nimi
- Albumin julkaisuvuosi
- Albumin kappalelista

Jos näitä tietoja ei ole saatavilla, sovellus kertoo käyttäjälle.

## Tunnetut virheet/bugit
Sovellus ei vielä kunnolla tarkista käyttäjän syöttämää tekstiä.

## Kuvakaappaukset
Lisää tähän vähintään yksi kuvakaappaus toimivasta sovelluksesta  
`![Kirjoittaminen](https://unsplash.com/photos/VBPzRgd7gfc)`

## Teknologiat
Kuvaa, mitä teknologioita käytettiin ja mikä oli niiden rooli projektissasi.  
Käytin seuraavia teknologioita: `html`, `css`, `Javascript`

## Asennus
Jos haluat käyttää sovellusta paikallisesti, tarvitset oman API-avaimen [LastFM-sivustolta](https://www.last.fm/api)
- Luo root-hakemistoon .env-tiedosto ja luo muuttuja `LASTFM_API_KEY = 'API-Avain tänne'`

Sen jälkeen:
- Lataa kaikki tiedostot/lataa tai kloonaa repositorio  
- Asenna netlify: Suorita `npm i -g netlify-cli`  
- Suorite terminaalissa `netlify dev`

## Kiitokset
Lista lähteistä ja esimerkeistä, joita käytit projektin aikana. Mainitse myös, jos käytit ChatGPT:tä tai muita tekoälytyökaluja koodauksen aikana ja kerro, miten ne auttoivat sinua.  

Käytin projektia tehdessä CoPilot-tekoälysovellusta. Käyttötarkoituksia olivat:
- Javascript-toimintojen ja css-attribuuttien selityksiä selvennystä varten.
- Apua ja ehdotuksia kommentointiin ja koodin luettavuuden parantamiseen.
- Ehdotuksia, miten erilaisia toimintoja voisi toteuttaa.
- Niissä tapauksissa, joissa käytin tekoälyn tarjoamia toimintoja tai koodia, kysyin aina tarvittaessa selityksen, miten koko koodi toimii.

Muita lähteitä:  
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [W3Schools](https://www.w3schools.com/)

## Lisenssi
Valitse projektille lisenssi seuraamalla tätä [opasta](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository).

Esimerkki: MIT-lisenssi @ [tekijä](author.com)