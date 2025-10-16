import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiHome, FiUsers, FiCalendar, FiMapPin, FiTrendingUp,
  FiClock, FiBell, FiAward, FiActivity, FiFileText,
  FiArrowUp, FiArrowDown, FiChevronRight, FiCheck,
  FiAlertCircle, FiBarChart2, FiPieChart
} from 'react-icons/fi';
import CalendarComponent from '../components/CalendarComponent';
import '../styles/dashboard-modern.css';

const DashboardModern = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPositions: 245,
    myRank: 157,
    applicationsCount: 3,
    daysUntilDraw: 12
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [animatedNumbers, setAnimatedNumbers] = useState({
    totalPositions: 0,
    myRank: 0,
    applicationsCount: 0,
    daysUntilDraw: 0
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    const timers = [];

    Object.keys(stats).forEach(key => {
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuad = 1 - Math.pow(1 - progress, 2);

        setAnimatedNumbers(prev => ({
          ...prev,
          [key]: Math.floor(stats[key] * easeOutQuad)
        }));

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedNumbers(prev => ({
            ...prev,
            [key]: stats[key]
          }));
        }
      }, interval);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [stats]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const quickActions = [
    { icon: FiFileText, label: 'Yeni Başvuru', path: '/basvuru-formu', color: '#ff6b35' },
    { icon: FiMapPin, label: 'Boş Pozisyonlar', path: '/bos-pozisyonlar', color: '#ff8c42' },
    { icon: FiUsers, label: 'Profilim', path: '/profile', color: '#ffa560' },
    { icon: FiCalendar, label: 'Kura Takvimi', path: '/kura-listesi', color: '#cc5528' }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Kura Çekimi - İstanbul',
      date: '15 Nisan 2024',
      time: '14:00',
      type: 'kura',
      status: 'soon',
      icon: FiAward,
      color: '#ff6b35'
    },
    {
      id: 2,
      title: 'Başvuru Son Günü',
      date: '10 Nisan 2024',
      time: '23:59',
      type: 'deadline',
      status: 'warning',
      icon: FiAlertCircle,
      color: '#f59e0b'
    },
    {
      id: 3,
      title: 'Belge Teslimi',
      date: '20 Nisan 2024',
      time: '10:00',
      type: 'document',
      status: 'upcoming',
      icon: FiFileText,
      color: '#3b82f6'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Başvuru Onaylandı',
      desc: 'Kadıköy ASM başvurunuz onaylandı',
      time: '2 saat önce',
      icon: FiCheck,
      color: '#22c55e',
      trend: 'up'
    },
    {
      id: 2,
      title: 'Sıralama Güncellendi',
      desc: 'Kura sıranız 169\'dan 157\'ye yükseldi',
      time: '5 saat önce',
      icon: FiTrendingUp,
      color: '#ff6b35',
      trend: 'up'
    },
    {
      id: 3,
      title: 'Yeni Pozisyon',
      desc: 'Üsküdar\'da 3 yeni pozisyon açıldı',
      time: '1 gün önce',
      icon: FiBell,
      color: '#3b82f6',
      trend: 'new'
    }
  ];

  const chartData = [
    { name: 'Ocak', value: 65 },
    { name: 'Şubat', value: 78 },
    { name: 'Mart', value: 90 },
    { name: 'Nisan', value: 81 }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hoş Geldin, <span className="highlight">{user?.name || 'Doktor'}</span>
            </h1>
            <p className="hero-subtitle">
              Aile hekimliği kura sürecinizi takip edin ve başvurularınızı yönetin.
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => navigate('/basvuru-formu')}
                className="btn-primary-hero"
              >
                <FiFileText />
                Yeni Başvuru
              </button>
              <button
                onClick={() => navigate('/kura-listesi')}
                className="btn-secondary-hero"
              >
                <FiCalendar />
                Kura Takvimi
              </button>
            </div>
          </div>
          <div className="hero-illustration">
            <svg viewBox="0 0 400 300" className="hero-svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#ff6b35', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#ffa560', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <circle cx="200" cy="150" r="80" fill="url(#grad1)" opacity="0.1"/>
              <circle cx="200" cy="150" r="60" fill="url(#grad1)" opacity="0.2"/>
              <circle cx="200" cy="150" r="40" fill="url(#grad1)" opacity="0.3"/>
              <path d="M150 150 Q200 100, 250 150 T350 150" stroke="#ff6b35" strokeWidth="3" fill="none"/>
              <path d="M100 200 Q200 150, 300 200" stroke="#ff8c42" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #ff6b35, #ff8c42)'}}>
            <FiMapPin />
          </div>
          <div className="stat-content">
            <span className="stat-label">Toplam Pozisyon</span>
            <div className="stat-value">
              <span className="stat-number">{animatedNumbers.totalPositions}</span>
              <span className="stat-trend up">
                <FiArrowUp /> +12
              </span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #60a5fa)'}}>
            <FiAward />
          </div>
          <div className="stat-content">
            <span className="stat-label">Sıralamam</span>
            <div className="stat-value">
              <span className="stat-number">{animatedNumbers.myRank}</span>
              <span className="stat-trend up">
                <FiArrowUp /> 12
              </span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '60%', background: '#3b82f6'}}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #22c55e, #86efac)'}}>
            <FiFileText />
          </div>
          <div className="stat-content">
            <span className="stat-label">Başvurularım</span>
            <div className="stat-value">
              <span className="stat-number">{animatedNumbers.applicationsCount}</span>
              <span className="stat-badge">Aktif</span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '30%', background: '#22c55e'}}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'}}>
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-label">Kura'ya Kalan</span>
            <div className="stat-value">
              <span className="stat-number">{animatedNumbers.daysUntilDraw}</span>
              <span className="stat-unit">Gün</span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '40%', background: '#f59e0b'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Hızlı İşlemler</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="quick-action-card"
              style={{'--accent-color': action.color}}
            >
              <div className="quick-action-icon">
                <action.icon />
              </div>
              <span className="quick-action-label">{action.label}</span>
              <FiChevronRight className="quick-action-arrow" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Calendar Section */}
        <div className="content-card calendar-card">
          <div className="card-header">
            <h3><FiCalendar /> Takvim</h3>
            <Link to="/kura-listesi" className="view-all-link">
              Tümünü Gör <FiChevronRight />
            </Link>
          </div>
          <CalendarComponent
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Upcoming Events */}
        <div className="content-card events-card">
          <div className="card-header">
            <h3><FiClock /> Yaklaşan Etkinlikler</h3>
          </div>
          <div className="events-list">
            {upcomingEvents.map(event => (
              <div key={event.id} className={`event-item ${event.status}`}>
                <div className="event-icon" style={{color: event.color}}>
                  <event.icon />
                </div>
                <div className="event-content">
                  <h4>{event.title}</h4>
                  <div className="event-meta">
                    <span><FiCalendar /> {event.date}</span>
                    <span><FiClock /> {event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-card activities-card">
          <div className="card-header">
            <h3><FiActivity /> Son Aktiviteler</h3>
          </div>
          <div className="activities-timeline">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{backgroundColor: `${activity.color}20`, color: activity.color}}>
                  <activity.icon />
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.desc}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                {activity.trend === 'up' && <FiArrowUp className="trend-icon up" />}
                {activity.trend === 'down' && <FiArrowDown className="trend-icon down" />}
              </div>
            ))}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="content-card chart-card">
          <div className="card-header">
            <h3><FiBarChart2 /> Başvuru Trendi</h3>
          </div>
          <div className="mini-chart">
            <div className="chart-bars">
              {chartData.map((data, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{height: `${data.value}%`}}
                    data-value={data.value}
                  >
                    <span className="bar-tooltip">{data.value}</span>
                  </div>
                  <span className="bar-label">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModern;