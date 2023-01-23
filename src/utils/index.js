import { Configuration, OpenAIApi } from 'openai';
import { toast } from 'react-toastify';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyAPI = new SpotifyWebApi({
  clientId: '1b1c6e6bafda4a98a793be1a4ddd4ed1',
});

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Book keywords
export async function getKeywordsFromBookName(bookName) {
  const prompt = `Please determine the mood of the book ${bookName} in unordered list format:`;
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt,
      max_tokens: 1024,
    });

    const regex = new RegExp(/\r?\n|\r/g);

    const keywords = response.data.choices[0].text
      .replace(regex, ' ')
      .split('- ')
      .map((item) => item.trim())
      .filter((item) => (item && item !== '-' ? item : false));
    return keywords;
  } catch (err) {
    toast.error(err.message);
  }
}

// getting songs based on keywords
export async function getSongFromKeywords(keywords, access_token) {
  try {
    spotifyAPI.setAccessToken(access_token);
    const response = await spotifyAPI.searchTracks(keywords.join(', '));
    return response.body.tracks.items;
  } catch (err) {
    toast.error(err.message);
  }
}

// playlist creation
export async function createPlaylistAndAddSongs(
  access_token,
  playListName,
  playlistDescription,
  songsArray
) {
  try {
    // Create playlist
    spotifyAPI.setAccessToken(access_token);
    const playList = await spotifyAPI.createPlaylist(playListName, {
      description: playlistDescription,
      public: true,
    });
    // Add songs to playlist

    await spotifyAPI.addTracksToPlaylist(playList.body.id, [...songsArray]);
    return playList.body.external_urls.spotify;
  } catch (err) {
    toast.error(err.message);
  }
}

function smallestImageURL(images) {
  return images.reduce(
    (acc, image) => {
      if (image.height < acc.height) return { ...image };
      return { ...acc };
    },
    { ...images[0] }
  ).url;
}

export function modifySongs(songs) {
  const modifiedSongs = songs.map((song) => ({
    name: song.name,
    uri: song.uri,
    artists: song.artists.map((artist) => artist.name).join(', '),
    image: smallestImageURL(song.album.images),
    songPreview: song.preview_url,
    albumName: song.album.name,
  }));

  return [...modifiedSongs];
}
