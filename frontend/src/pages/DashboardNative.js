import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiCalendar, FiMapPin, FiUsers, FiCheckCircle,
  FiFileText, FiTrendingUp, FiAlertCircle, FiChevronRight
} from 'react-icons/fi';

const DashboardNative = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    totalPositions: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, applicationsRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/applications/my-applications')
      ]);

      setStats({
        totalApplications: applicationsRes.data.applications?.length || 0,
        pendingApplications: applicationsRes.data.applications?.filter(a => a.durum === 'beklemede').length || 0,
        acceptedApplications: applicationsRes.data.applications?.filter(a => a.durum === 'kabul').length || 0,
        totalPositions: statsRes.data.totalPositions || 0
      });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const quickActions = [
    {
      icon: FiFileText,
      title: 'Başvuru Yap',
      subtitle: 'Yeni başvuru oluştur',
      color: '#ff6b35',
      route: '/basvuru-formu'
    },
    {
      icon: FiCalendar,
      title: 'Kura Listesi',
      subtitle: 'Açık pozisyonları gör',
      color: '#4CAF50',
      route: '/kura-listesi'
    },
    {
      icon: FiMapPin,
      title: 'Boş Pozisyonlar',
      subtitle: 'İl bazlı pozisyonlar',
      color: '#2196F3',
      route: '/bos-pozisyonlar'
    },
    {
      icon: FiUsers,
      title: 'Başvurularım',
      subtitle: 'Tüm başvuruları gör',
      color: '#9C27B0',
      route: '/basvurularim'
    }
  ];

  const statsCards = [
    {
      title: 'Toplam Başvuru',
      value: stats.totalApplications,
      icon: FiFileText,
      color: '#ff6b35',
      bgColor: 'rgba(255, 107, 53, 0.1)'
    },
    {
      title: 'Bekleyen',
      value: stats.pendingApplications,
      icon: FiAlertCircle,
      color: '#FFA726',
      bgColor: 'rgba(255, 167, 38, 0.1)'
    },
    {
      title: 'Kabul Edilen',
      value: stats.acceptedApplications,
      icon: FiCheckCircle,
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    {
      title: 'Açık Pozisyon',
      value: stats.totalPositions,
      icon: FiTrendingUp,
      color: '#2196F3',
      bgColor: 'rgba(33, 150, 243, 0.1)'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f7fa'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="loading-spinner"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: '#f5f7fa',
        minHeight: '100vh',
        paddingBottom: '80px'
      }}
    >
      {/* Pull to Refresh */}
      <motion.div
        style={{
          textAlign: 'center',
          padding: '10px',
          color: '#666',
          fontSize: '12px',
          display: refreshing ? 'block' : 'none'
        }}
        animate={{ opacity: refreshing ? 1 : 0 }}
      >
        Yenileniyor...
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          padding: '20px 16px',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '20px'
        }}
      >
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: '0 0 8px 0'
        }}>
          Hoş Geldin, {user?.ad} 👋
        </h1>
        <p style={{
          color: '#666',
          margin: '0',
          fontSize: '14px'
        }}>
          Bugün {new Date().toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: '0 0 4px 0'
              }}>
                {stat.value}
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: '0'
              }}>
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 16px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '0 0 16px 0'
        }}>
          Hızlı İşlemler
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 + 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.route)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                flexShrink: 0
              }}>
                <action.icon size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 4px 0'
                }}>
                  {action.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  margin: '0'
                }}>
                  {action.subtitle}
                </p>
              </div>
              <FiChevronRight size={20} color="#999" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Announcement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          margin: '24px 16px',
          padding: '16px',
          background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)'
        }}
      >
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 8px 0'
        }}>
          📢 Önemli Duyuru
        </h3>
        <p style={{
          fontSize: '13px',
          margin: '0',
          opacity: 0.95,
          lineHeight: '1.5'
        }}>
          2024 yılı Aile Hekimliği kura başvuruları devam ediyor. Son başvuru tarihi için takvimi takip ediniz.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardNative;