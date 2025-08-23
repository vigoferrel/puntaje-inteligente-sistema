import React from 'react'
import { Brain, ChevronLeft, ChevronRight, Play, Plus } from 'lucide-react'
import { navigationItems } from '../../data/navigationConfig'

interface UserProfile {
  name: string;
  avatar: string;
  level: string;
  points: number;
  rank: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  userProfile: UserProfile;
  onTabChange: (tab: string) => void;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  activeTab, 
  userProfile, 
  onTabChange, 
  onToggle 
}) => (
  <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`} id="navigation" role="navigation" aria-label="Navegación principal">
    <div className="sidebar-header">
      <div className="logo">
        <Brain className="w-8 h-8 text-blue-600" />
        <span>SuperPAES</span>
      </div>
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </div>

    {/* User Profile */}
    <div className="user-profile">
      <div className="user-avatar">
        <span className="avatar-text">{userProfile.avatar}</span>
      </div>
      <div className="user-info">
        <h3 className="user-name">{userProfile.name}</h3>
        <p className="user-level">{userProfile.level}</p>
        <p className="user-points">{userProfile.points} pts</p>
        <p className="user-rank">{userProfile.rank}</p>
      </div>
    </div>

    {/* Navigation */}
    <nav className="sidebar-nav" role="navigation" aria-label="Menú de navegación">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            aria-label={item.ariaLabel}
          >
            <IconComponent className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

    {/* Quick Actions */}
    <div className="quick-actions">
      <button className="btn-primary" aria-label="Continuar estudiando">
        <Play className="w-4 h-4" />
        <span>Continuar</span>
      </button>
      <button className="btn-secondary" aria-label="Crear nuevo ejercicio">
        <Plus className="w-4 h-4" />
        <span>+ Nuevo Ejercicio</span>
      </button>
    </div>
  </aside>
)
