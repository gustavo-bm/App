import { useState } from 'react';
import './App.css';
import Calendar from './components/Calendar';

function App() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <div className={ theme === 'light' ? 'light' : 'dark' }>
      <button className='toggle-button'  onClick={toggleTheme} style={{ "margin": "10px" }} >
        Toggle to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
      <Calendar />
    </div>
  )
}

export default App;