import React, { useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      console.log('Attempting login with:', { username, password })
      const response = await axios.post('/AgreementDashboard/login', {
        username,
        password,
      })
      console.log('Response:', response)

      if (response.data.response === 'success') {
        setMessage(response.data.responseMsg)
        // Save token to localStorage or context for future use
        localStorage.setItem('token', response.data.token)
        // Redirect to dashboard or home page
        alert('Login Successful')
        navigate('/dashboard')
        // window.location.href = '/DefaultLayout'
      } else {
        setMessage('Login failed!')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="bg-body-tertiary login-area min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="text-white py-5" style={{ width: '44%' }}>
                <CCardBody className="justify-content-center bg-login-logo">
                  <div className="logo-image"></div>
                </CCardBody>
              </CCard>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1 className="text-center">Login</h1>
                    <p className="text-body-secondary"></p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CButton type="submit" color="primary" className="px-4 login-btn">
                          Login
                        </CButton>
                        {message && <p style={{ color: 'red' }}>{message}</p>}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
