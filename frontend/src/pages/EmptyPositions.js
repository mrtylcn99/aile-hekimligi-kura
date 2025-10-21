import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiMapPin, FiRefreshCw, FiSearch } from 'react-icons/fi';
import PositionCard from '../components/PositionCard';
import '../styles/empty-positions.css';

const EmptyPositions = () => {
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIlce, setSelectedIlce] = useState('');
  const [ilceList, setIlceList] = useState([]);

  useEffect(() => {
    fetchEmptyPositions();
  }, []);

  useEffect(() => {
    if (selectedIlce) {
      setFilteredPositions(positions.filter(p => p.ilce === selectedIlce));
    } else {
      setFilteredPositions(positions);
    }
  }, [selectedIlce, positions]);

  const fetchEmptyPositions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/kura/bos-pozisyonlar');
      setPositions(response.data.data || []);
      setFilteredPositions(response.data.data || []);

      const uniqueIlce = [...new Set((response.data.data || []).map(p => p.ilce))];
      setIlceList(uniqueIlce);
    } catch (error) {
      console.error('Boş pozisyonlar yüklenemedi:', error);
      toast.error('Boş pozisyonlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (positionId) => {
    try {
      const response = await axios.post('/api/kura/bos-pozisyon-basvuru', {
        pozisyon_id: positionId
      });

      if (response.data.success) {
        toast.success('Başvurunuz alındı!');
      }
    } catch (error) {
      toast.error('Başvuru sırasında hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-modern"></div>
        <p className="loading-text">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="empty-positions-container">
      <div className="page-header">
        <FiMapPin className="header-icon" />
        <h1 className="header-title">Boş Pozisyonlar</h1>
        <p className="header-subtitle">
          Müsait Aile Hekimliği Birimleri
        </p>
      </div>

      <div className="filter-card">
        <div className="filter-content">
          <div className="filter-group">
            <FiSearch className="filter-icon" />
            <select
              className="filter-select"
              value={selectedIlce}
              onChange={(e) => setSelectedIlce(e.target.value)}
            >
              <option value="">Tüm İlçeler</option>
              {ilceList.map(ilce => (
                <option key={ilce} value={ilce}>{ilce}</option>
              ))}
            </select>
          </div>

          <div className="position-count">
            Toplam <strong>{filteredPositions.length}</strong> Boş Pozisyon
          </div>
        </div>
      </div>

      <div className="positions-grid">
        {filteredPositions.map((position) => (
          <PositionCard
            key={position.id}
            position={position}
            onApply={handleApply}
          />
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="empty-state-card">
          <FiSearch className="empty-icon" />
          <h3 className="empty-title">
            Boş Pozisyon Bulunamadı
          </h3>
          <p className="empty-text">
            {selectedIlce ? `${selectedIlce} ilçesinde boş pozisyon bulunmamaktadır.` : 'Şu anda boş pozisyon bulunmamaktadır.'}
          </p>
        </div>
      )}

      <button className="fab-button" onClick={fetchEmptyPositions}>
        <FiRefreshCw className="fab-icon" />
      </button>
    </div>
  );
};

export default EmptyPositions;