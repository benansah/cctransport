import { useState, useEffect } from 'react'
import { supabase } from '../../api/supabase-client'
import { useNavigate } from 'react-router-dom'

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('if_paid', true)
      .order('price', { ascending: false })
    if (error) {
      console.error(error)
    } else {
      setBookings(data)
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchBookings()
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div>Loading...</div>

  const groupedBookings = bookings.reduce((acc, booking) => {
    const price = booking.price || 0
    if (!acc[price]) acc[price] = []
    acc[price].push(booking)
    return acc
  }, {})

  return (
    <div>
      <button 
        onClick={() => navigate('/admin')} 
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Paid Bookings</h2>
      {Object.entries(groupedBookings).map(([price, bs]) => (
        <div key={price} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
            Bookings at ${price}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Phone</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Departure to Destination</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Passengers</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Paid</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {bs.map((booking) => (
                <tr key={booking.id} style={{ backgroundColor: booking.if_paid ? '#d4edda' : '#f8d7da' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking.user_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking.user_email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking.user_phone}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking.from} to {booking.to}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking.passengers}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking.if_paid ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(booking.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export default AdminBookings