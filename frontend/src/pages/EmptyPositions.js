import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiMapPin, FiHome, FiUsers, FiTrendingUp } from 'react-icons/fi';

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
        toast.success('Başvurunuz alındı! 🎉');
      }
    } catch (error) {
      toast.error('Başvuru sırasında hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner-modern"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="modern-card" style={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        color: 'white',
        marginBottom: '30px'
      }}>
        <span className="emoji-lg">🏥</span>
        <h1 style={{ fontSize: '32px', marginTop: '20px' }}>Boş Pozisyonlar</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          🔍 Müsait Aile Hekimliği Birimleri
        </p>
      </div>

      <div className="modern-card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="emoji-md">🗺️</span>
            <select
              className="modern-input"
              style={{ maxWidth: '250px' }}
              value={selectedIlce}
              onChange={(e) => setSelectedIlce(e.target.value)}
            >
              <option value="">📍 Tüm İlçeler</option>
              {ilceList.map(ilce => (
                <option key={ilce} value={ilce}>{ilce}</option>
              ))}
            </select>
          </div>

          <div className="badge-modern badge-success" style={{ padding: '12px 25px', fontSize: '16px' }}>
            🎯 Toplam {filteredPositions.length} Boş Pozisyon
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {filteredPositions.map((position) => (
          <div
            key={position.id}
            className="modern-card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '20px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
            }}>
              ✨ MÜSAIT
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                color: '#333'
              }}>
                <span className="emoji-md" style={{ marginRight: '10px' }}>🏥</span>
                {position.aile_sagligi_merkezi || 'Belirtilmemiş ASM'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiMapPin style={{ color: '#1e88e5', fontSize: '18px' }} />
                  <strong>İlçe:</strong> {position.ilce}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiHome style={{ color: '#f44336', fontSize: '18px' }} />
                  <strong>Birim:</strong> {position.aile_hekimligi_birimi || 'Belirtilmemiş'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiUsers style={{ color: '#ff9800', fontSize: '18px' }} />
                  <strong>Nüfus:</strong> {position.nufus || 'Belirtilmemiş'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiTrendingUp style={{ color: '#4caf50', fontSize: '18px' }} />
                  <strong>Puan:</strong>
                  <span className="badge-modern badge-info">
                    {position.hizmet_puani || '0'}
                  </span>
                </div>
              </div>

              <button
                className="btn-modern btn-gradient-blue"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={() => handleApply(position.id)}
              >
                🚀 Başvur
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="modern-card" style={{ textAlign: 'center', padding: '60px' }}>
          <span className="emoji-lg">🔍</span>
          <h3 style={{ marginTop: '20px', color: '#666' }}>
            Boş Pozisyon Bulunamadı
          </h3>
          <p style={{ color: '#999', marginTop: '10px' }}>
            {selectedIlce ? `${selectedIlce} ilçesinde boş pozisyon bulunmamaktadır.` : 'Şu anda boş pozisyon bulunmamaktadır.'}
          </p>
        </div>
      )}

      <button className="fab" style={{ bottom: '100px' }} onClick={fetchEmptyPositions}>
        <span style={{ fontSize: '24px' }}>🔄</span>
      </button>
    </div>
  );
};

export default EmptyPositions;