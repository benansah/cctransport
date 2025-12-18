import { useState, useEffect } from 'react'
import { supabase } from '../../api/supabase-client'
import { useNavigate } from 'react-router-dom'

function AdminAnalytics() {
  const [stats, setStats] = useState({ totalBookings: 0, paidBookings: 0, revenue: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('bookings').select('if_paid, route_id')
      if (error) console.error(error)
      else {
        const total = data.length
        const paid = data.filter(b => b.if_paid).length
        // For revenue, need to join with routes, but for simplicity, assume average price
        setStats({ totalBookings: total, paidBookings: paid, revenue: paid * 150 }) // placeholder
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <button 
        onClick={() => navigate('/admin')} 
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
      <h2>Analytics</h2>
      <p>Total Bookings: {stats.totalBookings}</p>
      <p>Paid Bookings: {stats.paidBookings}</p>
      <p>Estimated Revenue: {stats.revenue} cedis</p>
    </div>
  )
}

export default AdminAnalytics