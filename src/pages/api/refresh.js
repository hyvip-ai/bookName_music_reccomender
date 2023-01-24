import SpotifyWebApi from 'spotify-web-api-node';

export default async function handler(req, res) {
  var credentials = {
    clientId: '1b1c6e6bafda4a98a793be1a4ddd4ed1',
    clientSecret: '16344c402c7c4861a31971c99ea1d554',
    refreshToken: JSON.parse(req.body).refreshToken,
  };
  var spotifyApi = new SpotifyWebApi(credentials);

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      spotifyApi.setAccessToken(data.body['access_token']);
      res.status(200).json({ ...data.body });
    })
    .catch((err) => {
      res.status(400).json({ msg: err.message });
    });
}
