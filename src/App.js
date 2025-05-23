import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import UniformMotion from './simulations/UniformMotion'; // Import UniformMotion
import frMessages from './locales/fr.json';
import ruMessages from './locales/ru.json';
import './App.css';

function App() {
  const [language, setLanguage] = useState('fr'); // Default language

  const messages = language === 'fr' ? frMessages : ruMessages;

  return (
    <div className="App">
      <Header appTitle={messages.appTitle} />
      <div className="lang-switcher">
        <button onClick={() => setLanguage('fr')}>Français</button>
        <button onClick={() => setLanguage('ru')}>Русский</button>
      </div>
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          {/* Updated InfoPanel and added UniformMotion */}
          <InfoPanel title={messages.uniformMotionTitle} text="Interactive simulation of uniform rectilinear motion." />
          <UniformMotion messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default App;
