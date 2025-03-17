import { fetchFromTMDB } from "../services/tmdb.service.js"

export const getTrendingMovie = async(req, res) => {
try {
  const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');

  if(!data.results || data.results.length === 0) return res.status(204).json({ success: false, message: 'No trending movies found' });

  const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

  return res.status(200).json({ success: true, content: randomMovie });
} catch (error) {
  console.error('Error in getTrendingMovie: ' + error.message);
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
}
}

export const getMovieTrailers = async(req, res) => {
  const movieId = req.params.id;
  try {

    const trailers = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`);
    return res.status(200).json({ success: true, trailers: trailers.results });
  } catch (error) {
    if(error.message.includes('404')){
      return res.status(404).send(null)
    }
    return res.status(500).json({success: false, message: 'Internal Server Error'});
  }
}

export const getMovieDetails = async(req, res) => {
  const movieId = req.params.id;
  try {

    const details = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);
    return res.status(200).json({ success: true, details });
  } catch (error) {
    if(error.message.includes('404')){
      return res.status(404).send(null)
    }
    return res.status(500).json({success: false, message: 'Internal Server Error'});
  }

}

export const getSimilarMovies = async(req, res) => {
  const movieId = req.params.id;
  try {

    const similar = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`);

    return res.status(200).json({ success: true, similar: similar.results });
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal Server Error'});
  }
}

export const getMoviesByCategory = async(req, res) => {
  const { category } = req.params;
  try {
    const movies = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);

    return res.status(200).json({ success: true, content: movies.results });
    
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal Server Error'});
  }
}