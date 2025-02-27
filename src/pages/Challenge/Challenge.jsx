import React from 'react';
import './Challenge.css';
import { RetoForm } from '../../components/CreateRetoComponent/RetoForm/RetoForm';
const Challenge = () => {
  return (
    <div className='challenge'>
      <h2>Crea tu Reto</h2>
      <RetoForm />
    </div>
  );
};

export default Challenge;