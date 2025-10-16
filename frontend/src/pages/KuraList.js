import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FiCheck, FiX, FiSkipForward, FiFilter } from 'react-icons/fi';

const KuraList = () => {
  const [kuraList, setKuraList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ilce: '',
    unvan: '',
    orderBy: 'hizmet_puani'
  });
  const [ilceList, setIlceList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchIlceList();
    fetchKuraList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchIlceList = async () => {
    try {
      const response = await axios.get('/api/kura/ilce-listesi');
      setIlceList(response.data.ilceler);
    } catch (error) {
      console.error('İlçe listesi alınamadı:', error);
    }
  };

  const fetchKuraList = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.ilce) params.append('ilce', filters.ilce);
      if (filters.unvan) params.append('unvan', filters.unvan);
      params.append('orderBy', filters.orderBy);

      const response = await axios.get(`/api/kura/liste?${params.toString()}`);
      setKuraList(response.data.data);
    } catch (error) {
      toast.error('Kura listesi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleTercih = async (kura_id, tercih_durumu) => {
    try {
      const response = await axios.post('/api/kura/tercih', {
        kura_id,
        tercih_durumu
      });

      if (response.data.success) {
        toast.success(`Tercihiniz kaydedildi: ${tercih_durumu.toUpperCase()}`);
        setShowModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      toast.error('Tercih kaydedilemedi');
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
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
      <div className="modern-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1e88e5 0%, #1976d2 100%)', color: 'white', marginBottom: '30px' }}>
        <span className="emoji-lg">🎲</span>
        <h1 style={{ fontSize: '32px', marginTop: '20px' }}>Kura Listesi</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>🏥 Aile Hekimliği Pozisyonları</p>
      </div>

      <div className="modern-card" style={{ marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <span className="emoji-md" style={{ marginRight: '10px' }}>🔍</span>
          Filtreler
        </h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="modern-input"
            style={{ maxWidth: '200px', borderRadius: '50px' }}
            value={filters.ilce}
            onChange={(e) => handleFilterChange('ilce', e.target.value)}
          >
            <option value="">🗺️ Tüm İlçeler</option>
            {ilceList.map(ilce => (
              <option key={ilce} value={ilce}>{ilce}</option>
            ))}
          </select>

          <select
            className="modern-input"
            style={{ maxWidth: '200px', borderRadius: '50px' }}
            value={filters.unvan}
            onChange={(e) => handleFilterChange('unvan', e.target.value)}
          >
            <option value="">👨‍⚕️ Tüm Ünvanlar</option>
            <option value="AİLE HEKİMLİĞİ UZMANI">Aile Hekimliği Uzmanı</option>
            <option value="YER DEĞİŞİKLİĞİ">Yer Değişikliği</option>
            <option value="PRATİSYEN">Pratisyen</option>
          </select>

          <select
            className="modern-input"
            style={{ maxWidth: '200px', borderRadius: '50px' }}
            value={filters.orderBy}
            onChange={(e) => handleFilterChange('orderBy', e.target.value)}
          >
            <option value="hizmet_puani">📊 Hizmet Puanına Göre</option>
            <option value="sira_no">🔢 Sıra No'ya Göre</option>
            <option value="ad">🔤 Ada Göre</option>
          </select>

          <div className="badge-modern badge-info" style={{ padding: '10px 20px', fontSize: '14px' }}>
            📝 Toplam: {kuraList.length} kayıt
          </div>
        </div>
      </div>

      <div className="modern-card">
        <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
          <span className="emoji-md" style={{ marginRight: '10px' }}>📋</span>
          Pozisyon Listesi
        </h3>
        <div className="modern-table" style={{ overflowX: 'auto', boxShadow: 'none' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>🔢 Sıra</th>
                <th>👤 Ad Soyad</th>
                <th>💯 Hizmet Puanı</th>
                <th>🎓 Ünvan</th>
                <th>📍 İlçe</th>
                <th>🏥 ASM</th>
                <th>🔰 Birim</th>
                <th>✅ Muvafakat</th>
                <th>⚡ İşlem</th>
              </tr>
            </thead>
            <tbody>
              {kuraList.map((item) => (
                <tr key={item.id}>
                  <td>{item.sira_no}</td>
                  <td>{item.ad} {item.soyad}</td>
                  <td>{item.hizmet_puani}</td>
                  <td>{item.unvan}</td>
                  <td>{item.ilce}</td>
                  <td>{item.aile_sagligi_merkezi}</td>
                  <td>{item.aile_hekimligi_birimi}</td>
                  <td>{item.muvafakat_durumu || '-'}</td>
                  <td>
                    <button
                      className="btn-modern btn-gradient-blue"
                      style={{ padding: '8px 15px', fontSize: '12px' }}
                      onClick={() => openModal(item)}
                    >
                      🎯 Tercih Yap
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {kuraList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="emoji-lg">🔍</span>
            <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>
              Filtrelere uygun kayıt bulunamadı
            </p>
          </div>
        )}
      </div>

      {showModal && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modern-card" style={{ maxWidth: '500px', width: '100%', margin: '20px', background: 'white' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
              <span className="emoji-md">🎯</span> Tercih Yapın
            </h3>
            <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px' }}><strong>📍 Pozisyon:</strong> {selectedItem.ilce} - {selectedItem.aile_sagligi_merkezi}</p>
              <p style={{ marginBottom: '10px' }}><strong>🔰 Birim:</strong> {selectedItem.aile_hekimligi_birimi}</p>
              <p><strong>💯 Hizmet Puanı:</strong> <span className="badge-modern badge-info">{selectedItem.hizmet_puani}</span></p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="btn-modern btn-gradient-green"
                onClick={() => handleTercih(selectedItem.id, 'kabul')}
              >
                ✅ Kabul Et
              </button>
              <button
                className="btn-modern btn-gradient-red"
                onClick={() => handleTercih(selectedItem.id, 'red')}
              >
                ❌ Reddet
              </button>
              <button
                className="btn-modern btn-gradient-rainbow"
                onClick={() => handleTercih(selectedItem.id, 'pas')}
              >
                ⏭️ Pas Geç
              </button>
              <button
                className="btn-modern"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
                onClick={() => {
                  setShowModal(false);
                  setSelectedItem(null);
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KuraList;