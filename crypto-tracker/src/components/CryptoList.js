import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './styles.css';

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCryptos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'gbp',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: true,
            price_change_percentage: '1h,24h,7d'
          }
        });
        setCryptos(response.data);
      } catch (error) {
        console.error("There was an error fetching the cryptocurrency data!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleViewHistoricalData = async (cryptoId) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'gbp',
          days: '7', // Get data for the last 7 days
        }
      });
      setSelectedCrypto(cryptoId);
      setHistoricalData(response.data.prices);
    } catch (error) {
      console.error("There was an error fetching the historical data!", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cryptos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(cryptos.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="crypto-container">
      <h1 className="text-3xl font-bold mb-4 text-center">Cryptocurrency Dashboard</h1>
      <table className="crypto-table">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2 cursor-pointer">Name</th>
            <th className="px-4 py-2 cursor-pointer">1h %</th>
            <th className="px-4 py-2 cursor-pointer">24h %</th>
            <th className="px-4 py-2 cursor-pointer">7d %</th>
            <th className="px-4 py-2 cursor-pointer">Price</th>
            <th className="px-4 py-2 cursor-pointer">Market Cap</th>
            <th className="px-4 py-2 cursor-pointer">Volume 24h</th>
            <th className="px-4 py-2">Price Graph (7D)</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {currentItems.map((crypto, index) => (
            <tr key={crypto.id}>
              <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
              <td className="px-4 py-2 flex items-center cursor-pointer" onClick={() => handleViewHistoricalData(crypto.id)}>
                <img src={crypto.image} alt={crypto.name} width="20" className="mr-4" /> {/* Adjust spacing here */}
                <span>{crypto.name} ({crypto.symbol.toUpperCase()})</span>
              </td>
              <td className="px-4 py-2" style={{ color: crypto.price_change_percentage_1h_in_currency > 0 ? 'green' : 'red' }}>
                {crypto.price_change_percentage_1h_in_currency?.toFixed(2) || 'N/A'}%
              </td>
              <td className="px-4 py-2" style={{ color: crypto.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
                {crypto.price_change_percentage_24h?.toFixed(2) || 'N/A'}%
              </td>
              <td className="px-4 py-2" style={{ color: crypto.price_change_percentage_7d_in_currency > 0 ? 'green' : 'red' }}>
                {crypto.price_change_percentage_7d_in_currency?.toFixed(2) || 'N/A'}%
              </td>
              <td className="px-4 py-2">£{crypto.current_price.toLocaleString()}</td>
              <td className="px-4 py-2">£{crypto.market_cap.toLocaleString()}</td>
              <td className="px-4 py-2">£{crypto.total_volume.toLocaleString()}</td>
              <td className="px-4 py-2">
                {crypto.sparkline_in_7d?.price ? (
                  <Sparklines data={crypto.sparkline_in_7d.price}>
                    <SparklinesLine color={crypto.price_change_percentage_7d_in_currency > 0 ? 'green' : 'red'} />
                  </Sparklines>
                ) : (
                  'No data'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded-md mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedCrypto && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-center">Historical Data for {cryptos.find(crypto => crypto.id === selectedCrypto).name}</h2>
          <Sparklines data={historicalData.map(([timestamp, price]) => price)}>
            <SparklinesLine color="yellow" />
          </Sparklines>
        </div>
      )}
    </div>
  );
};

export default CryptoList;
