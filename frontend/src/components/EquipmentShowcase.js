import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tractorImg from '../assets/images/tractor.jpg';
import seederImg from '../assets/images/seeder.jpg';
import harvesterImg from '../assets/images/harvester.jpg';
import loaderImg from '../assets/images/loader.jpg';
import irrigatorImg from '../assets/images/irrigator.jpg';
import './EquipmentShowcase.css';

const sliderImages = [
  { src: tractorImg, label: 'Tractor' },
  { src: seederImg, label: 'Seeder' },
  { src: harvesterImg, label: 'Harvester' },
  { src: loaderImg, label: 'Loader' },
  { src: irrigatorImg, label: 'Irrigator' },
];

const equipmentList = [
  { id: 1, name: 'Tractor', image: tractorImg, price: 120, description: 'Powerful tractor for field work.' },
  { id: 2, name: 'Seeder', image: seederImg, price: 60, description: 'Seeder for fast and uniform seed planting.' },
  { id: 3, name: 'Harvester', image: harvesterImg, price: 200, description: 'Modern harvester, high capacity.' },
  { id: 4, name: 'Loader', image: loaderImg, price: 90, description: 'Loader for heavy lifting and transport.' },
  { id: 5, name: 'Irrigator', image: irrigatorImg, price: 70, description: 'Efficient irrigator for large fields.' },
];

function EquipmentShowcase() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(equipmentList);

  useEffect(() => {
    setFiltered(
      equipmentList.filter(eq =>
        eq.name.toLowerCase().includes(search.toLowerCase()) ||
        eq.description.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Slider Section */}
      <header style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden' }}>
        <div className="slider" style={{ display: 'flex', width: '100%', height: '100%', transform: `translateX(-${currentSlide * 100}%)`, transition: 'transform 0.5s' }}>
          {sliderImages.map((img, idx) => (
            <div className="slide" key={idx} style={{ width: '100%', height: '100%', backgroundImage: `url(${img.src})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', flexShrink: 0 }}>
              <div className="slider-text" style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontSize: '2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>{img.label}</div>
            </div>
          ))}
        </div>
        <div className="dot-nav" style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
          {sliderImages.map((_, idx) => (
            <div key={idx} className={`dot${currentSlide === idx ? ' active' : ''}`} style={{ width: 15, height: 15, backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.5)', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setCurrentSlide(idx)}></div>
          ))}
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="কৃষি যন্ত্র খুঁজুন..." style={{ width: '50%', padding: 12, borderRadius: 25, border: '1px solid #ddd', fontSize: '1rem', marginRight: 10 }} />
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <span role="img" aria-label="search" style={{ fontSize: 24 }}>🔍</span>
        </button>
      </div>

      {/* Cards Section */}
      <section className="cards-section" style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {filtered.length === 0 ? (
          <p>No equipment found.</p>
        ) : (
          filtered.map(eq => (
            <div className="card" key={eq.id} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0px 6px 12px rgba(0,0,0,0.15)', textAlign: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}>
              <img src={eq.image} alt={eq.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10 }} />
              <h3 style={{ marginTop: 10, fontSize: '1.4rem', color: '#333' }}>{eq.name}</h3>
              <p style={{ fontSize: 14, color: '#555' }}>{eq.description}</p>
              <div className="price" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: 10, color: '#27ae60' }}>Price: ${eq.price}/day</div>
              <button
                className="btn-details"
                style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', borderRadius: 6, cursor: 'pointer', border: 'none', marginTop: 15 }}
                onClick={() => navigate(`/equipment/${eq.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default EquipmentShowcase;
