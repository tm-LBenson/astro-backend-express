const { default: axios } = require('axios');
require('dotenv').config();
const WEATHER_BIT = process.env.WEATHER_BIT;
async function weatherHandler(req, res, next) {
  console.log('Getting weather data...');
  try {
    const { q } = req.query;
    let endpoint = '';

    if (/^\d+$/.test(q)) {
      endpoint = `https://api.weatherbit.io/v2.0/forecast/daily?postal_code=${q}&country=US&days=6`;
    } else {
      endpoint = `https://api.weatherbit.io/v2.0/forecast/daily?city=${q}&days=6`;
    }
    console.log(endpoint + '&key=' + WEATHER_BIT);
    const results = await axios.get(endpoint + '&key=' + WEATHER_BIT);
    res.status(200).send(results.data);
  } catch (error) {
    next(error);
  }
}
module.exports = weatherHandler;
