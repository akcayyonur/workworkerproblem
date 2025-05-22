import { useState } from 'react';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedParams, setAdvancedParams] = useState({
    max_iterations: 10000,
    threshold_decay: 0.995,
    restart_count: 3
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setAdvancedParams({
      ...advancedParams,
      [name]: name === 'restart_count' ? parseInt(value) : parseFloat(value)
    });
  };

  const handleSolve = async () => {
    setLoading(true);
    const frontendStartTime = Date.now();
    
    try {
      // Using the data endpoint which fetches from MongoDB
      const response = await fetch('http://localhost:5000/api/v1/data/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(showAdvanced ? advancedParams : {})
      });
      
      const frontendEndTime = Date.now();
      const totalTime = (frontendEndTime - frontendStartTime) / 1000;
      
      const data = await response.json();
      
      // Add frontend timing info
      data.frontend_total_time = totalTime;
      
      setResult(data);
      
      console.log(`🎯 Total request time: ${totalTime.toFixed(3)} seconds`);
      console.log(`⚡ Algorithm time: ${data.execution_time_seconds || 'N/A'} seconds`);
      console.log('📊 Graph data received:', data.graph_data ? 'YES' : 'NO');
      if (data.graph_data) {
        console.log('   Iterations count:', data.graph_data.iterations?.length || 0);
        console.log('   Cost values count:', data.graph_data.cost_values?.length || 0);
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Görev Atama Optimizasyonu</h1>
      <p style={{ textAlign: 'center' }}>Geliştirilmiş Eşik Kabul Algoritması ile İş-Ajan Optimizasyonu</p>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {showAdvanced ? 'Gelişmiş Ayarları Gizle' : 'Gelişmiş Ayarları Göster'}
        </button>

        {showAdvanced && (
          <div style={{ 
            border: '1px solid #ddd', 
            padding: '1rem', 
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
            marginBottom: '1rem' 
          }}>
            <h3 style={{ marginTop: 0 }}>Algoritma Parametreleri</h3>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Maksimum İterasyon Sayısı:
              </label>
              <input
                type="number"
                name="max_iterations"
                value={advancedParams.max_iterations}
                onChange={handleParamChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <small style={{ color: '#666' }}>Her başlangıç için maksimum iterasyon sayısı</small>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Eşik Azalma Oranı:
              </label>
              <input
                type="number"
                name="threshold_decay"
                min="0.9"
                max="0.999"
                step="0.001"
                value={advancedParams.threshold_decay}
                onChange={handleParamChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <small style={{ color: '#666' }}>Her iterasyonda eşik değerin azaltılma faktörü (0.995 = %0.5 azalma)</small>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Yeniden Başlatma Sayısı:
              </label>
              <input
                type="number"
                name="restart_count"
                min="1"
                max="10"
                value={advancedParams.restart_count}
                onChange={handleParamChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <small style={{ color: '#666' }}>Farklı başlangıç çözümleriyle algoritmanın yeniden başlatılma sayısı</small>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSolve}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading ? '#aaa' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Çözüm Hesaplanıyor...' : 'Optimizasyonu Başlat'}
      </button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Sonuç</h2>
          
          {/* Süre Bilgileri */}
          <div style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #b8daff'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>⏱️ Performans Bilgileri</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div>
                <strong>Algoritma Süresi:</strong> {result.execution_time_seconds || 'N/A'} saniye
              </div>
              <div>
                <strong>Toplam Süre:</strong> {result.frontend_total_time?.toFixed(3) || 'N/A'} saniye
              </div>
              <div>
                <strong>Milisaniye:</strong> {result.execution_time_ms || 'N/A'} ms
              </div>
            </div>
            {result.parameters && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
                Parametreler: {result.parameters.max_iterations} iter, {result.parameters.threshold_decay} decay, {result.parameters.restart_count} restart
              </div>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ddd' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>TOPLAM MALİYET</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{result.best_cost?.toFixed(2) || 'N/A'}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ddd' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>CEZA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: result.best_penalty > 0 ? '#dc3545' : '#28a745' }}>{result.best_penalty?.toFixed(2) || 'N/A'}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>TOPLAM</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{((result.best_cost || 0) + (result.best_penalty || 0)).toFixed(2)}</div>
            </div>
          </div>

          <h3>İş - Ajan Atamaları</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #dee2e6' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>İş No</th>
                  <th style={{ padding: '12px 8px', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>Atanan Ajan</th>
                </tr>
              </thead>
              <tbody>
                {result.best_solution.map((agent, job) => (
                  <tr key={job} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '8px', borderRight: '1px solid #dee2e6' }}>İş {job + 1}</td>
                    <td style={{ padding: '8px' }}>Ajan {agent + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '1rem', fontSize: '14px', color: '#6c757d', fontStyle: 'italic' }}>
            Çözüm Algoritması: Geliştirilmiş Eşik Kabul Algoritması
          </div>

          {/* Grafikler */}
          {result.graph_data && result.graph_data.iterations && result.graph_data.iterations.length > 0 ? (
            <div style={{ marginTop: '2rem' }}>
              <h3>Optimizasyon Grafikleri</h3>
              
              {/* Debug bilgileri */}
              <div style={{ 
                marginBottom: '1rem', 
                padding: '10px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '5px',
                fontSize: '12px' 
              }}>
                <strong>🐛 Debug:</strong> {result.graph_data.iterations.length} veri noktası, 
                Maliyet aralığı: {Math.min(...result.graph_data.cost_values).toFixed(1)} - {Math.max(...result.graph_data.cost_values).toFixed(1)}
              </div>
              
              {/* Cost vs Iterations Grafiği */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#0056b3' }}>💰 Maliyet vs İterasyon</h4>
                <svg width="600" height="300" style={{ border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={`h-${i}`} x1="50" y1={50 + i * 50} x2="580" y2={50 + i * 50} 
                          stroke="#e0e0e0" strokeWidth="1"/>
                  ))}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={`v-${i}`} x1={50 + i * 100} y1="50" x2={50 + i * 100} y2="250" 
                          stroke="#e0e0e0" strokeWidth="1"/>
                  ))}
                  
                  {/* Cost line (blue) */}
                  <polyline
                    fill="none"
                    stroke="#007bff"
                    strokeWidth="2"
                    points={result.graph_data.iterations.map((iter, i) => {
                      const x = 50 + (iter / Math.max(...result.graph_data.iterations)) * 530;
                      const maxCost = Math.max(...result.graph_data.cost_values);
                      const minCost = Math.min(...result.graph_data.cost_values);
                      const y = 250 - ((result.graph_data.cost_values[i] - minCost) / (maxCost - minCost || 1)) * 200;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Axes */}
                  <line x1="50" y1="250" x2="580" y2="250" stroke="black" strokeWidth="2"/>
                  <line x1="50" y1="50" x2="50" y2="250" stroke="black" strokeWidth="2"/>
                  
                  {/* Labels */}
                  <text x="315" y="280" textAnchor="middle" fontSize="12">İterasyon</text>
                  <text x="25" y="150" textAnchor="middle" fontSize="12" transform="rotate(-90 25 150)">Maliyet</text>
                  
                  {/* Legend */}
                  <line x1="400" y1="30" x2="430" y2="30" stroke="#007bff" strokeWidth="2"/>
                  <text x="435" y="35" fontSize="12">Toplam Maliyet</text>
                </svg>
              </div>

              {/* Threshold vs Iterations Grafiği */}
              <div>
                <h4 style={{ color: '#dc3545' }}>🎯 Eşik Değeri vs İterasyon</h4>
                <svg width="600" height="300" style={{ border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={`h2-${i}`} x1="50" y1={50 + i * 50} x2="580" y2={50 + i * 50} 
                          stroke="#e0e0e0" strokeWidth="1"/>
                  ))}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={`v2-${i}`} x1={50 + i * 100} y1="50" x2={50 + i * 100} y2="250" 
                          stroke="#e0e0e0" strokeWidth="1"/>
                  ))}
                  
                  {/* Threshold line (red) */}
                  <polyline
                    fill="none"
                    stroke="#dc3545"
                    strokeWidth="2"
                    points={result.graph_data.iterations.map((iter, i) => {
                      const x = 50 + (iter / Math.max(...result.graph_data.iterations)) * 530;
                      const maxThreshold = Math.max(...result.graph_data.threshold_values);
                      const minThreshold = Math.min(...result.graph_data.threshold_values);
                      const y = 250 - ((result.graph_data.threshold_values[i] - minThreshold) / (maxThreshold - minThreshold || 1)) * 200;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Axes */}
                  <line x1="50" y1="250" x2="580" y2="250" stroke="black" strokeWidth="2"/>
                  <line x1="50" y1="50" x2="50" y2="250" stroke="black" strokeWidth="2"/>
                  
                  {/* Labels */}
                  <text x="315" y="280" textAnchor="middle" fontSize="12">İterasyon</text>
                  <text x="25" y="150" textAnchor="middle" fontSize="12" transform="rotate(-90 25 150)">Eşik Değeri</text>
                  
                  {/* Legend */}
                  <line x1="400" y1="30" x2="430" y2="30" stroke="#dc3545" strokeWidth="2"/>
                  <text x="435" y="35" fontSize="12">Threshold</text>
                </svg>
              </div>

              {/* Grafik bilgileri */}
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                backgroundColor: '#e7f3ff', 
                borderRadius: '5px',
                fontSize: '12px' 
              }}>
                <strong>📊 Grafik Bilgileri:</strong>
                <br />• Mavi grafik: Algoritmanın bulduğu en iyi maliyetin iterasyonlara göre iyileşmesi
                <br />• Kırmızı grafik: Threshold (eşik) değerinin zaman içinde azalması
                <br />• Toplam {result.graph_data.iterations.length} veri noktası kaydedildi
              </div>
            </div>
          ) : (
            <div style={{ 
              marginTop: '2rem', 
              padding: '20px', 
              backgroundColor: '#f8d7da', 
              borderRadius: '8px',
              color: '#721c24'
            }}>
              <h3>⚠️ Grafik Verisi Mevcut Değil</h3>
              <p>Grafik verileri üretilmedi. Olası nedenler:</p>
              <ul>
                <li>Algoritma çok hızlı tamamlandı</li>
                <li>Veri toplama sırasında hata oluştu</li>
                <li>Backend grafik desteği eksik</li>
              </ul>
              <p><strong>Console'u kontrol edin.</strong></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;