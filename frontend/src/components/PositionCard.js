import React from 'react';
import { FiMapPin, FiHome, FiUsers, FiTrendingUp } from 'react-icons/fi';

const PositionCard = ({ position, onApply }) => {
  return (
    <div className="position-card">
      <div className="position-badge">✨ MÜSAIT</div>

      <div className="position-content">
        <h3 className="position-title">
          <FiHome className="position-icon" />
          {position.aile_sagligi_merkezi || 'Belirtilmemiş ASM'}
        </h3>

        <div className="position-details">
          <div className="detail-item">
            <FiMapPin className="detail-icon" />
            <span className="detail-label">İlçe:</span>
            <span className="detail-value">{position.ilce}</span>
          </div>

          <div className="detail-item">
            <FiHome className="detail-icon" />
            <span className="detail-label">Birim:</span>
            <span className="detail-value">{position.aile_hekimligi_birimi || 'Belirtilmemiş'}</span>
          </div>

          <div className="detail-item">
            <FiUsers className="detail-icon" />
            <span className="detail-label">Nüfus:</span>
            <span className="detail-value">{position.nufus || 'Belirtilmemiş'}</span>
          </div>

          <div className="detail-item">
            <FiTrendingUp className="detail-icon" />
            <span className="detail-label">Ciro:</span>
            <span className="detail-value">{position.ciro || 'Belirtilmemiş'}</span>
          </div>
        </div>

        <div className="position-footer">
          <div className="position-status">
            <span className="status-dot"></span>
            <span className="status-text">Hemen Başvurulabilir</span>
          </div>

          <button
            className="btn-apply"
            onClick={() => onApply(position.id)}
          >
            Başvuru Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionCard;