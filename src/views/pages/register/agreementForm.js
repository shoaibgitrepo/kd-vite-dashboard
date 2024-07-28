import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Joi from 'joi'
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
import { MultiSelect } from 'react-multi-select-component'

// Define the validation schema
const schema = Joi.object({
  companyType: Joi.string().required().label('Company Type'),
  multipleSelect: Joi.array().items(Joi.string()).required().label('Multiple Select'),
  ownerName: Joi.string().required().label('Owner Name'),
  businessName: Joi.string().required().label('Business Name'),
  businessLegal: Joi.string().valid('Yes', 'No').required().label('Business Legal'),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .label('Contact Number'),
  gstNumber: Joi.string().required().label('GST Number'),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label('Email'),
  address: Joi.string().required().label('Address'),
  country: Joi.string().required().label('Country'),
  city: Joi.string().required().label('City'),
  zipCode: Joi.string().required().label('Zip Code'),
  startDate: Joi.date().required().label('Start Date'),
  endDate: Joi.date().required().label('End Date'),
  status: Joi.string().valid('1', '2').required().label('Status'),
  file1: Joi.object().required().label('File 1'),
  file2: Joi.object().required().label('File 2'),
})

const AgreementForm = () => {
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyType: '',
    multipleSelect: [],
    ownerName: '',
    businessName: '',
    businessLegal: '',
    contactNumber: '',
    gstNumber: '',
    email: '',
    address: '',
    country: '',
    city: '',
    zipCode: '',
    startDate: '',
    endDate: '',
    status: '',
    file1: null,
    file2: null,
  })

  // Validation
  const validate = () => {
    console.log(formData)
    const { error } = schema.validate(formData, { abortEarly: false })
    if (error) {
      const errorMessages = {}
      error.details.forEach((detail) => {
        errorMessages[detail.path[0]] = detail.message
      })
      setErrors(errorMessages)
      return false
    }
    setErrors({})
    return true
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    console.log('Handle')
    e.preventDefault()
    if (!validate()) return
    console.log('Handle2')
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('admin_id', '1') // Assuming admin_id is a static value

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (key === 'file1' || key === 'file2') return // Skip files here
        formDataToSend.append(key, formData[key])
      })

      // Append files
      if (formData.file1) {
        formDataToSend.append('file1', formData.file1)
      }
      if (formData.file2) {
        formDataToSend.append('file2', formData.file2)
      }

      const token = localStorage.getItem('token') // Adjust key based on where you store the token
      console.log(token)
      const response = await axios.post('/AgreementDashboard/addLead', formDataToSend, {
        headers: {
          token: token, // Use the token from local storage
          Cookie: 'ci_session=f297981c5fead88362f160ca65a9e2e26110dfd9',
        },
        body: formData,
        credentials: 'include', // Ensures cookies are sent with the request
      })
      console.log('Form Submitted Successfully')
      alert('Form Submitted Successfully')
      navigate('/dashboard')
      console.log('Response:', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }))
    } else if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.checked,
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  // useEffect(() => {
  //   console.log(formData.admin_id)
  // }, [formData.admin_id])

  // Load data from local storage when component mounts
  // useEffect(() => {
  //   const savedData = localStorage.getItem('formData')
  //   if (savedData) {
  //     setFormData(JSON.parse(savedData))
  //   }
  // }, [])

  // useEffect(() => {
  //   localStorage.setItem('formData', JSON.stringify(formData))
  // }, [formData])

  // Handle multiple select change
  const handleMultipleSelectChange = (name, selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOptions.map((option) => option.value), // Assuming selectedOptions is an array of objects
    }))
  }

  const options = [
    { label: 'Social Media', value: 'Social Media' },
    { label: 'Paid Media', value: 'Paid Media' },
    { label: 'SEO ', value: 'SEO' },
    { label: 'Website ', value: 'Website' },
  ]

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={8}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h4 className="text-center">Agreement Form</h4>
                  <p className="text-body-secondary"></p>
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-12">
                      <label>Select Company:</label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option defaultValue="None">Select Company Type</option>
                        <option value="Auburn Digital">Auburn Digital</option>
                        <option value="Auburn Digitech">Auburn Digitech</option>
                        <option value="Aurum Digitech">Aurum Digitech</option>
                      </select>
                      {errors.companyType && (
                        <div className="error text-danger">{errors.companyType}</div>
                      )}
                      <br />
                      <label>Select Business:</label>
                      <MultiSelect
                        name="multipleSelect"
                        options={options}
                        className="multiple-select"
                        value={options.filter((option) =>
                          formData.multipleSelect.includes(option.value),
                        )}
                        onChange={(selectedOptions) =>
                          handleMultipleSelectChange('multipleSelect', selectedOptions)
                        }
                        labelledBy="Select business type"
                      />
                      {errors.multipleSelect && (
                        <div className="error text-danger">{errors.multipleSelect}</div>
                      )}
                      <br />
                      <label>Owner Name:</label>
                      <CFormInput
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Enter Owner Name"
                        autoComplete="ownerName"
                      />
                      {errors.ownerName && (
                        <div className="error text-danger">{errors.ownerName}</div>
                      )}
                      <br />
                      <label>Business Name:</label>
                      <CFormInput
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter Business Name"
                        autoComplete="businessName"
                      />
                      {errors.businessName && (
                        <div className="error text-danger">{errors.businessName}</div>
                      )}
                      <br />
                      <label>Business Legal:</label>
                      <CFormInput
                        name="businessLegal"
                        value={formData.businessLegal}
                        onChange={handleChange}
                        placeholder="Enter Business Legal"
                        autoComplete="EnterBusinessLegal"
                      />
                      {errors.businessLegal && (
                        <div className="error text-danger">{errors.businessLegal}</div>
                      )}
                      <br />
                      <label>Contact Number:</label>
                      <CFormInput
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Enter Mobile Number"
                        autoComplete="Enter Mobile Number"
                      />
                      {errors.contactNumber && (
                        <div className="error text-danger">{errors.contactNumber}</div>
                      )}
                      <br />

                      <label>GST Number:</label>
                      <CFormInput
                        name="gstNumber"
                        value={formData.gstNumber}
                        placeholder="Enter GST Number"
                        autoComplete="GSTNumber"
                        onChange={handleChange}
                      />
                      {errors.gstNumber && (
                        <div className="error text-danger">{errors.gstNumber}</div>
                      )}
                      <br />
                      <label>Email Address:</label>
                      <CFormInput
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        autoComplete="email"
                        onChange={handleChange}
                      />
                      {errors.email && <div className="error text-danger">{errors.email}</div>}

                      <label>Status:</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                      {errors.status && <p>{errors.status}</p>}
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-12">
                      <label>Select Country:</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Åland Islands">Åland Islands</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="American Samoa">American Samoa</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Anguilla">Anguilla</option>
                        <option value="Antarctica">Antarctica</option>
                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Bouvet Island">Bouvet Island</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Indian Ocean Territory">
                          British Indian Ocean Territory
                        </option>
                        <option value="Brunei Darussalam">Brunei Darussalam</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">Central African Republic</option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Christmas Island">Christmas Island</option>
                        <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo">Congo</option>
                        <option value="Congo, The Democratic Republic of The">
                          Congo, The Democratic Republic of The
                        </option>
                        <option value="Cook Islands">Cook Islands</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote D'ivoire">Cote D'ivoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Falkland Islands (Malvinas)">
                          Falkland Islands (Malvinas)
                        </option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="French Guiana">French Guiana</option>
                        <option value="French Polynesia">French Polynesia</option>
                        <option value="French Southern Territories">
                          French Southern Territories
                        </option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Greenland">Greenland</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guernsey">Guernsey</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-bissau">Guinea-bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Heard Island and Mcdonald Islands">
                          Heard Island and Mcdonald Islands
                        </option>
                        <option value="Holy See (Vatican City State)">
                          Holy See (Vatican City State)
                        </option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jersey">Jersey</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Korea, Democratic People's Republic of">
                          Korea, Democratic People's Republic of
                        </option>
                        <option value="Korea, Republic of">Korea, Republic of</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Lao People's Democratic Republic">
                          Lao People's Democratic Republic
                        </option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macao">Macao</option>
                        <option value="Macedonia, The Former Yugoslav Republic of">
                          Macedonia, The Former Yugoslav Republic of
                        </option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">Marshall Islands</option>
                        <option value="Martinique">Martinique</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mayotte">Mayotte</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia, Federated States of">
                          Micronesia, Federated States of
                        </option>
                        <option value="Moldova, Republic of">Moldova, Republic of</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Netherlands Antilles">Netherlands Antilles</option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Niue">Niue</option>
                        <option value="Norfolk Island">Norfolk Island</option>
                        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestinian Territory, Occupied">
                          Palestinian Territory, Occupied
                        </option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Pitcairn">Pitcairn</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Reunion">Reunion</option>
                        <option value="Romania">Romania</option>
                        <option value="Russian Federation">Russian Federation</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Helena">Saint Helena</option>
                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                        <option value="Saint Vincent and The Grenadines">
                          Saint Vincent and The Grenadines
                        </option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Georgia and The South Sandwich Islands">
                          South Georgia and The South Sandwich Islands
                        </option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania, United Republic of">
                          Tanzania, United Republic of
                        </option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-leste">Timor-leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tokelau">Tokelau</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="United States Minor Outlying Islands">
                          United States Minor Outlying Islands
                        </option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Viet Nam">Viet Nam</option>
                        <option value="Virgin Islands, British">Virgin Islands, British</option>
                        <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                        <option value="Wallis and Futuna">Wallis and Futuna</option>
                        <option value="Western Sahara">Western Sahara</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                      </select>
                      {errors.country && <div className="error text-danger">{errors.country}</div>}
                      <br />
                      <label>City Name:</label>
                      <CFormInput
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter City"
                        autoComplete="city"
                      />
                      {errors.city && <div className="error text-danger">{errors.city}</div>}
                      <br />
                      <label>Zipe Code:</label>
                      <CFormInput
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Enter Zip Code"
                        autoComplete="zipCode"
                        type="text"
                      />
                      {errors.zipCode && <div className="error text-danger">{errors.zipCode}</div>}
                      <br />
                      <label>Select Start Date:</label>
                      <CFormInput
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        type="date"
                        autoComplete="date"
                      />
                      {errors.startDate && (
                        <div className="error text-danger">{errors.startDate}</div>
                      )}
                      <br />
                      <label>Select End Date:</label>
                      <CFormInput
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        type="date"
                        autoComplete="date"
                      />
                      {errors.endDate && <div className="error text-danger">{errors.endDate}</div>}
                      <br />
                      <label>Address:</label>
                      <CFormInput
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Address"
                        autoComplete="Address"
                      />
                      {errors.address && <div className="error text-danger">{errors.address}</div>}
                      <br />
                      <label>Upload Agreement File:</label>
                      <CFormInput
                        name="file1"
                        type="file"
                        multiple
                        autoComplete="file"
                        onChange={handleChange}
                      />
                      <br />
                      <label>Upload Other Docs:</label>
                      <CFormInput
                        name="file2"
                        onChange={handleChange}
                        type="file"
                        multiple
                        autoComplete="file"
                      />

                      <br />
                    </div>
                  </div>
                  <div className="d-grid">
                    <br />
                    <CButton type="submit" color="primary">
                      Submit
                    </CButton>
                  </div>
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

export default AgreementForm
