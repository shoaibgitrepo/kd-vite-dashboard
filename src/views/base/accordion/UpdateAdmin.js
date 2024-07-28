// import React, { useState } from 'react'
// import axios from 'axios'
// import { CButton, CCol, CForm, CFormInput, CInputGroup, CFormSelect, CRow } from '@coreui/react'
// import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CFormSelect,
  CInputGroupText,
  CRow,
  CFormLabel,
  CFormCheck,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'

const initialForm = {
  id: '',
  username: '',
  password: '',
  type: '',
  status: '',
}

const UpdateAdmin = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    // Fetch the sub-admin data here and set it to the state
    const token = localStorage.getItem('token')
    axios
      .post('/AgreementDashboard/getSubAdmin', { id }, { headers: { token } })
      .then((response) => {
        if (response.data?.result?.[0]) setFormData(response.data?.result?.[0])
        else setFormData(initialForm)
      })
      .catch((error) => {
        setFormData(initialForm)
        console.error('Error fetching data:', error)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token') // Adjust key based on where you store the token
      const response = await axios.post('/AgreementDashboard/updateSubAdmin', formData, {
        headers: {
          token: token,
        },
      })
      console.log('Response:', response.data)
      navigate('/adminList')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Options for type and status dropdowns
  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: '2', label: 'Subadmin' },
    { value: '3', label: 'Manager' },
  ]

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' },
  ]

  return (
    <div>
      <CContainer>
        {/* {loading && <div className="loader">Loading...</div>}  */}
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={8}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <h5 className="modal-title text-center">Update Sub Information</h5>
                <br />
                <CForm onSubmit={handleSubmit}>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter user name"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CFormInput
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CFormSelect
                      aria-label="Default select example"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CFormSelect
                      aria-label="Default select example"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  <CRow>
                    <CCol>
                      <CButton type="submit" color="primary" className="px-4 login-btn">
                        Add Sub-Admin
                      </CButton>
                      {/* {message && <p style={{ color: 'red' }}>{message}</p>} */}
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <br />
      </CContainer>
    </div>
  )
}

export default UpdateAdmin
