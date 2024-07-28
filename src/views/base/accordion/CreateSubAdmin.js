import React, { useState } from 'react'
import axios from 'axios'
import { CButton, CCol, CForm, CFormInput, CInputGroup, CFormSelect, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const CreateSubAdmin = ({ fetchAllAdmins }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    type: '',
    status: '',
  })

  const [showModal, setShowModal] = useState(false)

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('token') // Adjust key based on where you store the token

    try {
      const response = await axios.post('/AgreementDashboard/addAdmin', formData, {
        headers: {
          token: token, // Use the token from local storage
          'Content-Type': 'application/json',
        },
        // Uncomment if needed
        // withCredentials: true,
      })

      console.log('Success:', response.data)
      // alert('Data submitted successfully')
      setShowModal(false)
      fetchAllAdmins()
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message)
    }
  }

  return (
    <CRow>
      <div className="add-admin-btn">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h5 className="modal-title ">Fill User Information</h5>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop fade show"></div>}
    </CRow>
  )
}

export default CreateSubAdmin
