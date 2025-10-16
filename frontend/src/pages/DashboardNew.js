import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalendarComponent from '../components/CalendarComponent';
import '../styles/healthcare-design.css';

const DashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchUpcomingEvents();
    fetchRecentActivities();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, positionRes, notifRes] = await Promise.all([
        axios.get('/api/kura/istatistikler'),
        axios.get('/api/kura/siram'),
        axios.get('/api/user/bildirimler')
      ]);

      setStats(statsRes.data);
      setMyPosition(positionRes.data);
      setNotifications(notifRes.data.bildirimler.slice(0, 3));
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = () => {
    setUpcomingEvents([
      {
        id: 1,
        title: 'Kura Çekimi',
        date: '2024-04-15',
        time: '14:00',
        type: 'kura',
        location: 'İstanbul İl Sağlık Müdürlüğü',
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Başvuru Son Tarihi',
        date: '2024-04-10',
        time: '23:59',
        type: 'deadline',
        status: 'warning'
      },
      {
        id: 3,
        title: 'Belge Teslimi',
        date: '2024-04-20',
        time: '10:00',
        type: 'document',
        location: 'Kadıköy ASM',
        status: 'upcoming'
      }
    ]);
  };

  const fetchRecentActivities = () => {
    setRecentActivities([
      {
        id: 1,
        type: 'application',
        title: 'Başvuru Güncellendi',
        description: 'Kadıköy ASM başvurunuz güncellendi',
        time: '2 saat önce',
        icon: '📝',
        color: 'var(--accent-blue)'
      },
      {
        id: 2,
        type: 'ranking',
        title: 'Sıralama Yükseldi',
        description: 'Kura sıranız 169\'dan 157\'ye yükseldi',
        time: '5 saat önce',
        icon: '📈',
        color: 'var(--success)'
      },
      {
        id: 3,
        type: 'notification',
        title: 'Yeni Pozisyon',
        description: 'Üsküdar\'da 3 yeni pozisyon açıldı',
        time: '1 gün önce',
        icon: '🏥',
        color: 'var(--secondary-orange)'
      },
      {
        id: 4,
        type: 'document',
        title: 'Belge Onaylandı',
        description: 'Hizmet belgesi onaylandı',
        time: '2 gün önce',
        icon: '✅',
        color: 'var(--success)'
      }
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi Günler';
    return 'İyi Akşamlar';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'var(--accent-blue)';
      case 'warning': return 'var(--warning)';
      case 'completed': return 'var(--success)';
      default: return 'var(--gray-400)';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner-health"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Navigation */}
      <div className="nav-health">
        <div className="nav-health-container">
          <div className="nav-health-brand">
            <span style={{ fontSize: '24px' }}>🏥</span>
            <span>Aile Hekimliği Kura</span>
          </div>
          <nav className="nav-health-menu">
            <Link to="/" className="nav-health-item active">Ana Sayfa</Link>
            <Link to="/kura-listesi" className="nav-health-item">Kuralar</Link>
            <Link to="/basvurularim" className="nav-health-item">Başvurular</Link>
            <Link to="/profile-new" className="nav-health-item">Profil</Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid var(--gray-200)',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              🔔
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  background: 'var(--error)',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {notifications.length}
                </span>
              )}
            </button>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-navy-dark))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
              {user?.ad?.charAt(0)}{user?.soyad?.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="health-container" style={{ paddingTop: '32px', paddingBottom: '100px' }}>
        {/* Welcome Section */}
        <div className="health-card" style={{
          background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-navy-dark))',
          color: 'white',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
                {getGreeting()}, Dr. {user?.ad} {user?.soyad}
              </h1>
              <p style={{ opacity: 0.9, fontSize: '16px' }}>
                Bugün {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Kura Sıranız</div>
              <div style={{ fontSize: '48px', fontWeight: '700' }}>
                {myPosition?.siram || '-'}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>/ {myPosition?.toplamKisi || '2500'}</div>
            </div>
          </div>

          {myPosition?.success && (
            <div style={{
              display: 'flex',
              gap: '24px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>Hizmet Puanı</span>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>{myPosition.kuraBilgisi?.hizmet_puani || '0'}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>İlçe</span>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>{myPosition.kuraBilgisi?.ilce || '-'}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>Birim</span>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>{myPosition.kuraBilgisi?.aile_hekimligi_birimi || '-'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="health-card-compact" style={{
                borderLeft: '4px solid var(--accent-blue)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📊</span>
                  <span style={{ fontSize: '11px', color: 'var(--success)' }}>↑ 12%</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>
                  {stats?.genel?.toplam_pozisyon || 0}
                </div>
                <div className="body-small">Toplam Pozisyon</div>
              </div>

              <div className="health-card-compact" style={{
                borderLeft: '4px solid var(--secondary-orange)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🏥</span>
                  <span style={{ fontSize: '11px', color: 'var(--success)' }}>+5</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>45</div>
                <div className="body-small">Boş Pozisyon</div>
              </div>

              <div className="health-card-compact" style={{
                borderLeft: '4px solid var(--accent-green)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📝</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>3</div>
                <div className="body-small">Aktif Başvuru</div>
              </div>

              <div className="health-card-compact" style={{
                borderLeft: '4px solid var(--accent-purple)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🏆</span>
                  <span style={{ fontSize: '11px', color: 'var(--success)' }}>↑ 2.3</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-navy)' }}>
                  {parseFloat(stats?.genel?.ortalama_puan || 0).toFixed(1)}
                </div>
                <div className="body-small">Ortalama Puan</div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="health-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 className="h3-health">Son Aktiviteler</h3>
                <button className="btn-health btn-ghost-health" style={{ padding: '8px 16px', fontSize: '12px' }}>
                  Tümünü Gör
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '16px',
                    padding: '16px',
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: activity.color,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'white'
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="body-regular" style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {activity.title}
                      </div>
                      <div className="body-small" style={{ marginBottom: '4px' }}>
                        {activity.description}
                      </div>
                      <div className="caption">{activity.time}</div>
                    </div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '18px' }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="health-card">
              <h3 className="h3-health" style={{ marginBottom: '20px' }}>Hızlı İşlemler</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <button
                  onClick={() => navigate('/basvuru-formu')}
                  className="health-card-compact"
                  style={{
                    border: '2px solid var(--gray-200)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    textAlign: 'center',
                    padding: '24px 16px'
                  }}
                >
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📝</span>
                  <div className="body-regular" style={{ fontWeight: '600' }}>Başvuru Yap</div>
                  <div className="body-small">Yeni başvuru oluştur</div>
                </button>

                <button
                  onClick={() => navigate('/kura-listesi')}
                  className="health-card-compact"
                  style={{
                    border: '2px solid var(--gray-200)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    textAlign: 'center',
                    padding: '24px 16px'
                  }}
                >
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📋</span>
                  <div className="body-regular" style={{ fontWeight: '600' }}>Kura Listesi</div>
                  <div className="body-small">Pozisyonları incele</div>
                </button>

                <button
                  onClick={() => navigate('/bos-pozisyonlar')}
                  className="health-card-compact"
                  style={{
                    border: '2px solid var(--gray-200)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    textAlign: 'center',
                    padding: '24px 16px'
                  }}
                >
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🏥</span>
                  <div className="body-regular" style={{ fontWeight: '600' }}>Boş Pozisyonlar</div>
                  <div className="body-small">Müsait yerler</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Calendar Widget */}
            <CalendarComponent />

            {/* Upcoming Events */}
            <div className="health-card">
              <h3 className="h3-health" style={{ marginBottom: '20px' }}>Yaklaşan Etkinlikler</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {upcomingEvents.map((event) => (
                  <div key={event.id} style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${getStatusColor(event.status)}`
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--gray-100)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      <div>{new Date(event.date).getDate()}</div>
                      <div style={{ textTransform: 'uppercase', opacity: 0.7 }}>
                        {new Date(event.date).toLocaleDateString('tr-TR', { month: 'short' })}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="body-regular" style={{ fontWeight: '600', marginBottom: '2px' }}>
                        {event.title}
                      </div>
                      <div className="body-small" style={{ marginBottom: '2px' }}>
                        {event.time} {event.location && `• ${event.location}`}
                      </div>
                      {event.status === 'warning' && (
                        <span style={{
                          background: 'var(--warning)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          YAKLAŞIYOR
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="health-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 className="h3-health">Bildirimler</h3>
                <span style={{
                  background: 'var(--error)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {notifications.length} YENİ
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map((notif) => (
                  <div key={notif.id} style={{
                    padding: '12px',
                    background: !notif.okundu ? 'var(--gray-50)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)'
                  }}>
                    <div className="body-regular" style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {notif.baslik}
                    </div>
                    <div className="body-small" style={{ marginBottom: '4px' }}>
                      {notif.mesaj}
                    </div>
                    <div className="caption">
                      {new Date(notif.gonderim_tarihi).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-health btn-ghost-health" style={{ marginTop: '12px', width: '100%' }}>
                Tüm Bildirimleri Gör
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="bottom-nav-health">
        <div className="bottom-nav-health-items">
          <Link to="/" className="bottom-nav-health-item active">
            <span className="bottom-nav-health-icon">🏠</span>
            <span className="bottom-nav-health-text">Ana Sayfa</span>
          </Link>
          <Link to="/kura-listesi" className="bottom-nav-health-item">
            <span className="bottom-nav-health-icon">📋</span>
            <span className="bottom-nav-health-text">Kuralar</span>
          </Link>
          <Link to="/basvuru-formu" className="bottom-nav-health-item">
            <span className="bottom-nav-health-icon">➕</span>
            <span className="bottom-nav-health-text">Başvur</span>
          </Link>
          <Link to="/basvurularim" className="bottom-nav-health-item">
            <span className="bottom-nav-health-icon">📂</span>
            <span className="bottom-nav-health-text">Başvurular</span>
          </Link>
          <Link to="/profile-new" className="bottom-nav-health-item">
            <span className="bottom-nav-health-icon">👤</span>
            <span className="bottom-nav-health-text">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Add spinner styles
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  .spinner-health {
    width: 48px;
    height: 48px;
    border: 4px solid var(--gray-200);
    border-top: 4px solid var(--primary-navy);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 1200px) {
    .health-container > div:last-child {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .health-card-compact {
      padding: 12px !important;
    }

    .nav-health-menu {
      display: none;
    }

    .bottom-nav-health {
      display: block;
    }
  }
`;
document.head.appendChild(spinnerStyle);

export default DashboardNew;