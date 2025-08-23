import React, { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'achievement'
  title: string
  message: string
  timestamp: Date
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      case 'achievement':
        return <Zap className="w-5 h-5 text-purple-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-400 bg-green-400/10'
      case 'warning':
        return 'border-l-yellow-400 bg-yellow-400/10'
      case 'info':
        return 'border-l-blue-400 bg-blue-400/10'
      case 'achievement':
        return 'border-l-purple-400 bg-purple-400/10'
      default:
        return 'border-l-blue-400 bg-blue-400/10'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    return `Hace ${days}d`
  }

  return (
    <div className="notification-system">
      {/* Notification Bell */}
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="notification-badge">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <Bell className="w-12 h-12 text-gray-400" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${getNotificationStyle(notification.type)}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <button
                    className="dismiss-button"
                    onClick={() => onDismiss(notification.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Estilos CSS para el sistema de notificaciones
const notificationStyles = `
.notification-system {
  position: relative;
}

.notification-bell {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.notification-bell:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  margin-top: 0.5rem;
  animation: slideInDown 0.3s ease-out;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
  transition: all 0.2s ease;
  animation: fadeInUp 0.3s ease-out;
}

.notification-item:hover {
  transform: translateX(5px);
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.notification-content p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.dismiss-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.dismiss-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.empty-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-notifications p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .notification-panel {
    width: 320px;
    right: -50px;
  }
}
`

// Agregar estilos al documento
const styleSheet = document.createElement('style')
styleSheet.textContent = notificationStyles
document.head.appendChild(styleSheet)
