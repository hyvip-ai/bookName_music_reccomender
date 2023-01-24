import SEO from '@/components/SEO';
import { useEffect } from 'react';
import Login from '@/components/Login';
import { useRouter } from 'next/router';
import { useTokenStore } from '@/store/token';
import { toast } from 'react-toastify';

export default function Home() {
  const router = useRouter();

  const { access_token, refresh_token, setTokens } = useTokenStore((state) => ({
    setTokens: state.setTokens,
    access_token: state.access_token,
    refresh_token: state.refresh_token,
  }));

  const handleTokens = async (code) => {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/spotifyLogin`,
        {
          method: 'POST',
          body: JSON.stringify({ code }),
        }
      ).then((res) => res.json());
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      });
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (router.query.code) {
      handleTokens(router.query.code);
    }
  }, [router]);

  useEffect(() => {
    if (access_token && refresh_token) {
      router.push('/dashboard');
    }
  }, [access_token, refresh_token]);

  return (
    <main>
      <SEO />
      <h1>Reading Mood</h1>
      <Login />
    </main>
  );
}
