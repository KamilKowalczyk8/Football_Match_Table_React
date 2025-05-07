import { useState } from 'react';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = [
    'anglia',
    'niemcy',
    'hiszpania',
    'włochy',
    'francja',
    'polska',
    'rosja',
    'turcja',
  ];

  const handleClick = async (country) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`http://localhost:5000/matches/${country}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Terminarz meczów</h1>
      
      <div className="buttons">
        {countries.map((country) => (
          <button 
            key={country} 
            onClick={() => handleClick(country)}
            disabled={loading}
          >
            {country.toUpperCase()}
          </button>
        ))}
      </div>
      {error && <p className="error">Błąd: {error}</p>}

      {!loading && matches.length === 0 && !error && (
        <p>Wybierz ligę, aby zobaczyć terminarz meczów</p>
      )}

      {matches.length > 0 && (
        <table className="match-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Godzina</th>
              <th>Mecz</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.fixture.id}>
                <td>{new Date(match.fixture.date).toLocaleDateString()}</td>
                <td>{new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{match.teams.home.name} vs {match.teams.away.name}</td>
                <td>{match.fixture.status.short === 'FT' ? 'Zakończony' : match.fixture.status.short}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;