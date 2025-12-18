

import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false)
//   const navigate = useNavigate()

  const go = (event, target) => {
    if (onNavigate) {
      event.preventDefault()
      onNavigate(target)
    }
    setOpen(false)
  }

//   const goAdmin = (event) => {
//     event.preventDefault()
//     navigate('/admin')
//     setOpen(false)
//   }

  return (
    <nav className="navbar">
      <div className="navbar__top">
        <div className="navbar__brand">C&C Transport</div>
        <button
          type="button"
          className="navbar__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={open ? 'bar bar1 open' : 'bar bar1'} />
          <span className={open ? 'bar bar2 open' : 'bar bar2'} />
          <span className={open ? 'bar bar3 open' : 'bar bar3'} />
        </button>
      </div>

      <ul className={open ? 'navbar__links open' : 'navbar__links'}>
        <li>
          <a href="#home" onClick={(e) => go(e, 'home')}>
            Home
          </a>
        </li>
        <li>
          <a href="#services" onClick={(e) => go(e, 'home')}>
            Services
          </a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => go(e, 'home')}>
            Contact Us
          </a>
        </li>
        {/* <li>
          <a href="#admin" onClick={goAdmin}>
            Admin
          </a>
        </li> */}
      </ul>
    </nav>
  )
}

export default Navbar