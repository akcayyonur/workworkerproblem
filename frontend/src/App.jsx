import { useState } from 'react';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/data/solve', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Hata:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Görev Atama Optimizasyonu</h1>

      <button
        onClick={handleSolve}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#aaa' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Çözüm Hesaplanıyor...' : 'Çözümü Başlat'}
      </button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Sonuç</h2>
          <p><strong>Toplam Maliyet:</strong> {result.best_cost}</p>
          <p><strong>Ceza:</strong> {result.best_penalty}</p>

          <h3>İş - Ajan Atamaları</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>İş No</th>
                <th>Atanan Ajan</th>
              </tr>
            </thead>
            <tbody>
              {result.best_solution.map((agent, job) => (
                <tr key={job}>
                  <td>{job + 1}</td>
                  <td>{agent + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
