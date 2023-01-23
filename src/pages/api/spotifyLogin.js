import SpotifyWebApi from 'spotify-web-api-node';

var credentials = {
  clientId: '1b1c6e6bafda4a98a793be1a4ddd4ed1',
  clientSecret: '16344c402c7c4861a31971c99ea1d554',
  redirectUri: 'https://book-name-music-reccomender.vercel.app',
};

export default async function handler(req, res) {
  var spotifyApi = new SpotifyWebApi(credentials);
  const code = JSON.parse(req.body).code;
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      res.status(200).json({
        access_token: data.body['access_token'],
        refresh_token: data.body['refresh_token'],
        expires_in: data.body['expires_in'],
      });
    })
    .catch((err) => {
      res.redirect(307, '/');
    });
}
