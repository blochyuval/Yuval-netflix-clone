import axios from "axios";
import { ENV_VARS } from '../config/envVars.js';

export const fetchFromTMDB = async(url) => {
  try {
    const options = {
      method: 'GET',
      headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ENV_VARS.TMDB_API_KEY}`
      }
    };
  
    const response = await axios.get(url, options);
    if(response.status !== 200) throw new Error('Error catching data from TMDB: ' + response.statusText);

    return response.data

  } catch (error) {
    throw new Error('Error in fetchFromTMDB: ' + error.message);
  }
  
}