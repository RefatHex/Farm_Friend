import React from 'react';
import { useParams } from 'react-router-dom';
import tractorImg from '../assets/images/tractor.jpg';
import seederImg from '../assets/images/seeder.jpg';
import harvesterImg from '../assets/images/harvester.jpg';
import loaderImg from '../assets/images/loader.jpg';
import irrigatorImg from '../assets/images/irrigator.jpg';

const mockEquipment = [
  { id: 1, title: 'Tractor', image: tractorImg, price: 120, description: 'Powerful tractor for field work.' },
  { id: 2, title: 'Seeder', image: seederImg, price: 60, description: 'Seeder for fast and uniform seed planting.' },
  { id: 3, title: 'Harvester', image: harvesterImg, price: 200, description: 'Modern harvester, high capacity.' },
  { id: 4, title: 'Loader', image: loaderImg, price: 90, description: 'Loader for heavy lifting and transport.' },
  { id: 5, title: 'Irrigator', image: irrigatorImg, price: 70, description: 'Efficient irrigator for large fields.' },
];

function EquipmentPage() {
  const { id } = useParams();
  const equipment = mockEquipment.find(eq => eq.id === Number(id));

  if (!equipment) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Equipment Not Found</h2>
        <p>No equipment found for this id.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>{equipment.title}</h2>
      <img src={equipment.image} alt={equipment.title} style={{ width: '100%', maxWidth: 400, borderRadius: 8, marginBottom: 20 }} />
      <p><strong>Description:</strong> {equipment.description}</p>
      <p><strong>Price per day:</strong> ${equipment.price}</p>
      <p style={{ color: '#888', fontStyle: 'italic' }}>This is a demo equipment details page.</p>
    </div>
  );
}

export default EquipmentPage;
