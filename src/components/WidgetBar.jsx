import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import './WidgetBar.css';

function WidgetBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: '--',
    condition: 'Cargando...',
    icon: '🌤️',
    location: 'Humboldt, Santa Fe'
  });
  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    // Actualizar la hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Obtener clima de Humboldt, Santa Fe, Argentina
    const fetchWeather = async () => {
      try {
        // Coordenadas de Humboldt, Santa Fe: -31.4, -61.08
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-31.4&longitude=-61.08&current=temperature_2m,weather_code&timezone=America/Argentina/Buenos_Aires'
        );
        const data = await response.json();
        
        if (data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const weatherCode = data.current.weather_code;
          
          // Interpretar código del clima
          const { condition, icon } = getWeatherInfo(weatherCode);
          
          setWeather({
            temp,
            condition,
            icon,
            location: 'Humboldt, Santa Fe'
          });
        }
      } catch (error) {
        console.error('Error al obtener clima:', error);
        setWeather({
          temp: '--',
          condition: 'No disponible',
          icon: '🌤️',
          location: 'Humboldt, Santa Fe'
        });
      }
    };

    // Obtener clima al cargar
    fetchWeather();

    // Actualizar cada 10 minutos
    const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(weatherInterval);
  }, []);

  // 🔥 Escuchar eventos del calendario desde Firebase
  useEffect(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const eventsRef = ref(database, 'calendar');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.entries(data).map(([id, event]) => ({
          id,
          ...event
        }));

        // Filtrar solo eventos de hoy
        const filtered = eventsArray.filter(event => event.date === todayStr);
        
        // Ordenar por hora si tienen hora
        filtered.sort((a, b) => {
          if (a.time && b.time) return a.time.localeCompare(b.time);
          return 0;
        });
        
        setTodayEvents(filtered);
      } else {
        setTodayEvents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Tipos de eventos (mismo objeto que en Calendar.jsx)
  const eventTypes = {
    birthday: { label: 'Cumpleaños', icon: '🎂', color: '#FFC0CB' },
    medical: { label: 'Cita Médica', icon: '🏥', color: '#87CEEB' },
    general: { label: 'General', icon: '📌', color: '#BA55D3' },
    important: { label: 'Importante', icon: '⭐', color: '#FFD700' }
  };

  // Interpretar códigos de clima de Open-Meteo
  const getWeatherInfo = (code) => {
    const weatherMap = {
      0: { condition: 'Despejado', icon: '☀️' },
      1: { condition: 'Mayormente despejado', icon: '🌤️' },
      2: { condition: 'Parcialmente nublado', icon: '⛅' },
      3: { condition: 'Nublado', icon: '☁️' },
      45: { condition: 'Niebla', icon: '🌫️' },
      48: { condition: 'Niebla con escarcha', icon: '🌫️' },
      51: { condition: 'Llovizna ligera', icon: '🌦️' },
      53: { condition: 'Llovizna', icon: '🌦️' },
      55: { condition: 'Llovizna intensa', icon: '🌧️' },
      61: { condition: 'Lluvia ligera', icon: '🌧️' },
      63: { condition: 'Lluvia', icon: '🌧️' },
      65: { condition: 'Lluvia intensa', icon: '⛈️' },
      71: { condition: 'Nieve ligera', icon: '🌨️' },
      73: { condition: 'Nieve', icon: '❄️' },
      75: { condition: 'Nieve intensa', icon: '❄️' },
      77: { condition: 'Granizo', icon: '🌨️' },
      80: { condition: 'Chubascos ligeros', icon: '🌦️' },
      81: { condition: 'Chubascos', icon: '🌧️' },
      82: { condition: 'Chubascos intensos', icon: '⛈️' },
      85: { condition: 'Chubascos de nieve', icon: '🌨️' },
      86: { condition: 'Chubascos de nieve intensos', icon: '❄️' },
      95: { condition: 'Tormenta', icon: '⛈️' },
      96: { condition: 'Tormenta con granizo', icon: '⛈️' },
      99: { condition: 'Tormenta severa', icon: '⛈️' }
    };

    return weatherMap[code] || { condition: 'Desconocido', icon: '🌤️' };
  };

  // Formatear fecha
  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString('es-AR', options);
  };

  // Formatear hora
  const formatTime = () => {
    return currentTime.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '☀️ Buenos días';
    if (hour < 19) return '🌤️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  return (
    <div className="widget-bar">
      {/* Widget de Clima */}
      <div className="widget weather-widget">
        <div className="widget-icon">{weather.icon}</div>
        <div className="widget-content">
          <div className="weather-temp">{weather.temp}°C</div>
          <div className="weather-condition">{weather.condition}</div>
        </div>
      </div>

      {/* Widget de Fecha y Hora */}
      <div className="widget datetime-widget">
        <div className="widget-icon">📅</div>
        <div className="widget-content">
          <div className="datetime-date">{formatDate()}</div>
          <div className="datetime-time">{formatTime()}</div>
        </div>
      </div>

      {/* Widget de Saludo */}
      <div className="widget greeting-widget">
        <div className="greeting-text">{getGreeting()}</div>
      </div>

      {/* Widget de Eventos del Día */}
      {todayEvents.length > 0 && (
        <div className="widget events-widget">
          <div className="widget-icon">📅</div>
          <div className="widget-content">
            <div className="events-widget-title">Hoy ({todayEvents.length})</div>
            <div className="events-widget-list">
              {todayEvents.slice(0, 1).map(event => (
                <div 
                  key={event.id} 
                  className="event-widget-item"
                  style={{ borderLeftColor: eventTypes[event.type]?.color || '#EC407A' }}
                >
                  <span className="event-widget-icon">{eventTypes[event.type]?.icon || '📌'}</span>
                  <span className="event-widget-text">{event.title}</span>
                  {event.time && <span className="event-widget-time">{event.time}</span>}
                </div>
              ))}
              {todayEvents.length > 1 && (
                <div className="events-widget-more">+{todayEvents.length - 1} más en Calendario</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetBar;
