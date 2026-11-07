import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Login.css'

const Login = ({ url, setToken }) => {
  const [mode, setMode] = useState('Login');
  const [data, setData] = useState({ name: '', email: '', password: '', adminCode: '' });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    const endpoint = mode === 'Login' ? '/api/user/login' : '/api/user/admin/register';
    try {
      const response = await axios.post(url + endpoint, data);
      if (!response.data.success) {
        return toast.error(response.data.message);
      }
      if (response.data.role !== 'admin') {
        return toast.error('This account is not an admin account');
      }
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminName', response.data.name);
      localStorage.setItem('adminProfileImage', response.data.profileImage || '');
      setToken(response.data.token);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error. Please try again.');
    }
  }

  return (
    <div className='admin-login'>
      <form onSubmit={onSubmit} className='admin-login-box'>
        <h2>{mode === 'Login' ? 'Admin Login' : 'Admin Register'}</h2>
        {mode === 'Register' && <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Restaurant / admin name' required />}
        <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email' required />
        <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password (min 8 characters)' required />
        {mode === 'Register' && <input name='adminCode' onChange={onChangeHandler} value={data.adminCode} type='password' placeholder='Admin signup code' required />}
        <button type='submit'>{mode === 'Login' ? 'Login' : 'Create Admin Account'}</button>
        {mode === 'Login'
          ? <p>New admin? <span onClick={() => setMode('Register')}>Register here</span></p>
          : <p>Already have an account? <span onClick={() => setMode('Login')}>Login here</span></p>}
      </form>
    </div>
  )
}

export default Login