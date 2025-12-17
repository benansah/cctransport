import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import BookingForm from './components/BookingForm'
import SeatSelection from './components/SeatSelection'
import Payment from './components/Payment'
import Contact from './pages/Contact'
import AdminPage from './pages/Admin'

const initialLocations = ['Accra', 'Kumasi', 'Ho']
const initialRoutes = [
  { from: 'Accra', to: 'Ho', price: '100 cedis' },
  { from: 'Kumasi', to: 'Ho', price: '170 cedis' },
]
const initialFleet = ['50 seater', '45 seater', '25 seater']
const initialPaymentInfo = {
  number: '0550507971',
  name: 'AKOWUAH CLINTON',
  network: 'MTN',
  deadline: '12th January 2026',
  confirm: 'Send a screenshot of the payment to 0550507971 on WhatsApp.',
}
const company = {
  name: 'C&C TRANSPORT',
  ceo: 'CLINKO EMPIRE',
  work: 'TRANSPORTATION',
}
const ADMIN_PASS = 'admin123'

function App() {
  const [step, setStep] = useState('details')
  const [booking, setBooking] = useState(null)
  const [seat, setSeat] = useState(null)
  const [view, setView] = useState('home')
  const [locations, setLocations] = useState(initialLocations)
  const [routes, setRoutes] = useState(initialRoutes)
  const [fleet, setFleet] = useState(initialFleet)
  const [paymentInfo, setPaymentInfo] = useState(initialPaymentInfo)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminError, setAdminError] = useState('')

  const handleSubmit = (data) => {
    setBooking(data)
    setStep('seats')
  }

  const handleSeatSelect = (seatNumber) => {
    setSeat(seatNumber)
    setStep('payment')
  }

  const handlePay = () => {
    alert(
      `Booking received for ${booking?.name || 'traveler'} from ${
        booking?.from || '?'
      } to ${booking?.to || '?'} (seat ${seat || '?'}). Paystack payment flow would start here.`,
    )
    setStep('details')
    setBooking(null)
    setSeat(null)
  }

  const handleNavigate = (target) => {
    setView(target)
    if (target === 'home') {
      setStep('details')
    }
  }

  const handleAdminLogin = (password) => {
    if (password === ADMIN_PASS) {
      setIsAdmin(true)
      setAdminError('')
    } else {
      setAdminError('Wrong admin password')
    }
  }

  const handleAddLocation = (location) => {
    const trimmed = location.trim()
    if (!trimmed) return
    setLocations((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed].sort(),
    )
  }

  const handleAddRoute = (route) => {
    if (!route.from || !route.to || !route.price) return
    setRoutes((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.from === route.from && r.to === route.to,
      )
      if (existingIndex >= 0) {
        const clone = [...prev]
        clone[existingIndex] = route
        return clone
      }
      return [...prev, route]
    })
  }

  const handleUpdatePayment = (next) => {
    setPaymentInfo((prev) => ({ ...prev, ...next }))
  }

  const handleAddSeat = (seatLabel) => {
    const trimmed = seatLabel.trim()
    if (!trimmed) return
    setFleet((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]))
  }

  return (
    <>
      <Navbar onNavigate={handleNavigate} />
      {view === 'admin' ? (
        <AdminPage
          locations={locations}
          routes={routes}
          fleet={fleet}
          paymentInfo={paymentInfo}
          onAdminLogin={handleAdminLogin}
          adminError={adminError}
          isAdmin={isAdmin}
          onAddLocation={handleAddLocation}
          onAddRoute={handleAddRoute}
          onAddSeat={handleAddSeat}
          onUpdatePayment={handleUpdatePayment}
        />
      ) : (
        <main className="page">
          <section className="hero" id="home">
            <p className="eyebrow">Plan your trip</p>
            <h1>Book your next bus ride in minutes</h1>
            <p className="lede">
              Intercity, shuttle, and airport rides with trusted operators.
              Reserve seats, choose pickup points, and get instant confirmations.
            </p>
          </section>


          <section className="booking" id="services">
            <div className="booking__header">
              <h2>Ride details</h2>
              <p>Tell us where and when you want to go.</p>
            </div>
            <div className="stepper">
              <span className={step === 'details' ? 'step active' : 'step'}>
                1. Details
              </span>
              <span className={step === 'seats' ? 'step active' : 'step'}>
                2. Seat
              </span>
              <span className={step === 'payment' ? 'step active' : 'step'}>
                3. Pay
              </span>
            </div>

            {step === 'details' && (
              <div className="step-panel" key="details">
                <BookingForm locations={locations} onSubmit={handleSubmit} />
              </div>
            )}
            {step === 'seats' && (
              <div className="step-panel" key="seats">
                <SeatSelection onSubmit={handleSeatSelect} />
              </div>
            )}
            {step === 'payment' && (
              <div className="step-panel" key="payment">
                <Payment
                  booking={booking}
                  seat={seat}
                  onPay={handlePay}
                  routes={routes.map((r) => ({
                    label: `${r.from} → ${r.to}`,
                    price: r.price,
                  }))}
                  seats={fleet}
                  paymentInfo={paymentInfo}
                  companyName={company.name}
                  ceo={company.ceo}
                  work={company.work}
                />
              </div>
            )}
          </section>

                    <section className="why">
                      <div className="why__header">
                        <p className="eyebrow">Why ride with us</p>
                        <h2>Reliable, safe, and transparent</h2>
                        <p className="lede">
                          From Accra to Ho and Kumasi to Ho, we keep schedules tight, prices
                          clear, and support close by—so you can focus on the journey.
                        </p>
                      </div>
                      <div className="why__grid">
                        <div className="why__card">
                          <h3>Trusted routes</h3>
                          <p>Regular departures on popular corridors you ride every week.</p>
                        </div>
                        <div className="why__card">
                          <h3>Clear pricing</h3>
                          <p>Upfront fares: 100 cedis (Accra → Ho), 170 cedis (Kumasi → Ho).</p>
                        </div>
                        <div className="why__card">
                          <h3>Responsive support</h3>
                          <p>Call or WhatsApp 0550507971 for changes, questions, or help.</p>
                        </div>
                      </div>
                      <div className="why__cta">
                        <a className="primary-button" href="#services" onClick={() => setStep('details')}>
                          Book your seat now
                        </a>
                      </div>
                    </section>
          <Contact />
        </main>
      )}
    </>
  )
}

export default App
