import React, { useState } from 'react';
import '../styles/healthcare-design.css';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Events data
  const events = {
    '2024-03-15': { type: 'kura', title: 'Kura Çekimi' },
    '2024-03-20': { type: 'deadline', title: 'Başvuru Kapanış' },
    '2024-03-25': { type: 'document', title: 'Belge Teslimi' },
    '2024-04-02': { type: 'meeting', title: 'Toplantı' },
    '2024-04-10': { type: 'deadline', title: 'Son Başvuru' },
    '2024-04-15': { type: 'kura', title: 'Kura Çekimi' },
    '2024-04-20': { type: 'document', title: 'Belge Teslimi' }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events[dateStr];
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'kura': return 'var(--secondary-orange)';
      case 'deadline': return 'var(--error)';
      case 'document': return 'var(--accent-blue)';
      case 'meeting': return 'var(--accent-purple)';
      default: return 'var(--gray-400)';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    const weekDays = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

    // Week day headers
    weekDays.forEach((day, index) => {
      days.push(
        <div
          key={`weekday-${index}`}
          style={{
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--gray-500)',
            padding: '8px 0'
          }}
        >
          {day}
        </div>
      );
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDay(day);
      const hasEvent = !!event;

      days.push(
        <div
          key={`day-${day}`}
          className="calendar-day"
          style={{
            background: isToday(day)
              ? 'var(--primary-navy)'
              : isSelected(day)
              ? 'var(--secondary-orange)'
              : hasEvent
              ? 'var(--gray-50)'
              : 'transparent',
            color: isToday(day) || isSelected(day) ? 'white' : 'var(--gray-900)',
            fontWeight: isToday(day) || isSelected(day) ? '600' : '400',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          {day}
          {hasEvent && (
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: getEventColor(event.type)
              }}
            />
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvent = getEventForDay(selectedDate.getDate());

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3 className="h3-health">
          {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)}>
            ←
          </button>
          <button
            className="calendar-nav-btn"
            onClick={() => setCurrentDate(new Date())}
            style={{ padding: '0 12px', width: 'auto', fontSize: '12px' }}
          >
            Bugün
          </button>
          <button className="calendar-nav-btn" onClick={() => navigateMonth(1)}>
            →
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>

      {selectedDateEvent && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          borderLeft: `3px solid ${getEventColor(selectedDateEvent.type)}`
        }}>
          <div className="body-small" style={{ marginBottom: '4px' }}>
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="body-regular" style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
            {selectedDateEvent.title}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: 'var(--gray-50)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div className="caption" style={{ marginBottom: '8px' }}>ETKİNLİK TÜRLERİ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { type: 'kura', label: 'Kura Çekimi', color: 'var(--secondary-orange)' },
            { type: 'deadline', label: 'Son Tarih', color: 'var(--error)' },
            { type: 'document', label: 'Belge', color: 'var(--accent-blue)' },
            { type: 'meeting', label: 'Toplantı', color: 'var(--accent-purple)' }
          ].map((item) => (
            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: item.color
              }} />
              <span className="body-small">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;