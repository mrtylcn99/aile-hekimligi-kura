import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../config/axios';
import { FiUpload, FiDownload, FiRefreshCw, FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [availablePDFs, setAvailablePDFs] = useState([]);
  const [importStats, setImportStats] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error('Bu sayfaya erişim yetkiniz yok');
      navigate('/');
      return;
    }

    fetchAvailablePDFs();
  }, [user, navigate]);

  const fetchAvailablePDFs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pdf-automation/available-pdfs');
      setAvailablePDFs(response.data.pdfs || []);
    } catch (error) {
      console.error('PDF listesi alınamadı:', error);
      toast.error('PDF listesi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const importLatestPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/pdf-automation/import-latest');

      setImportStats(response.data.stats);
      toast.success(`${response.data.stats.imported} yeni kayıt, ${response.data.stats.updated} güncelleme yapıldı`);

      // Refresh PDF list
      fetchAvailablePDFs();
    } catch (error) {
      console.error('PDF import hatası:', error);
      toast.error(error.response?.data?.error || 'PDF içe aktarılamadı');
    } finally {
      setLoading(false);
    }
  };

  const importFromUrl = async () => {
    if (!pdfUrl) {
      toast.error('Lütfen PDF URL\'si girin');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/pdf-automation/import-from-url', {
        pdfUrl
      });

      setImportStats(response.data.stats);
      toast.success(`${response.data.stats.imported} yeni kayıt, ${response.data.stats.updated} güncelleme yapıldı`);
      setPdfUrl('');
    } catch (error) {
      console.error('PDF import hatası:', error);
      toast.error(error.response?.data?.error || 'PDF içe aktarılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Admin Paneli - PDF Otomasyonu</h1>
        <p>T.C. Sağlık Bakanlığı verilerini otomatik olarak içe aktarın</p>
      </div>

      <div className="admin-content">
        {/* Quick Actions */}
        <div className="admin-card">
          <h3>Hızlı İşlemler</h3>
          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={importLatestPDF}
              disabled={loading}
            >
              <FiDownload /> En Son PDF'i İçe Aktar
            </button>

            <button
              className="btn btn-secondary"
              onClick={fetchAvailablePDFs}
              disabled={loading}
            >
              <FiRefreshCw /> PDF Listesini Yenile
            </button>
          </div>
        </div>

        {/* Custom URL Import */}
        <div className="admin-card">
          <h3>Manuel PDF İçe Aktarma</h3>
          <div className="url-import-form">
            <input
              type="url"
              placeholder="PDF URL'sini girin..."
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="form-control"
            />
            <button
              className="btn btn-primary"
              onClick={importFromUrl}
              disabled={loading || !pdfUrl}
            >
              <FiUpload /> İçe Aktar
            </button>
          </div>
        </div>

        {/* Import Statistics */}
        {importStats && (
          <div className="admin-card stats-card">
            <h3>Son İçe Aktarma İstatistikleri</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Toplam Kayıt:</span>
                <span className="stat-value">{importStats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Yeni Eklenen:</span>
                <span className="stat-value success">{importStats.imported}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Güncellenen:</span>
                <span className="stat-value warning">{importStats.updated}</span>
              </div>
              {importStats.source && (
                <div className="stat-item full-width">
                  <span className="stat-label">Kaynak:</span>
                  <span className="stat-value">{importStats.source}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available PDFs */}
        <div className="admin-card">
          <h3>Mevcut PDF Dosyaları</h3>
          {loading ? (
            <div className="loading-spinner">Yükleniyor...</div>
          ) : availablePDFs.length > 0 ? (
            <div className="pdf-list">
              {availablePDFs.map((pdf, index) => (
                <div key={index} className="pdf-item">
                  <FiFileText className="pdf-icon" />
                  <div className="pdf-info">
                    <h4>{pdf.title || `PDF ${index + 1}`}</h4>
                    <small>{new Date(pdf.date).toLocaleDateString('tr-TR')}</small>
                  </div>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-small"
                  >
                    <FiDownload /> İndir
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Henüz PDF dosyası bulunamadı.</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-panel-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .admin-header h1 {
          color: #333;
          margin-bottom: 10px;
        }

        .admin-header p {
          color: #666;
        }

        .admin-content {
          display: grid;
          gap: 20px;
        }

        .admin-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .admin-card h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #333;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .url-import-form {
          display: flex;
          gap: 10px;
        }

        .url-import-form input {
          flex: 1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-item.full-width {
          grid-column: 1 / -1;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .stat-value.success {
          color: #28a745;
        }

        .stat-value.warning {
          color: #ffc107;
        }

        .pdf-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pdf-item {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .pdf-item:hover {
          background: #e9ecef;
        }

        .pdf-icon {
          font-size: 24px;
          color: #ff6b35;
          margin-right: 15px;
        }

        .pdf-info {
          flex: 1;
        }

        .pdf-info h4 {
          margin: 0;
          font-size: 14px;
        }

        .pdf-info small {
          color: #666;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #ff6b35;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #ff5722;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }

        .btn-small {
          padding: 5px 10px;
          font-size: 12px;
        }

        .form-control {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .loading-spinner {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .no-data {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .admin-panel-container {
            padding: 10px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .url-import-form {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;