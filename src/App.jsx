import { useState, useEffect } from 'react'
import Navbar from './components/navbar'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingForm from './components/BookingForm'
import SeatSelection from './components/SeatSelection'
import Payment from './components/Payment'
import Contact from './pages/Contact'
import AdminLogin from './pages/Admin/adminlogin'
import AdminPage from './pages/Admin/adminPage'
import AdminBookings from './pages/Admin/AdminBookings'
import AdminSettings from './pages/Admin/AdminSettings'
import AdminAnalytics from './pages/Admin/AdminAnalytics'
import { supabase } from './api/supabase-client'
import PaystackPop from '@paystack/inline-js'

const company = {
  name: 'C&C TRANSPORT',
  ceo: 'CLINKO EMPIRE',
  work: 'TRANSPORTATION',
}

function Home() {
  const [step, setStep] = useState('details')
  const [booking, setBooking] = useState(null)
  const [seat, setSeat] = useState(null)
  const [locations, setLocations] = useState([])
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [fleet, setFleet] = useState([])
  const [paymentInfo, setPaymentInfo] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [locRes, routeRes, busRes] = await Promise.all([
        supabase.from('locations').select('*'),
        supabase.from('routes').select('*, from_location:locations!from_location_id(name), to_location:locations!to_location_id(name)'),
        supabase.from('buses').select('*')
      ])
      if (locRes.error) console.error(locRes.error)
      else setLocations(locRes.data.map(l => l.name))
      
      if (routeRes.error) console.error(routeRes.error)
      else setRoutes(routeRes.data.map(r => ({
        id: r.id,
        from: r.from_location.name,
        to: r.to_location.name,
        price: r.price
      })))
      
      if (busRes.error) console.error(busRes.error)
      else {
        setBuses(busRes.data)
        setFleet(busRes.data.map(b => ({ id: b.id, type: b.type, seats: b.total_seats })))
      }
      
      setPaymentInfo({
        number: '0550507971',
        name: 'AKOWUAH CLINTON',
        network: 'MTN',
        deadline: '12th January 2026',
        confirm: 'Send a screenshot of the payment to 0550507971 on WhatsApp.'
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSubmit = (data) => {
    setBooking(data)
    setStep('seats')
  }

  const handleSeatSelect = (seatNumber) => {
    setSeat(seatNumber)
    setStep('payment')
  }

  const handlePay = async (totalPrice) => {
    console.log('handlePay called with totalPrice:', totalPrice)
    console.log('booking:', booking)
    console.log('seat:', seat)
    // Save booking to Supabase
    const route = routes.find(r => r.from === booking.from && r.to === booking.to)
    console.log('route found:', route)
    const bus = buses.find(b => b.type === seat)
    console.log('bus found:', bus)
    if (route && bus) {
      // Clean up expired unpaid bookings
      await supabase.from('bookings').delete().eq('if_paid', false).lt('hold_until', new Date().toISOString())
      
      const { data, error } = await supabase.from('bookings').insert({
        user_email: booking.email,
        user_name: booking.name,
        user_phone: booking.phone,
        from: booking.from,
        to: booking.to,
        route_id: route.id,
        bus_id: bus.id,
        passengers: booking.passengers,
        price: totalPrice,
        hold_until: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes hold
        if_paid: false
      }).select()
      if (error) {
        console.error('Insert error:', error)
        alert('Failed to create booking: ' + error.message)
        return
      }
      if (!data || data.length === 0) {
        console.error('No data returned from insert')
        alert('Failed to create booking')
        return
      }
      const bookingId = data[0].id
      // Setup Paystack
      if (typeof PaystackPop !== 'undefined') {
        const paystack = new PaystackPop();
        paystack.newTransaction({
          key: 'pk_test_f797bac4e2b254971cd9300b0f173c6255a0701d', // Test public key
          email: booking.email,
          amount: totalPrice * 100, // in kobo
          onSuccess: async (transaction) => {
            console.log('Payment success:', transaction)
            await supabase.from('bookings').update({ if_paid: true }).eq('id', bookingId)
            alert('Payment successful! Ticket details will be sent to your email.')
            setStep('details')
            setBooking(null)
            setSeat(null)
          },
          onCancel: () => {
            console.log('Payment closed')
            // Optionally delete the unpaid booking
            supabase.from('bookings').delete().eq('id', bookingId)
          }
        })
      } else {
        console.error('PaystackPop not available')
      }
    } else {
      console.error('Route or bus not found')
    }
  }

  const handleBack = () => {
    if (step === 'seats') setStep('details')
    else if (step === 'payment') setStep('seats')
  }

  if (loading) return <div>Loading...</div>

  return (
    <main className="page">
      <section className='heromain'>

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
            <BookingForm locations={locations} routes={routes} onSubmit={handleSubmit} />
          </div>
        )}
        {step === 'seats' && (
          <div className="step-panel" key="seats">
            <SeatSelection onSubmit={handleSeatSelect} onBack={handleBack} seats={buses.map(b => b.type)} />
          </div>
        )}
        {step === 'payment' && (
          <div className="step-panel" key="payment">
            <Payment
              booking={booking}
              seat={seat}
              onPay={handlePay}
              onBack={handleBack}
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
          <a className="primary-button" href="#services">
            Book your seat now
          </a>
        </div>
      </section>
      <Contact />
    </main>
  )
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Routes>
    </Router>
  )
}

export default App
