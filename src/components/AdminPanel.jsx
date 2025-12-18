import { useEffect, useState } from 'react'
import { supabase } from '../api/supabase-client'
import './AdminPanel.css'

function AdminPanel() {
  const [locations, setLocations] = useState([])
  const [routes, setRoutes] = useState([])
  const [fleet, setFleet] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: locData } = await supabase.from('locations').select('*')
      const { data: routeData } = await supabase.from('routes').select('*, from_location:locations!from_location_id(name), to_location:locations!to_location_id(name)')
      const { data: fleetData } = await supabase.from('buses').select('*')
      setLocations(locData ? locData.map(l => l.name) : [])
      setRoutes(routeData ? routeData.map(r => ({
        id: r.id,
        from: r.from_location?.name || '',
        to: r.to_location?.name || '',
        price: r.price
      })) : [])
      setFleet(fleetData ? fleetData.map(b => ({ id: b.id, type: b.type, seats: b.total_seats })) : [])
    }
    fetchData()
  }, [])

  const [newLocation, setNewLocation] = useState('')
  const [routeFrom, setRouteFrom] = useState('')
  const [routeTo, setRouteTo] = useState('')
  const [routePrice, setRoutePrice] = useState('')
  const [seatLabel, setSeatLabel] = useState('')
  const [editingLocation, setEditingLocation] = useState(null)
  const [editingRoute, setEditingRoute] = useState(null)
  const [editingBus, setEditingBus] = useState(null)

  const refetchData = async () => {
    const [locRes, routeRes, busRes] = await Promise.all([
      supabase.from('locations').select('*'),
      supabase.from('routes').select('*, from_location:locations!from_location_id(name), to_location:locations!to_location_id(name)'),
      supabase.from('buses').select('*')
    ])
    if (locRes.data) setLocations(locRes.data.map(l => l.name))
    if (routeRes.data) setRoutes(routeRes.data.map(r => ({
      id: r.id,
      from: r.from_location.name,
      to: r.to_location.name,
      price: r.price
    })))
    if (busRes.data) setFleet(busRes.data.map(b => ({ id: b.id, type: b.type, seats: b.total_seats })))
  }

  const deleteLocation = async (name) => {
    const { error } = await supabase.from('locations').delete().eq('name', name)
    if (error) console.error(error)
    else refetchData()
  }

  const updateLocation = async (oldName, newName) => {
    const { error } = await supabase.from('locations').update({ name: newName }).eq('name', oldName)
    if (error) console.error(error)
    else {
      setEditingLocation(null)
      refetchData()
    }
  }

  const deleteRoute = async (id) => {
    const { error } = await supabase.from('routes').delete().eq('id', id)
    if (error) console.error(error)
    else refetchData()
  }

  const updateRoute = async (id, from, to, price) => {
    const fromLoc = await supabase.from('locations').select('id').eq('name', from).single()
    const toLoc = await supabase.from('locations').select('id').eq('name', to).single()
    if (fromLoc.data && toLoc.data) {
      const { error } = await supabase.from('routes').update({
        from_location_id: fromLoc.data.id,
        to_location_id: toLoc.data.id,
        price: parseFloat(price)
      }).eq('id', id)
      if (error) console.error(error)
      else {
        setEditingRoute(null)
        refetchData()
      }
    }
  }

  const deleteBus = async (id) => {
    const { error } = await supabase.from('buses').delete().eq('id', id)
    if (error) console.error(error)
    else refetchData()
  }

  const updateBus = async (id, type, seats) => {
    const { error } = await supabase.from('buses').update({ type, total_seats: parseInt(seats) }).eq('id', id)
    if (error) console.error(error)
    else {
      setEditingBus(null)
      refetchData()
    }
  }

  const handleAddLocation = async (event) => {
    event.preventDefault()
    const trimmed = newLocation.trim()
    if (!trimmed) return
    const { data: existing } = await supabase.from('locations').select('id').eq('name', trimmed).single()
    if (existing) {
      alert('Location already exists')
      return
    }
    const { error } = await supabase.from('locations').insert({ name: trimmed })
    if (error) console.error(error)
    else {
      setNewLocation('')
      refetchData()
    }
  }

  const handleAddRoute = async (event) => {
    event.preventDefault()
    if (!routeFrom || !routeTo || !routePrice) return
    const fromLoc = await supabase.from('locations').select('id').eq('name', routeFrom).single()
    const toLoc = await supabase.from('locations').select('id').eq('name', routeTo).single()
    if (!fromLoc.data || !toLoc.data) {
      alert('Locations not found')
      return
    }
    const { data: existing } = await supabase.from('routes').select('id').eq('from_location_id', fromLoc.data.id).eq('to_location_id', toLoc.data.id).single()
    if (existing) {
      alert('Route already exists')
      return
    }
    const { error } = await supabase.from('routes').insert({
      from_location_id: fromLoc.data.id,
      to_location_id: toLoc.data.id,
      price: parseFloat(routePrice)
    })
    if (error) console.error(error)
    else {
      setRouteFrom('')
      setRouteTo('')
      setRoutePrice('')
      refetchData()
    }
  }

  const handleAddSeat = async (event) => {
    event.preventDefault()
    const trimmed = seatLabel.trim()
    if (!trimmed) return
    const { data: existing } = await supabase.from('buses').select('id').eq('type', trimmed).single()
    if (existing) {
      alert('Bus type already exists')
      return
    }
    const { error } = await supabase.from('buses').insert({ type: trimmed, total_seats: 50 }) // default seats
    if (error) console.error(error)
    else {
      setSeatLabel('')
      refetchData()
    }
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
        <button type="submit" className="primary-button admin__submit" onClick={async () => {//locations
          console.log('hello')

        }}>
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
        <button type="submit" className="primary-button admin__submit">
          Save fleet
        </button>
      </form>

      <div className="admin-card">
        <h3>Locations</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Name</th>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {editingLocation === loc ? (
                    <input
                      value={editingLocation}
                      onChange={(e) => setEditingLocation(e.target.value)}
                      onBlur={() => updateLocation(loc, editingLocation)}
                      onKeyDown={(e) => e.key === 'Enter' && updateLocation(loc, editingLocation)}
                    />
                  ) : (
                    loc
                  )}
                </td>
                <td style={{ border: '2px solid #bbb', padding: '8px' }}>
                  <button 
                    onClick={() => setEditingLocation(loc)} 
                    style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this location?')) {
                        deleteLocation(loc)
                      }
                    }} 
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Routes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>From</th>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>To</th>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Price</th>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {editingRoute?.id === r.id ? (
                    <select value={editingRoute.from} onChange={(e) => setEditingRoute({ ...editingRoute, from: e.target.value })}>
                      {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  ) : r.from}
                </td>
                <td style={{ border: '2px solid #bbb', padding: '8px' }}>
                  {editingRoute?.id === r.id ? (
                    <select value={editingRoute.to} onChange={(e) => setEditingRoute({ ...editingRoute, to: e.target.value })}>
                      {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  ) : r.to}
                </td>
                <td style={{ border: '2px solid #bbb', padding: '8px' }}>
                  {editingRoute?.id === r.id ? (
                    <input
                      value={editingRoute.price}
                      onChange={(e) => setEditingRoute({ ...editingRoute, price: e.target.value })}
                      onBlur={() => updateRoute(r.id, editingRoute.from, editingRoute.to, editingRoute.price)}
                      onKeyDown={(e) => e.key === 'Enter' && updateRoute(r.id, editingRoute.from, editingRoute.to, editingRoute.price)}
                    />
                  ) : `${r.price} cedis`}
                </td>
                <td style={{ border: '2px solid #bbb', padding: '8px' }}>
                  <button 
                    onClick={() => setEditingRoute(r)} 
                    style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this route?')) {
                        deleteRoute(r.id)
                      }
                    }} 
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Buses</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Type</th>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Seats</th>
              <th style={{ border: '2px solid #bbb', padding: '8px', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map((b) => (
              <tr key={b.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {editingBus?.id === b.id ? (
                    <input
                      value={editingBus.type}
                      onChange={(e) => setEditingBus({ ...editingBus, type: e.target.value })}
                      onBlur={() => updateBus(b.id, editingBus.type, editingBus.seats)}
                      onKeyDown={(e) => e.key === 'Enter' && updateBus(b.id, editingBus.type, editingBus.seats)}
                    />
                  ) : b.type}
                </td>
                <td style={{ border: '2px solid #bbb', padding: '8px' }}>
                  {editingBus?.id === b.id ? (
                    <input
                      value={editingBus.seats}
                      onChange={(e) => setEditingBus({ ...editingBus, seats: e.target.value })}
                      onBlur={() => updateBus(b.id, editingBus.type, editingBus.seats)}
                      onKeyDown={(e) => e.key === 'Enter' && updateBus(b.id, editingBus.type, editingBus.seats)}
                    />
                  ) : b.seats}
                </td>
                <td style={{ border: '2px solid #bbb', padding: '8px' }}>
                  <button 
                    onClick={() => setEditingBus(b)} 
                    style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this bus type?')) {
                        deleteBus(b.id)
                      }
                    }} 
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel

