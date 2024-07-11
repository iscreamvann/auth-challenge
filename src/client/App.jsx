import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const port = import.meta.env.VITE_PORT;
const apiUrl = `http://localhost:${port}`;

function App() {
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [token]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${apiUrl}/movie`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMovies(data.data); 
      } else {
        console.error('Failed to fetch movies:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching movies:', error.message);
    }
  };

  const handleRegister = async ({ username, password }) => {
    try {
      const response = await fetch(`${apiUrl}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log('Registration successful:', responseData);
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log('Login successful:', responseData);
        const { token } = responseData.data;
        localStorage.setItem('token', token); 
        setToken(token); 
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, runtimeMins })
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log('Movie created:', responseData);
        setMovies([...movies, responseData.data]);
      } else {
        console.error('Failed to create movie:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating movie:', error.message);
    }
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            <p>Description: {movie.description}</p>
            <p>Runtime: {movie.runtimeMins}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
