import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogin = (email, password) => {
    console.log('Login:', { email, password });
    alert('Login successful!');
  };

  const handleRegister = (data) => {
    console.log('Register:', data);
    alert('Registration successful!');
  };

  return (
    <div>
      {currentPage === 'login' ? (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentPage('register')}
        />
      ) : (
        <RegisterPage
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}
    </div>
  );
}

export default App;
