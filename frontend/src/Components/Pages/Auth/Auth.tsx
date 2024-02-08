import { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const navigate = useNavigate();
  const [handleState, setHandleState] = useState('login');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {handleState === 'login' && <Login setHandleState={setHandleState} />}
      {handleState === 'register' && <Register setHandleState={setHandleState} />}
    </div>
  );
}

export default Auth;
