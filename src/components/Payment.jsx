import './Payment.css'

function Payment({
  booking,
  seat,
  onPay,
  companyName = 'C&C TRANSPORT',
  ceo = 'CLINKO EMPIRE',
  work = 'TRANSPORTATION',
  routes = [],
  seats = [],
  paymentInfo = {},
}) {
  if (!booking) return null

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
        </ul>
      </div>

      <div className="payment__info">
        <div className="payment__card">
          <p className="eyebrow">{work}</p>
          <h3>{companyName}</h3>
          <p className="payment__meta">CEO: {ceo}</p>
          <div className="payment__routes">
            {routes.map((route) => {
              const label = route.label || `${route.from} → ${route.to}`
              return (
                <div key={label} className="payment__route">
                  <span>{label}</span>
                  <strong>{route.price || '—'}</strong>
                </div>
              )
            })}
          </div>
          <div className="payment__seats">
            <span>Common fleet:</span>
            <div className="payment__chips">
              {seats.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="payment__card payment__card--payment">
          <h4>Payment details</h4>
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
          <button type="button" className="primary-button" onClick={onPay}>
            Pay with Paystack
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payment

