import React, { useState } from 'react';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const endpoint = state === 'Sign Up' ? 'register' : 'login';
    const payload = state === 'Sign Up'
      ? { fullName, email, password }
      : { email, password };

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8089';
      const response = await fetch(`${backendUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        if (state === 'Login') {
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = '/my-profile';
        } else {
          alert(data.message);
        }
        setFullName('');
        setEmail('');
        setPassword('');
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text"
              required
            />
          </div>
        )}
        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            required
          />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-primary underline cursor-pointer'
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-primary underline cursor-pointer'
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;