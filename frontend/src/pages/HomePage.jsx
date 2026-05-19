import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Film, CalendarDays, Compass, Star } from 'lucide-react';
import { fetchMovies } from '../store/movieSlice';
import MovieList from '../components/Movie/MovieList';
import MovieFilter from '../components/Movie/MovieFilter';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.movie);
  const [filters, setFilters] = useState({
    status: 'now-showing',
    genre: '',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchMovies(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const nowShowingMovies = movies.filter((m) => m.status === 'now-showing');
  const comingSoonMovies = movies.filter((m) => m.status === 'coming-soon');

  // Featured banner movie (first movie or custom)
  const featured = nowShowingMovies[0] || movies[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Cinematic Hero Banner Showcase */}
      {featured && (
        <div className="relative w-full aspect-[21/9] min-h-[300px] md:min-h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 border border-dark-border">
          <img
            src={featured.posterUrl}
            alt={featured.title}
            className="w-full h-full object-cover opacity-35"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-deep via-dark-deep/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-deep via-transparent to-transparent" />

          {/* Banner Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl space-y-4">
            <span className="text-[10px] font-black bg-brand px-3 py-1 rounded text-white tracking-widest uppercase w-max select-none shadow-md">
              Featured Release
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow">
              {featured.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-semibold line-clamp-3 drop-shadow">
              {featured.description}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link to={`/movies/${featured._id}`}>
                <Button variant="primary" className="py-2.5 px-6 font-bold text-sm shadow-glass-brand">
                  Book Now
                </Button>
              </Link>
              <Link to={`/movies/${featured._id}`}>
                <Button variant="glass" className="py-2.5 px-6 font-bold text-sm">
                  Watch Trailer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Navigation Filters Bar */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-2 tracking-tight">
            <Compass className="text-brand" size={24} /> Explore Releases
          </h2>
        </div>

        <MovieFilter filters={filters} onChange={handleFilterChange} />
      </div>

      {/* 3. Movies List Segment Grid */}
      <div>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center font-medium">
            Error loading movies: {error}
          </div>
        ) : (
          <MovieList movies={movies} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
