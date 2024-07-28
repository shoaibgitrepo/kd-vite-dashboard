import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CForm, CFormInput, CInputGroup, CFormSelect } from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [popupData, setPopupData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedStatus, setSelectedStatus] = useState('Select Entity')
  const [statusOptions, setStatusOptions] = useState([])

  const [selectedBusiness, setSelectedBusiness] = useState('Select Business')
  const [businessOptions, setBusinessOptions] = useState([])

  // Function to handle click on <td> and fetch more details
  const handleRowData = async (leadId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        '/AgreementDashboard/getLead',
        { id: leadId },
        {
          headers: {
            token: token,
          },
        },
      )
      setPopupData(response.data) // Assuming the API response for popup data
    } catch (error) {
      console.error('Error fetching popup data:', error)
      // Handle errors here
    }
  }

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('Token not found. Please log in.')
        setLoading(false)
        return
      }
      axios({
        method: 'post',
        url: '/AgreementDashboard/getAllLeads',
        headers: {
          token: token,
          // Cookie header is not set manually
        },
        data: {
          // Assuming form data is required, leave empty as per your example
        },
      })
        .then((response) => {
          console.log('API response:', response) // Debugging line

          // if (response.data.response === 'success' && Array.isArray(response.data.result)) {
          //   setLeads(response.data)
          //   setFilteredLeads(response.data) // Initialize filtered data
          // }

          if (response.data.response === 'success' && Array.isArray(response.data.result)) {
            setLeads(response.data.result)
            setFilteredLeads(response.data.result)

            // Extract Company Type options from data
            const statuses = [...new Set(response.data.result.map((lead) => lead.companyType))]
            setStatusOptions(['Select Entity', ...statuses]) // Add 'Select Entity' option for no filter

            // multipleSelect
            const business = [...new Set(response.data.result.map((lead) => lead.multipleSelect))]
            setBusinessOptions(['Select Business', ...business]) // Add 'Select Entity' option for no filter
          } else if (Array.isArray(response.data.result)) {
            setLeads(response.data.result)
            setFilteredLeads(response.data.result)

            const statuses = [...new Set(response.data.leads.map((lead) => lead.companyType))]
            setStatusOptions(['Select Entity', ...statuses])

            const business = [...new Set(response.data.leads.map((lead) => lead.multipleSelect))]
            setBusinessOptions(['Select Business', ...business])
          } else {
            console.error('Unexpected response format:', response.data)
            setError('Unexpected response format')
          }
        })
        .catch((error) => {
          console.error('Error fetching admins:', error) // Debugging line
          setError('An error occurred while fetching admins. Please try again.')
        })
        .finally(() => setLoading(false))
    }

    fetchLeads()
  }, [])

  // delete data
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const token = localStorage.getItem('token') // Adjust key based on where you store the token
      try {
        const response = await axios
          .post(
            '/AgreementDashboard/deleteLead',
            { id },
            {
              headers: {
                token: token,
                'Content-Type': 'application/json',
              },
            },
          )
          .then((response) => {
            console.log('Lead deleted successfully:', response.data)
            setLeads(leads.filter((item) => item.id !== id))
            alert('Data deleted successfully')
          })
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  // Function to convert status code to label
  const getStatusLabel = (status) => {
    switch (status) {
      case '1':
        return { label: 'Active', variant: 'btn-success active-status btn-sm text-white' }
      case '0':
        return { label: 'Inactive', variant: 'btn-danger inactive-status btn-sm text-white' }
      default:
        return { label: 'Unknown', variant: 'btn-secondary btn-sm text-white' }
    }
  }

  // Filter leads based on search query and selected status
  useEffect(() => {
    if (Array.isArray(leads)) {
      const filtered = leads
        .filter(
          (lead) =>
            lead.businessName &&
            lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()),
          // (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .filter((lead) => selectedStatus === 'Select Entity' || lead.companyType === selectedStatus)
        .filter(
          (lead) =>
            selectedBusiness === 'Select Business' || lead.multipleSelect === selectedBusiness,
        )
      setFilteredLeads(filtered)
    }
  }, [searchQuery, leads, selectedStatus, selectedBusiness])

  if (loading) {
    return <p>Loading...</p>
  }

  // Handle dropdown filter change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value)
  }

  // Handle input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Handle input change
  const handleBusiness = (event) => {
    setSelectedBusiness(event.target.value)
  }

  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      {/* <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">January - July 2023</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard> */}
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            {/* <CCardHeader>Traffic {' & '} Sales</CCardHeader> */}
            <CCardBody>
              <div className="row">
                <div className="col-lg-12">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <label htmlFor="search">Search Business:</label>
                        </td>
                        <td>
                          <CFormInput
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Type here."
                          />
                        </td>
                        <td>
                          <CFormSelect value={selectedStatus} onChange={handleStatusChange}>
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </CFormSelect>
                        </td>
                        <td>
                          <CFormSelect
                            style={{ width: '200px' }}
                            value={selectedBusiness}
                            onChange={handleBusiness}
                          >
                            {businessOptions.map((business) => (
                              <option key={business} value={business}>
                                {business}
                              </option>
                            ))}
                          </CFormSelect>
                        </td>
                        <td>
                          <div className="add-new-user-btn">
                            <div>
                              <Link to="/agreementForm" className="btn  btn-primary">
                                Add New <b>+</b>
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                {error ? (
                  <p>{error}</p>
                ) : (
                  <div className="dashboard-table">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>S. No.</th>
                          {/* <th>Username</th> */}
                          {/* <th>Owner Name</th> */}
                          <th>Business Name</th>
                          <th>Entity Name</th>
                          <th>Business Type</th>
                          {/* <th>Contact Number</th> */}
                          {/* <th>Email</th> */}
                          <th>Address</th>
                          {/* <th>Country</th> */}
                          <th>City</th>
                          <th>Zip Code</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Agreement File</th>
                          <th>Other docs</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(filteredLeads) && filteredLeads.length > 0 ? (
                          filteredLeads.map((lead, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              {/* <td>{lead.username}</td> */}
                              {/* <td>{lead.ownerName}</td> */}
                              <td>{lead.businessName}</td>
                              <td>{lead.companyType}</td>
                              <td>{lead.multipleSelect}</td>
                              {/* <td>{lead.contactNumber}</td> */}
                              {/* <td>{lead.email}</td> */}
                              <td>{lead.address}</td>
                              {/* <td>{lead.country}</td> */}
                              <td>{lead.city}</td>
                              <td>{lead.zipCode}</td>
                              <td>{lead.startDate}</td>
                              <td className="text-danger">{lead.endDate}</td>
                              <td>
                                <a
                                  type="button"
                                  className="badge view-files "
                                  href={lead.file1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View docs
                                </a>
                              </td>
                              <td>
                                <a
                                  type="button"
                                  className="badge view-files"
                                  href={lead.file2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View docs
                                </a>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={`btn ${getStatusLabel(lead.status).variant}`}
                                >
                                  {getStatusLabel(lead.status).label}
                                </button>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="badge view-leads "
                                  data-toggle="modal"
                                  data-target="#exampleModalLong"
                                  onClick={() => handleRowData(lead.id)}
                                >
                                  <span className="view-lead-row">{lead.id}</span> View
                                </button>
                                &nbsp;
                                <button
                                  className="badge delete-leads"
                                  onClick={() => handleDeleteClick(lead.id)}
                                >
                                  Delete
                                </button>
                                &nbsp;
                                <Link
                                  to={`/updateDashboard/${lead.id}`}
                                  className="badge edit-leads"
                                >
                                  Update
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Model area start here */}
              <div
                className="modal fade"
                id="exampleModalLong"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLongTitle"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <table className="table">
                        <td>
                          <h5 className="modal-title" id="exampleModalLongTitle">
                            Dashboard Row Data
                          </h5>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </td>
                      </table>
                    </div>
                    <div className="modal-body">
                      <table className="table">
                        <tbody>
                          {popupData?.result?.map((lead) => (
                            <tr key={lead.id}>
                              <table className="table">
                                <tbody>
                                  <tr>
                                    <th scope="row">Heading</th>
                                    <th>Value</th>
                                  </tr>
                                  <tr>
                                    <th scope="row">Company</th>
                                    <td>{lead.companyType}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Business Type</th>
                                    <td>{lead.multipleSelect}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Name</th>
                                    <td>{lead.ownerName}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Business Legal</th>
                                    <td>{lead.businessLegal}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Contact Number</th>
                                    <td>{lead.contactNumber}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">GST Number</th>
                                    <td>{lead.gstNumber}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Email Address</th>
                                    <td>{lead.email}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Address</th>
                                    <td>{lead.address}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Country</th>
                                    <td>{lead.country}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">City</th>
                                    <td>{lead.city}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">ZipCode</th>
                                    <td>{lead.zipCode}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Start Date</th>
                                    <td>{lead.startDate}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">End Date</th>
                                    <td>{lead.endDate}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">status</th>
                                    <td>
                                      <button
                                        style={{ width: '70px' }}
                                        type="button"
                                        className={`btn ${getStatusLabel(lead.status).variant}`}
                                      >
                                        {getStatusLabel(lead.status).label}
                                      </button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Digital Copy</th>
                                    <td>
                                      <a
                                        type="button"
                                        className="badge view-files "
                                        href={lead.file1}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View docs
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Other Documents</th>
                                    <td>
                                      <a
                                        type="button"
                                        className="badge view-files "
                                        href={lead.file2}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View docs
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Model area close here */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
