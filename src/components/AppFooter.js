import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="footer-area">
        <a href="https://auburnsolutions.com/" target="_blank" rel="noopener noreferrer">
          © 2024 Auburn Digital Solutions. All Rights Reserved
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
