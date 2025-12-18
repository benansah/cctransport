import { useState } from 'react'
import './BookingForm.css'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  from: '',
  to: '',
  passengers: 1,
}

function BookingForm({ onSubmit, locations = [], routes = [] }) {
  const [formData, setFormData] = useState(initialForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
    setFormData(initialForm)
  }

  const getPrice = () => {
    if (!formData.from || !formData.to) return 0
    const route = routes.find(r => r.from === formData.from && r.to === formData.to)
    return route ? parseFloat(route.price) : 0
  }

  const totalPrice = getPrice() * formData.passengers

  return (
    <form className="booking__form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jane Doe"
          // required
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+233 55 000 0000"
          // required
        />
      </div>

      <div className="field">
        <label htmlFor="from">Departure</label>
        <select
          id="from"
          name="from"
          value={formData.from}
          onChange={handleChange}
          // required
        >
          <option value="" disabled>
            Select departure
          </option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="to">Destination</label>
        <select
          id="to"
          name="to"
          value={formData.to}
          onChange={handleChange}
          // required
        >
          <option value="" disabled>
            Select destination
          </option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="passengers">Passengers</label>
        <input
          id="passengers"
          name="passengers"
          type="number"
          min="1"
          max="10"
          value={formData.passengers}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="price">Price*</label>
        <>The price of your trip is: {totalPrice} cedis</>
      </div>
      <button type="submit" className="primary-button">
        Next
      </button>
    </form>
  )
}

export default BookingForm

