import AdminPanel from '../../components/AdminPanel'
import { useNavigate } from 'react-router-dom'

function AdminSettings() {
  const navigate = useNavigate()

  return (
    <div>
      <button 
        onClick={() => navigate('/admin')} 
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
      <AdminPanel isAdmin={true} />
    </div>
  )
}

export default AdminSettings