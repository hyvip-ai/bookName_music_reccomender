import Loader from '@/components/Loader';
import SEO from '@/components/SEO';
import Song from '@/components/Song';
import { useTokenStore } from '@/store/token';
import {
  createPlaylistAndAddSongs,
  getKeywordsFromBookName,
  getSongFromKeywords,
  modifySongs,
} from '@/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [bookName, setBookName] = useState('Rich Dad Poor Dad');
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [externalURL, setExternalURL] = useState('');

  const { access_token, refresh_token, expires_in, setTokens } = useTokenStore(
    (state) => ({
      access_token: state.access_token,
      refresh_token: state.refresh_token,
      expires_in: state.expires_in,
      setTokens: state.setTokens,
    })
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (access_token) {
        const keywords = await getKeywordsFromBookName(bookName);
        const songs = await getSongFromKeywords(keywords, access_token);
        const newSongs = modifySongs(songs);
        setSongs([...newSongs]);
      } else {
        throw new Error('Access token not there');
      }
    } catch (err) {
      toast.error(err.message.trim());
    }
    setLoading(false);
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/refresh`,
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken: refresh_token }),
        }
      ).then((res) => res.json());
      setTokens({
        access_token: data.access_token,
        expires_in: data.expires_in,
      });
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (refresh_token) {
      handleRefreshToken(refresh_token);
    }
  }, [refresh_token]);

  const handlePlaylist = async () => {
    setLoading(true);
    try {
      const externalURI = await createPlaylistAndAddSongs(
        access_token,
        `${bookName} - Playlist`,
        `A playlist created form book: ${bookName}`,
        selectedSongs
      );
      toast.success(
        `Playlist with ${selectedSongs.length} songs created successfully`
      );
      setExternalURL(externalURI);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleSongAdd = (checked, songURI) => {
    setSelectedSongs((prev) => {
      const prevCopy = [...prev];
      if (checked) {
        return [...prevCopy, songURI];
      }
      const filteredSongs = prevCopy.filter((song) => song !== songURI);
      return [...filteredSongs];
    });
  };

  const handleOpenSpotify = () => {
    router.push(externalURL);
  };

  return (
    <main>
      <SEO />
      {!loading ? (
        <>
          {songs.length ? (
            <>
              <h1>Songs</h1>
              <div className='songsContainer'>
                {songs.map((item) => (
                  <Song
                    {...item}
                    key={item.uri}
                    onClick={handleSongAdd}
                    showCheck={!externalURL}
                  />
                ))}
              </div>

              <button
                className='connect_to_spotify'
                onClick={externalURL ? handleOpenSpotify : handlePlaylist}
                disabled={loading || !selectedSongs.length}
              >
                <Image
                  src='https://readingmood.vercel.app/_next/static/media/spotify.ee7b2e79.svg'
                  alt='spotify_logo'
                  height='65'
                  width='65'
                  style={{ marginRight: '16px' }}
                />
                {externalURL
                  ? 'Open Spotify'
                  : 'Create a Playlist with selected songs'}
              </button>
            </>
          ) : (
            <>
              <h1>Reading Mood</h1>
              <form className='form'>
                <input
                  type='text'
                  name='bookName'
                  placeholder='Please enter the book name'
                  className='bookNameInput'
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                />
                <button
                  className='submit'
                  onClick={handleFormSubmit}
                  disabled={!bookName}
                >
                  Submit
                </button>
              </form>
            </>
          )}
        </>
      ) : (
        <Loader />
      )}
    </main>
  );
}

export default Dashboard;
