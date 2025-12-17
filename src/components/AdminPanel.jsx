import { useEffect, useState } from 'react'
import './AdminPanel.css'

function AdminPanel({
  locations,
  routes,
  fleet,
  paymentInfo,
  onAdminLogin,
  adminError,
  isAdmin,
  onAddLocation,
  onAddRoute,
  onAddSeat,
  onUpdatePayment,
}) {
  const [password, setPassword] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [routeFrom, setRouteFrom] = useState('')
  const [routeTo, setRouteTo] = useState('')
  const [routePrice, setRoutePrice] = useState('')
  const [seatLabel, setSeatLabel] = useState('')
  const [paymentForm, setPaymentForm] = useState(paymentInfo)

  useEffect(() => {
    setPaymentForm(paymentInfo)
  }, [paymentInfo])

  const handleLogin = (event) => {
    event.preventDefault()
    onAdminLogin(password)
  }

  const handleAddLocation = (event) => {
    event.preventDefault()
    onAddLocation(newLocation)
    setNewLocation('')
  }

  const handleAddRoute = (event) => {
    event.preventDefault()
    onAddRoute({ from: routeFrom, to: routeTo, price: routePrice })
    setRouteFrom('')
    setRouteTo('')
    setRoutePrice('')
  }

  const handleAddSeat = (event) => {
    event.preventDefault()
    onAddSeat(seatLabel)
    setSeatLabel('')
  }

  const handlePaymentSubmit = (event) => {
    event.preventDefault()
    onUpdatePayment(paymentForm)
  }

  if (!isAdmin) {
    return (
      <form className="admin-card" onSubmit={handleLogin}>
        <h3>Admin login</h3>
        <label className="admin__label" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          required
        />
        {adminError ? <p className="admin__error">{adminError}</p> : null}
        <button type="submit" className="primary-button admin__submit">
          Login
        </button>
      </form>
    )
  }

  return (
    <div className="admin-grid">
      <form className="admin-card" onSubmit={handleAddLocation}>
        <h3>Locations</h3>
        <label className="admin__label" htmlFor="new-location">
          Add location
        </label>
        <input
          id="new-location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="e.g., Accra"
          required
        />
        <p className="admin__hint">Current: {locations.join(', ') || '—'}</p>
        <button type="submit" className="primary-button admin__submit">
          Save location
        </button>
      </form>

      <form className="admin-card" onSubmit={handleAddRoute}>
        <h3>Routes & prices</h3>
        <div className="admin__row">
          <label className="admin__label" htmlFor="route-from">
            From
          </label>
          <select
            id="route-from"
            value={routeFrom}
            onChange={(e) => setRouteFrom(e.target.value)}
            required
          >
            <option value="" disabled>
              Select
            </option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className="admin__row">
          <label className="admin__label" htmlFor="route-to">
            To
          </label>
          <select
            id="route-to"
            value={routeTo}
            onChange={(e) => setRouteTo(e.target.value)}
            required
          >
            <option value="" disabled>
              Select
            </option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className="admin__row">
          <label className="admin__label" htmlFor="route-price">
            Price
          </label>
          <input
            id="route-price"
            value={routePrice}
            onChange={(e) => setRoutePrice(e.target.value)}
            placeholder="e.g., 120 cedis"
            required
          />
        </div>
        <p className="admin__hint">
          Current routes:{' '}
          {routes.length
            ? routes
                .map((r) => `${r.from} → ${r.to} (${r.price || '—'})`)
                .join(', ')
            : '—'}
        </p>
        <button type="submit" className="primary-button admin__submit">
          Save route
        </button>
      </form>

      <form className="admin-card" onSubmit={handlePaymentSubmit}>
        <h3>Payment details</h3>
        <label className="admin__label" htmlFor="pay-number">
          Number
        </label>
        <input
          id="pay-number"
          value={paymentForm.number || ''}
          onChange={(e) => setPaymentForm({ ...paymentForm, number: e.target.value })}
          placeholder="0550507971"
          required
        />
        <label className="admin__label" htmlFor="pay-name">
          Name
        </label>
        <input
          id="pay-name"
          value={paymentForm.name || ''}
          onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
          placeholder="AKOWUAH CLINTON"
          required
        />
        <label className="admin__label" htmlFor="pay-network">
          Network
        </label>
        <input
          id="pay-network"
          value={paymentForm.network || ''}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, network: e.target.value })
          }
          placeholder="MTN"
          required
        />
        <label className="admin__label" htmlFor="pay-deadline">
          Deadline
        </label>
        <input
          id="pay-deadline"
          value={paymentForm.deadline || ''}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, deadline: e.target.value })
          }
          placeholder="12th January 2026"
          required
        />
        <label className="admin__label" htmlFor="pay-confirm">
          Confirmation plan
        </label>
        <textarea
          id="pay-confirm"
          rows="3"
          value={paymentForm.confirm || ''}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, confirm: e.target.value })
          }
          placeholder="Send a screenshot of the payment to 0550507971 on WhatsApp."
          required
        />
        <button type="submit" className="primary-button admin__submit">
          Save payment details
        </button>
      </form>

      <form className="admin-card" onSubmit={handleAddSeat}>
        <h3>Fleet (labels)</h3>
        <label className="admin__label" htmlFor="seat-label">
          Add fleet label
        </label>
        <input
          id="seat-label"
          value={seatLabel}
          onChange={(e) => setSeatLabel(e.target.value)}
          placeholder="e.g., 50 seater"
          required
        />
        <p className="admin__hint">Current: {fleet.join(', ') || '—'}</p>
        <button type="submit" className="primary-button admin__submit">
          Save fleet label
        </button>
      </form>
    </div>
  )
}

export default AdminPanel

