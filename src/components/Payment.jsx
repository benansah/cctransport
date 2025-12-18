import './Payment.css'

function Payment({
  booking,
  seat,
  onPay,
  onBack,
  companyName = 'C&C TRANSPORT',
  ceo = 'CLINKO EMPIRE',
  work = 'TRANSPORTATION',
  routes = [],
  paymentInfo = {},
}) {
  if (!booking) return null

  const selectedRoute = routes.find(r => r.label.includes(booking.from) && r.label.includes(booking.to))
  const totalPrice = (selectedRoute?.price || 0) * (booking.passengers || 1)

  return (
    <div className="payment">
      <div className="payment__summary">
        <h3>Review</h3>
        <ul>
          <li>
            <span>Passenger</span>
            <strong>{booking.name || '—'}</strong>
          </li>
          <li>
            <span>From</span>
            <strong>{booking.from || '—'}</strong>
          </li>
          <li>
            <span>To</span>
            <strong>{booking.to || '—'}</strong>
          </li>
          <li>
            <span>Date</span>
            <strong>{booking.date || '—'}</strong>
          </li>
          <li>
            <span>Passengers</span>
            <strong>{booking.passengers || 1}</strong>
          </li>
          <li>
            <span>Seat</span>
            <strong>{seat || 'Select a seat'}</strong>
          </li>
          <li>
            <span>Total Price</span>
            <strong>${totalPrice}</strong>
          </li>
        </ul>
      </div>

      <div className="payment__info">
        <div className="payment__card">
          <p className="eyebrow">{work}</p>
          <h3>{companyName}</h3>
          <p className="payment__meta">CEO: {ceo}</p>
        </div>

        <div className="payment__card payment__card--payment">
          <h4>Payment details</h4>
          <div className="payment__total">
            <span>Total to pay:</span>
            <strong>${totalPrice}</strong>
          </div>
          <ul className="payment__list">
            <li>
              <span>Number</span>
              <strong>{paymentInfo.number || '—'}</strong>
            </li>
            <li>
              <span>Name</span>
              <strong>{paymentInfo.name || '—'}</strong>
            </li>
            <li>
              <span>Network</span>
              <strong>{paymentInfo.network || '—'}</strong>
            </li>
            <li>
              <span>Deadline</span>
              <strong>{paymentInfo.deadline || '—'}</strong>
            </li>
          </ul>
          <p className="payment__note">{paymentInfo.confirm || ''}</p>
          <div className="payment__actions">
            <button type="button" className="secondary-button" onClick={onBack}>
              Back
            </button>
            <button type="button" className="primary-button" onClick={() => onPay(totalPrice)}>
              Pay with Paystack
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

