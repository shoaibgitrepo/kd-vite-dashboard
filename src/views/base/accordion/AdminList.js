import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CreateSubAdmin from './CreateSubAdmin'

const AdminList = () => {
  const [admins, setAdmins] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAllAdmins = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Token not found. Please log in.')
      setLoading(false)
      return
    }

    axios
      .get('/AgreementDashboard/getAllAdmin', {
        headers: { token },
      })
      .then((response) => {
        console.log('API response:', response) // Debugging line

        if (response.data.response === 'success') {
          setAdmins(response.data.result)
          setMessage('Admins fetched successfully.')
        } else {
          setMessage(response.data.responseMsg || 'Failed to fetch admins. Please try again.')
        }
      })
      .catch((error) => {
        console.error('Error fetching admins:', error) // Debugging line
        setMessage('An error occurred while fetching admins. Please try again.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAllAdmins()
  }, [])

  const getTypeLabel = (type) => {
    switch (type) {
      case '2':
        return 'Sub-admin'
      case '3':
        return 'Manager'
      default:
        return 'Unknown'
    }
  }

  // Function to convert status code to label
  const getStatusLabel = (status) => {
    switch (status) {
      case '1':
        return { label: 'Active', variant: 'btn-success active-status-leads text-white btn-sm' }
      case '2':
        return { label: 'Inactive', variant: 'btn-danger inactive-status-leads text-white btn-sm' }
      default:
        return { label: 'Unknown', variant: 'btn-secondary text-white btn-sm' }
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const token = localStorage.getItem('token') // Adjust key based on where you store the token
      try {
        const response = await axios
          .post(
            '/AgreementDashboard/deleteSubAdmin',
            { id },
            {
              headers: {
                token: token,
                'Content-Type': 'application/json',
              },
            },
          )
          .then((response) => {
            console.log('Response:', response.data)
            console.log('Lead deleted successfully:', response.data)
            setAdmins(admins.filter((item) => item.id !== id))
            alert('Data deleted successfully')
          })
      } catch (error) {
        console.error('Error:', error)
        // Handle error response
      }
    }
  }

  const handleUpdateClick = (id) => {
    console.log('Update click')
    navigate(`/update`)
    console.log('Update Id')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="row">
              <div className="col-lg-6">
                {' '}
                <strong>Sub-Admin</strong>
              </div>
              <div className="col-lg-6">
                <CreateSubAdmin fetchAllAdmins={fetchAllAdmins} />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <div>
              <h2>Admin List</h2>
              {/* {message && <p>{message}</p>} */}
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Username</th>
                    <th>Lead</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{admin.username}</td>
                      <td>{getTypeLabel(admin.type)}</td>
                      <td>
                        <button
                          type="button"
                          className={`btn ${getStatusLabel(admin.status).variant}`}
                        >
                          {getStatusLabel(admin.status).label}
                        </button>
                      </td>
                      <td>
                        <Link
                          to={`/update/${admin.id}`}
                          // onClick={() => handleUpdateClick(admin.id)}
                          className="mx-1 btn btn-sm btn-primary"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(admin.id)}
                          className="btn btn-danger btn-sm m-1 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdminList
