import { useState } from 'react'
import './Contact.css'

const emptyMessage = {
  name: '',
  email: '',
  message: '',
}

function Contact() {
  const [formData, setFormData] = useState(emptyMessage)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(
      `Thanks, ${formData.name || 'friend'}! We'll get back to you at ${
        formData.email || 'your email'
      } soon.`,
    )
    setFormData(emptyMessage)
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__header">
        <p className="eyebrow">Need help?</p>
        <h2>Contact us</h2>
        <p className="contact__lede">
          Questions about routes, schedules, or group bookings? Send us a note
          and we’ll reply shortly.
        </p>
      </div>

      <div className="contact__grid">
        <div className="contact__card">
          <h3>Talk to our team</h3>
          <p>We’re available Monday to Saturday, 8am – 8pm.</p>
          <ul>
            <li>Email: support@cctransport.com</li>
            <li>Phone: +233 55 050 7971</li>
            <li>WhatsApp: 233 55 050 7971</li>
          </ul>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="contact__field contact__field--full">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help..."
              required
            />
          </div>

          <button type="submit" className="contact__button">
            Send message
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact

