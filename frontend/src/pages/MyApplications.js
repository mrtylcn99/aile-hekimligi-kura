import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FiCheck, FiX, FiClock, FiFileText, FiUsers, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import '../styles/my-applications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [tercihler, setTercihler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basvurular');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tercihResponse = await axios.get('/api/user/tercihler');
      setTercihler(tercihResponse.data.tercihler);
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (pdfPath) => {
    if (pdfPath) {
      const fileName = pdfPath.split('/').pop();
      const link = document.createElement('a');
      link.href = `/exports/${fileName}`;
      link.download = fileName;
      link.click();
    }
  };

  const getTercihIcon = (durum) => {
    switch (durum) {
      case 'kabul':
        return <FiCheck color="green" />;
      case 'red':
        return <FiX color="red" />;
      case 'pas':
        return <FiClock color="orange" />;
      default:
        return <FiClock color="gray" />;
    }
  };

  const getTercihBadge = (durum) => {
    const styles = {
      kabul: { backgroundColor: '#28a745', color: 'white' },
      red: { backgroundColor: '#dc3545', color: 'white' },
      pas: { backgroundColor: '#ffc107', color: 'dark' },
      beklemede: { backgroundColor: '#6c757d', color: 'white' }
    };

    return (
      <span style={{
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontWeight: 'bold',
        ...styles[durum]
      }}>
        {durum.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <ClipLoader color="#007bff" size={50} />
      </div>
    );
  }

  return (
    <div>
      <h2>Başvurularım ve Tercihlerim</h2>

      <div className="tab-container">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'basvurular' ? 'active' : ''}`}
            onClick={() => setActiveTab('basvurular')}
          >
            <FiFileText className="tab-icon" />
            Başvuru Formlarım
          </button>
          <button
            className={`tab-button ${activeTab === 'tercihler' ? 'active' : ''}`}
            onClick={() => setActiveTab('tercihler')}
          >
            <FiUsers className="tab-icon" />
            Kura Tercihlerim ({tercihler.length})
          </button>
        </div>
      </div>

      {activeTab === 'basvurular' && (
        <div className="tab-content">
          {applications.length > 0 ? (
            <div className="applications-grid">
              {applications.map(app => (
                <div key={app.id} className="application-card">
                  <div className="app-header">
                    <h4>{app.title}</h4>
                    <span className="app-date">{app.date}</span>
                  </div>
                  <div className="app-body">
                    <p>{app.description}</p>
                  </div>
                  <div className="app-footer">
                    <button
                      className="btn-pdf"
                      onClick={() => downloadPDF(app.pdfPath)}
                    >
                      <FiDownload /> PDF İndir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>
                Henüz kayıtlı başvuru formunuz bulunmamaktadır.
                <br />
                <a href="/basvuru-formu" className="link-primary">
                  Yeni başvuru formu oluştur
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tercihler' && (
        <div className="tab-content">
          {tercihler.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sıra</th>
                    <th>Pozisyon</th>
                    <th>İlçe</th>
                    <th>ASM</th>
                    <th>Tercih Durumu</th>
                    <th>Tercih Tarihi</th>
                    <th>Bekleme Süresi</th>
                  </tr>
                </thead>
                <tbody>
                  {tercihler.map((tercih, index) => (
                    <tr key={tercih.id}>
                      <td>{tercih.sira_no}</td>
                      <td>{tercih.ad} {tercih.soyad}</td>
                      <td>{tercih.ilce}</td>
                      <td>{tercih.aile_sagligi_merkezi}</td>
                      <td>{getTercihBadge(tercih.tercih_durumu)}</td>
                      <td>
                        {format(new Date(tercih.tercih_tarihi), 'dd MMMM yyyy HH:mm', { locale: tr })}
                      </td>
                      <td>{tercih.sira_bekleme_suresi || '-'} gün</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Henüz kura tercihi yapmadınız.
              <br />
              <a href="/kura-listesi" style={{ color: '#007bff', marginTop: '10px', display: 'inline-block' }}>
                Kura listesini görüntüle
              </a>
            </p>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <h4>Tercih Durumları Açıklama</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiCheck color="green" size={20} />
            <div>
              <strong>Kabul:</strong> Bu pozisyonu kabul ettiniz
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiX color="red" size={20} />
            <div>
              <strong>Red:</strong> Bu pozisyonu reddettiniz
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiClock color="orange" size={20} />
            <div>
              <strong>Pas:</strong> Sıranızı bir sonraki tura bıraktınız
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;