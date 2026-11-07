import React from 'react'
import Navbar from './component/Navbar/Navbar.jsx'
import Sidebar from './component/Sidebar/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add.jsx'
import List from './pages/List/List.jsx'
import Order from './pages/Order/Order.jsx'
import Report from './pages/Report/Report.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  { useState } from 'react'
import Login from './pages/Login/Login.jsx'



const App = () => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  if (!token) {
    return (<div><ToastContainer/><Login url={url} setToken={setToken}/></div>)
  }

  return (
    <div>
      <ToastContainer/>
      <Navbar setToken={setToken} url={url} token={token}/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/add" element={<Add url={url} token={token}/>}/>
          <Route path="/list" element={<List url={url} token={token}/>}/>
          <Route path="/order" element={<Order url={url} token={token}/>}/>
          <Route path="/report" element={<Report url={url} token={token}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
