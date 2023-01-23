import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const AUTH_URL =
  'https://accounts.spotify.com/authorize?client_id=1b1c6e6bafda4a98a793be1a4ddd4ed1&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify%20playlist-modify-private';

function Login() {
  const router = useRouter();
  const handleClick = () => {
    router.push(AUTH_URL);
  };

  return (
    <button className='connect_to_spotify' onClick={handleClick}>
      <Image
        src='https://readingmood.vercel.app/_next/static/media/spotify.ee7b2e79.svg'
        alt='spotify_logo'
        height='65'
        width='65'
        style={{ marginRight: '16px' }}
      />
      Connect To Spotify
    </button>
  );
}

export default Login;
