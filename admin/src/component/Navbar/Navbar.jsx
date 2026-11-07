import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Navbar.css'
import { assets } from '../../../../food-app/src/assets/assets'
import replateLogo from '../../assets/Replate_logo.png'

const Navbar = ({ setToken, url, token }) => {
  const [profileImage, setProfileImage] = useState(localStorage.getItem('adminProfileImage') || '')

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminProfileImage');
    setToken('');
  }

  const uploadProfileImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('profileImage', file)
    try {
      const response = await axios.post(`${url}/api/user/admin/profile-image`, formData, {
        headers: { token },
      })
      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }

      setProfileImage(response.data.profileImage)
      localStorage.setItem('adminProfileImage', response.data.profileImage)
      toast.success('Profile image updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not upload profile image')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="navbar">
        <img className="logo" src={replateLogo} alt="Replate" />
        <h3>Admin Panel</h3>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <span>{localStorage.getItem('adminName')}</span>
          <button className="logout-button" onClick={logout}>Logout</button>
          <label className="profile-upload" title="Change profile image">
            <img
              className="profile"
              src={profileImage ? `${url}/images/${encodeURIComponent(profileImage)}` : assets.profile_image}
              alt="Admin profile"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={uploadProfileImage}
              aria-label="Upload profile image"
            />
          </label>
        </div>
    </div>
  )
}

export default Navbar
