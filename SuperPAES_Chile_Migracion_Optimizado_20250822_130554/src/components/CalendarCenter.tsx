import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, BookOpen, Target, Zap, Coffee } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  type: 'exam' | 'study' | 'practice' | 'break'
  description?: string
}

const CalendarCenter: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Examen PAES Matemáticas',
      date: new Date(2025, 7, 20),
      time: '09:00',
      type: 'exam',
      description: 'Examen oficial PAES Matemáticas'
    },
    {
      id: '2',
      title: 'Estudio Geometría',
      date: new Date(2025, 7, 18),
      time: '14:00',
      type: 'study',
      description: 'Repaso de geometría analítica'
    },
    {
      id: '3',
      title: 'Práctica Álgebra',
      date: new Date(2025, 7, 19),
      time: '16:00',
      type: 'practice',
      description: 'Ejercicios de álgebra'
    },
    {
      id: '4',
      title: 'Descanso',
      date: new Date(2025, 7, 17),
      time: '12:00',
      type: 'break',
      description: 'Pausa para descansar'
    }
  ])

  const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    
    // Días del mes anterior
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({ date: currentDate, isCurrentMonth: true })
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, isCurrentMonth: false })
    }
    
    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const hasEvent = (date: Date) => {
    return events.some(event => event.date.toDateString() === date.toDateString())
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => event.date.toDateString() === date.toDateString())
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <Target size={16} />
      case 'study':
        return <BookOpen size={16} />
      case 'practice':
        return <Zap size={16} />
      case 'break':
        return <Coffee size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const days = getDaysInMonth(currentDate)
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">
          <Calendar size={24} />
          Calendario de Estudio
        </h2>
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={previousMonth}>
            <ChevronLeft size={20} />
          </button>
          <div className="calendar-current-month">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button className="calendar-nav-btn" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekdays.map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${
                !day.isCurrentMonth ? 'other-month' : ''
              } ${isToday(day.date) ? 'today' : ''} ${
                isSelected(day.date) ? 'selected' : ''
              } ${hasEvent(day.date) ? 'has-event' : ''}`}
              onClick={() => handleDateClick(day.date)}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-events">
        <h3 className="calendar-events-title">
          <Clock size={20} />
          {selectedDate ? `Eventos del ${selectedDate.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}` : 'Selecciona una fecha para ver eventos'}
        </h3>
        
        {selectedEvents.length > 0 ? (
          <>
            {selectedEvents.map(event => (
              <div key={event.id} className="calendar-event">
                <div className="calendar-event-time">
                  {event.time}
                </div>
                <div className="calendar-event-title">
                  {event.title}
                </div>
                <span className={`calendar-event-type ${event.type}`}>
                  {getEventIcon(event.type)}
                  {event.type === 'exam' ? 'Examen' : 
                   event.type === 'study' ? 'Estudio' : 
                   event.type === 'practice' ? 'Práctica' : 'Descanso'}
                </span>
              </div>
            ))}
          </>
        ) : selectedDate ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No hay eventos programados para esta fecha
          </p>
        ) : null}

        <button className="calendar-add-event">
          <Plus size={16} />
          Agregar Evento
        </button>
      </div>
    </div>
  )
}

export default CalendarCenter
