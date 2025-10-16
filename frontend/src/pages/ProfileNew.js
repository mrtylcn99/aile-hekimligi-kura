import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/healthcare-design.css';
import '../styles/profile-vibrant.css';

const ProfileNew = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for different sections
  const [personalInfo, setPersonalInfo] = useState({
    ad: '',
    soyad: '',
    tc_kimlik: '',
    telefon: '',
    email: '',
    dogum_tarihi: '',
    dogum_yeri: '',
    cinsiyet: 'Erkek',
    kan_grubu: 'A+',
    adres: '',
    il: 'İstanbul',
    ilce: ''
  });

  const [clinicsData, setClinicsData] = useState({
    current_clinic: 'Kadıköy Aile Sağlığı Merkezi',
    current_unit: 'Birim 3',
    start_date: '2019-03-15',
    preferred_locations: ['Üsküdar', 'Beşiktaş', 'Şişli'],
    experience_years: 12,
    specializations: ['Aile Hekimliği', 'Acil Tıp']
  });

  const [purchases, setPurchases] = useState([
    {
      id: 1,
      type: 'Premium Abonelik',
      price: 99.90,
      date: '2024-01-15',
      status: 'active',
      expires: '2025-01-15',
      features: ['Reklamsız Kullanım', 'Öncelikli Destek', 'Gelişmiş Raporlar']
    }
  ]);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
      kura_updates: true,
      system_updates: false
    },
    theme: 'light',
    language: 'tr',
    privacy: {
      profile_visible: true,
      show_ranking: true,
      share_statistics: false
    },
    accessibility: {
      font_size: 'normal',
      high_contrast: false,
      screen_reader: false
    }
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        ad: user.ad || '',
        soyad: user.soyad || '',
        tc_kimlik: user.tc_kimlik || '',
        telefon: user.telefon || '',
        email: user.email || '',
        dogum_tarihi: user.dogum_tarihi || '',
        dogum_yeri: user.dogum_yeri || ''
      }));
    }
  }, [user]);

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/user/profil', personalInfo);
      alert('Bilgileriniz güncellendi!');
    } catch (error) {
      alert('Güncelleme başarısız!');
    } finally {
      setLoading(false);
    }
  };

  const renderMedicalCard = () => (
    <div className="medical-card">
      <div className="medical-card-header">
        <div>
          <div className="medical-card-title">T.C. Sağlık Bakanlığı</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            Aile Hekimliği Kimlik Kartı
          </div>
        </div>
        <div className="medical-card-chip"></div>
      </div>

      <div className="medical-card-info">
        <div className="medical-card-field">
          <div className="medical-card-label">Ad Soyad</div>
          <div className="medical-card-value">
            {personalInfo.ad} {personalInfo.soyad}
          </div>
        </div>
        <div className="medical-card-field">
          <div className="medical-card-label">TC Kimlik</div>
          <div className="medical-card-value">{personalInfo.tc_kimlik}</div>
        </div>
        <div className="medical-card-field">
          <div className="medical-card-label">Sicil No</div>
          <div className="medical-card-value">{user?.sicil_no || 'AH-2024-1234'}</div>
        </div>
        <div className="medical-card-field">
          <div className="medical-card-label">Hizmet Puanı</div>
          <div className="medical-card-value">87.5</div>
        </div>
        <div className="medical-card-field">
          <div className="medical-card-label">Ünvan</div>
          <div className="medical-card-value">{user?.unvan || 'Aile Hekimi'}</div>
        </div>
        <div className="medical-card-field">
          <div className="medical-card-label">Hizmet Yılı</div>
          <div className="medical-card-value">{clinicsData.experience_years} Yıl</div>
        </div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>
            Verilme Tarihi: 01.01.2024
          </div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>
            Geçerlilik: 31.12.2025
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div>
      {/* Medical Card */}
      {renderMedicalCard()}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '24px' }}>
        <div className="stat-widget">
          <div className="stat-widget-value">157</div>
          <div className="stat-widget-label">Kura Sırası</div>
          <div className="stat-widget-change positive">↑ 12 sıra yükseldi</div>
        </div>
        <div className="stat-widget">
          <div className="stat-widget-value">87.5</div>
          <div className="stat-widget-label">Hizmet Puanı</div>
          <div className="stat-widget-change positive">↑ 2.3 puan</div>
        </div>
        <div className="stat-widget">
          <div className="stat-widget-value">12</div>
          <div className="stat-widget-label">Hizmet Yılı</div>
        </div>
        <div className="stat-widget">
          <div className="stat-widget-value">3</div>
          <div className="stat-widget-label">Aktif Başvuru</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="profile-section" style={{ marginTop: '24px' }}>
        <h3 className="h3-health" style={{ marginBottom: '16px' }}>Hızlı İşlemler</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <button className="btn-health btn-secondary-health">
            📄 Belge İndir
          </button>
          <button className="btn-health btn-ghost-health">
            📊 Raporları Gör
          </button>
          <button className="btn-health btn-ghost-health">
            🔄 Bilgileri Güncelle
          </button>
          <button className="btn-health btn-ghost-health">
            📱 QR Kod Oluştur
          </button>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <div className="profile-section-header">
        <div className="profile-section-title">
          <div className="profile-section-icon">👤</div>
          <span>Kişisel Bilgiler</span>
        </div>
        <button className="btn-health btn-ghost-health" style={{ padding: '8px 16px', fontSize: '12px' }}>
          Düzenle
        </button>
      </div>

      <form onSubmit={handlePersonalInfoSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="input-group-health">
            <label className="input-label-health">Ad</label>
            <input
              type="text"
              className="input-health"
              value={personalInfo.ad}
              onChange={(e) => setPersonalInfo({ ...personalInfo, ad: e.target.value })}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">Soyad</label>
            <input
              type="text"
              className="input-health"
              value={personalInfo.soyad}
              onChange={(e) => setPersonalInfo({ ...personalInfo, soyad: e.target.value })}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">TC Kimlik No</label>
            <input
              type="text"
              className="input-health"
              value={personalInfo.tc_kimlik}
              disabled
              style={{ opacity: 0.7 }}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">Telefon</label>
            <input
              type="tel"
              className="input-health"
              value={personalInfo.telefon}
              onChange={(e) => setPersonalInfo({ ...personalInfo, telefon: e.target.value })}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">E-posta</label>
            <input
              type="email"
              className="input-health"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">Doğum Tarihi</label>
            <input
              type="date"
              className="input-health"
              value={personalInfo.dogum_tarihi}
              onChange={(e) => setPersonalInfo({ ...personalInfo, dogum_tarihi: e.target.value })}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">Doğum Yeri</label>
            <input
              type="text"
              className="input-health"
              value={personalInfo.dogum_yeri}
              onChange={(e) => setPersonalInfo({ ...personalInfo, dogum_yeri: e.target.value })}
            />
          </div>

          <div className="input-group-health">
            <label className="input-label-health">Cinsiyet</label>
            <select
              className="input-health"
              value={personalInfo.cinsiyet}
              onChange={(e) => setPersonalInfo({ ...personalInfo, cinsiyet: e.target.value })}
            >
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>

          <div className="input-group-health">
            <label className="input-label-health">Kan Grubu</label>
            <select
              className="input-health"
              value={personalInfo.kan_grubu}
              onChange={(e) => setPersonalInfo({ ...personalInfo, kan_grubu: e.target.value })}
            >
              <option value="A+">A Rh+</option>
              <option value="A-">A Rh-</option>
              <option value="B+">B Rh+</option>
              <option value="B-">B Rh-</option>
              <option value="AB+">AB Rh+</option>
              <option value="AB-">AB Rh-</option>
              <option value="0+">0 Rh+</option>
              <option value="0-">0 Rh-</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button type="submit" className="btn-health btn-primary-health" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderClinicsLabs = () => (
    <div>
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">🏥</div>
            <span>Çalışma Bilgileri</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Current Position */}
          <div className="health-card-compact" style={{ background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)' }}>
            <h4 className="h4-health" style={{ marginBottom: '16px' }}>Mevcut Pozisyon</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="body-small">Kurum:</span>
                <span className="body-regular" style={{ fontWeight: 600 }}>{clinicsData.current_clinic}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="body-small">Birim:</span>
                <span className="body-regular">{clinicsData.current_unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="body-small">Başlangıç Tarihi:</span>
                <span className="body-regular">{new Date(clinicsData.start_date).toLocaleDateString('tr-TR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="body-small">Çalışma Süresi:</span>
                <span className="body-regular">{Math.floor((Date.now() - new Date(clinicsData.start_date)) / (365.25 * 24 * 60 * 60 * 1000))} yıl</span>
              </div>
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="health-card-compact">
            <h4 className="h4-health" style={{ marginBottom: '16px' }}>Tercih Edilen Lokasyonlar</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {clinicsData.preferred_locations.map((loc, index) => (
                <span
                  key={index}
                  style={{
                    background: 'var(--gray-100)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    color: 'var(--primary-navy)'
                  }}
                >
                  📍 {loc}
                </span>
              ))}
              <button
                style={{
                  background: 'var(--secondary-orange)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                + Ekle
              </button>
            </div>
          </div>

          {/* Experience & Specializations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="health-card-compact">
              <h4 className="h4-health" style={{ marginBottom: '12px' }}>Deneyim</h4>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-navy)' }}>
                {clinicsData.experience_years} Yıl
              </div>
              <div className="body-small">Toplam hizmet süresi</div>
            </div>

            <div className="health-card-compact">
              <h4 className="h4-health" style={{ marginBottom: '12px' }}>Uzmanlık Alanları</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {clinicsData.specializations.map((spec, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span>
                    <span className="body-regular">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work History */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">📋</div>
            <span>Çalışma Geçmişi</span>
          </div>
          <button className="btn-health btn-ghost-health" style={{ padding: '8px 16px', fontSize: '12px' }}>
            Tümünü Gör
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { clinic: 'Kadıköy ASM', unit: 'Birim 3', period: '2019 - Devam', status: 'active' },
            { clinic: 'Üsküdar ASM', unit: 'Birim 1', period: '2015 - 2019', status: 'completed' },
            { clinic: 'Maltepe ASM', unit: 'Birim 2', period: '2012 - 2015', status: 'completed' }
          ].map((job, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: job.status === 'active' ? 'var(--gray-50)' : 'transparent', borderRadius: 'var(--radius-md)' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: job.status === 'active' ? 'var(--success)' : 'var(--gray-300)'
              }}></div>
              <div style={{ flex: 1 }}>
                <div className="body-regular" style={{ fontWeight: 600 }}>{job.clinic}</div>
                <div className="body-small">{job.unit}</div>
              </div>
              <div className="body-small">{job.period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div>
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">💳</div>
            <span>Mevcut Abonelik</span>
          </div>
        </div>

        {purchases.map((purchase) => (
          <div key={purchase.id} className="purchase-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{purchase.type}</h3>
                <div className="purchase-badge">
                  <span style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }}></span>
                  Aktif
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>₺{purchase.price}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>/aylık</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>Başlangıç Tarihi</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(purchase.date).toLocaleDateString('tr-TR')}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>Bitiş Tarihi</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(purchase.expires).toLocaleDateString('tr-TR')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '12px' }}>Abonelik Özellikleri:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {purchase.features.map((feature, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✓</span>
                    <span style={{ fontSize: '14px' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-health" style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              Planı Yükselt
            </button>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">📊</div>
            <span>Ödeme Geçmişi</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { date: '2024-03-01', amount: 99.90, status: 'Ödendi', method: 'Kredi Kartı' },
            { date: '2024-02-01', amount: 99.90, status: 'Ödendi', method: 'Kredi Kartı' },
            { date: '2024-01-01', amount: 99.90, status: 'Ödendi', method: 'Kredi Kartı' }
          ].map((payment, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div className="body-regular" style={{ fontWeight: 600 }}>₺{payment.amount}</div>
                <div className="body-small">{payment.method}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="body-small">{payment.date}</div>
                <span style={{
                  background: 'var(--success)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px'
                }}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-health btn-ghost-health" style={{ marginTop: '16px', width: '100%' }}>
          Tüm Ödemeleri Gör
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      {/* Notifications */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">🔔</div>
            <span>Bildirim Tercihleri</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries({
            email: 'E-posta Bildirimleri',
            sms: 'SMS Bildirimleri',
            push: 'Anlık Bildirimler',
            kura_updates: 'Kura Güncellemeleri',
            system_updates: 'Sistem Güncellemeleri'
          }).map(([key, label]) => (
            <div key={key} className="settings-item">
              <div className="settings-item-left">
                <div className="settings-item-text">
                  <div className="settings-item-title">{label}</div>
                  <div className="settings-item-desc">
                    {key === 'email' && 'Önemli bildirimler e-posta ile gönderilsin'}
                    {key === 'sms' && 'Acil durumlar için SMS ile bilgilendirilme'}
                    {key === 'push' && 'Uygulama içi anlık bildirimler'}
                    {key === 'kura_updates' && 'Kura sonuçları ve güncellemeler'}
                    {key === 'system_updates' && 'Bakım ve güncelleme bildirimleri'}
                  </div>
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.notifications[key]}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [key]: e.target.checked
                    }
                  })}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">🎨</div>
            <span>Görünüm</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="input-label-health">Tema</label>
            <select
              className="input-health"
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            >
              <option value="light">Açık Tema</option>
              <option value="dark">Koyu Tema</option>
              <option value="auto">Otomatik</option>
            </select>
          </div>

          <div>
            <label className="input-label-health">Dil</label>
            <select
              className="input-health"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div>
            <label className="input-label-health">Yazı Boyutu</label>
            <select
              className="input-health"
              value={settings.accessibility.font_size}
              onChange={(e) => setSettings({
                ...settings,
                accessibility: {
                  ...settings.accessibility,
                  font_size: e.target.value
                }
              })}
            >
              <option value="small">Küçük</option>
              <option value="normal">Normal</option>
              <option value="large">Büyük</option>
              <option value="xlarge">Çok Büyük</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">🔒</div>
            <span>Gizlilik</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries({
            profile_visible: 'Profil Görünürlüğü',
            show_ranking: 'Sıralama Bilgisi',
            share_statistics: 'İstatistik Paylaşımı'
          }).map(([key, label]) => (
            <div key={key} className="settings-item">
              <div className="settings-item-left">
                <div className="settings-item-text">
                  <div className="settings-item-title">{label}</div>
                  <div className="settings-item-desc">
                    {key === 'profile_visible' && 'Profiliniz diğer kullanıcılara görünsün'}
                    {key === 'show_ranking' && 'Kura sıranız herkese açık olsun'}
                    {key === 'share_statistics' && 'İstatistikleriniz anonim olarak paylaşılsın'}
                  </div>
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.privacy[key]}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: {
                      ...settings.privacy,
                      [key]: e.target.checked
                    }
                  })}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div>
      {/* About Us */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">ℹ️</div>
            <span>Hakkımızda</span>
          </div>
        </div>

        <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>Aile Hekimliği Kura Sistemi</strong>, T.C. Sağlık Bakanlığı İstanbul İl Sağlık Müdürlüğü'nün
            resmi olmayan yardımcı uygulamasıdır. 2024 yılından beri hizmet vermekteyiz.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Amacımız, aile hekimlerinin kura süreçlerini daha verimli ve şeffaf bir şekilde yönetmelerine
            yardımcı olmaktır. Sistemimiz, güncel kura listelerini takip etmenizi, başvurularınızı yönetmenizi
            ve sıranızı kontrol etmenizi sağlar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>10K+</div>
              <div className="body-small">Aktif Kullanıcı</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>2500+</div>
              <div className="body-small">Kura Pozisyonu</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>39</div>
              <div className="body-small">İlçe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">⚖️</div>
            <span>Yasal Bilgiler</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="health-card-compact" style={{ background: 'var(--gray-50)' }}>
            <h4 className="h4-health" style={{ marginBottom: '8px' }}>Resmi İzin Belgesi</h4>
            <p className="body-small" style={{ marginBottom: '12px' }}>
              T.C. Sağlık Bakanlığı İstanbul İl Sağlık Müdürlüğü tarafından onaylanmıştır.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="body-small">İzin No:</span>
              <span className="body-small" style={{ fontWeight: 600 }}>2024/IST/AHS-1234</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="body-small">Tarih:</span>
              <span className="body-small">01.01.2024</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <button className="btn-health btn-ghost-health" style={{ justifyContent: 'space-between' }}>
              <span>📄 Kullanım Şartları</span>
              <span>→</span>
            </button>
            <button className="btn-health btn-ghost-health" style={{ justifyContent: 'space-between' }}>
              <span>🔒 Gizlilik Politikası</span>
              <span>→</span>
            </button>
            <button className="btn-health btn-ghost-health" style={{ justifyContent: 'space-between' }}>
              <span>📋 KVKK Aydınlatma Metni</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-title">
            <div className="profile-section-icon">📞</div>
            <span>İletişim</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="health-card-compact">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--primary-navy)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                📧
              </div>
              <div>
                <div className="body-small">E-posta</div>
                <div className="body-regular" style={{ fontWeight: 600 }}>destek@ailehekimligikura.gov.tr</div>
              </div>
            </div>
          </div>

          <div className="health-card-compact">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--secondary-orange)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                📱
              </div>
              <div>
                <div className="body-small">Telefon</div>
                <div className="body-regular" style={{ fontWeight: 600 }}>0850 123 45 67</div>
                <div className="body-small">Hafta içi 09:00 - 18:00</div>
              </div>
            </div>
          </div>

          <div className="health-card-compact">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--accent-blue)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                📍
              </div>
              <div>
                <div className="body-small">Adres</div>
                <div className="body-regular">
                  İstanbul İl Sağlık Müdürlüğü<br />
                  Dilmenler Cad. No:1 34387<br />
                  Şişli / İstanbul
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
          <h4 className="h4-health" style={{ marginBottom: '12px' }}>Sıkça Sorulan Sorular</h4>
          <button className="btn-health btn-secondary-health" style={{ width: '100%' }}>
            SSS'leri Görüntüle
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Top Navigation */}
      <div className="nav-health">
        <div className="nav-health-container">
          <div className="nav-health-brand">
            <span style={{ fontSize: '24px' }}>🏥</span>
            <span>Aile Hekimliği Kura</span>
          </div>
          <button onClick={() => navigate('/')} className="btn-health btn-ghost-health" style={{ padding: '8px 16px' }}>
            Ana Sayfa
          </button>
        </div>
      </div>

      <div className="health-container" style={{ paddingTop: '24px', paddingBottom: '100px' }}>
        {/* Profile Header */}
        <div className="health-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-navy-dark))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              {personalInfo.ad.charAt(0)}{personalInfo.soyad.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="h2-health">Dr. {personalInfo.ad} {personalInfo.soyad}</h1>
              <p className="body-regular" style={{ marginTop: '4px' }}>
                {user?.unvan || 'Aile Hekimi'} • {clinicsData.current_clinic}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span style={{
                  background: 'var(--success)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px'
                }}>
                  Aktif
                </span>
                <span style={{
                  background: 'var(--gray-200)',
                  color: 'var(--gray-700)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px'
                }}>
                  Premium Üye
                </span>
              </div>
            </div>
            <button onClick={logout} className="btn-health btn-ghost-health">
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="health-card" style={{ marginBottom: '24px', padding: '12px' }}>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Genel Bakış', icon: '📊' },
              { id: 'personal', label: 'Kişisel Bilgiler', icon: '👤' },
              { id: 'clinics', label: 'Çalışma Bilgileri', icon: '🏥' },
              { id: 'purchases', label: 'Abonelik', icon: '💳' },
              { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
              { id: 'support', label: 'Destek', icon: '💬' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: activeSection === tab.id ? 'var(--primary-navy)' : 'transparent',
                  color: activeSection === tab.id ? 'white' : 'var(--gray-600)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'personal' && renderPersonalInfo()}
          {activeSection === 'clinics' && renderClinicsLabs()}
          {activeSection === 'purchases' && renderPurchases()}
          {activeSection === 'settings' && renderSettings()}
          {activeSection === 'support' && renderSupport()}
        </div>
      </div>
    </div>
  );
};

// Add switch styles
const style = document.createElement('style');
style.textContent = `
  .switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--gray-300);
    transition: .4s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--primary-navy);
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }
`;
document.head.appendChild(style);

export default ProfileNew;