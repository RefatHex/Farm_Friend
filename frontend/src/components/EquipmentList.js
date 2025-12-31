
import React from 'react';
import { useNavigate } from 'react-router-dom';
import tractorImg from '../assets/images/tractor.jpg';
import seederImg from '../assets/images/seeder.jpg';
import harvesterImg from '../assets/images/harvester.jpg';
import loaderImg from '../assets/images/loader.jpg';
import irrigatorImg from '../assets/images/irrigator.jpg';
import './EquipmentList.css';


const mockEquipment = [
  { id: 1, title: 'Tractor', image: tractorImg, price: 120, description: 'Powerful tractor for field work.' },
  { id: 2, title: 'Seeder', image: seederImg, price: 60, description: 'Seeder for fast and uniform seed planting.' },
  { id: 3, title: 'Harvester', image: harvesterImg, price: 200, description: 'Modern harvester, high capacity.' },
  { id: 4, title: 'Loader', image: loaderImg, price: 90, description: 'Loader for heavy lifting and transport.' },
  { id: 5, title: 'Irrigator', image: irrigatorImg, price: 70, description: 'Efficient irrigator for large fields.' },
];

function EquipmentList() {
  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/equipment/${id}`);
  };
  return (
    <div className="equipment-list-container" style={{padding: '2rem'}}>
      <h2>Available Equipment for Rent</h2>
      <div className="equipment-list" style={{display:'flex',flexWrap:'wrap',gap:'1.5rem'}}>
        {mockEquipment.map(eq => (
          <div
            className="equipment-card"
            key={eq.id}
            style={{background:'#fff',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',width:260,padding:16,display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}}
            onClick={() => handleCardClick(eq.id)}
          >
            <div className="equipment-image" style={{width:'100%',height:140,background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,borderRadius:6}}>
              <img src={eq.image} alt={eq.title} style={{maxWidth:'100%',maxHeight:'100%'}} />
            </div>
            <div className="equipment-info" style={{textAlign:'center'}}>
              <h3>{eq.title}</h3>
              <p>{eq.description}</p>
              <p><strong>Price/Day:</strong> ${eq.price}</p>
              <button className="rent-btn" style={{marginTop:10,background:'#4caf50',color:'#fff',border:'none',padding:'0.5rem 1.2rem',borderRadius:4,cursor:'pointer',fontWeight:'bold'}} onClick={e => e.stopPropagation()}>Rent</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipmentList;
