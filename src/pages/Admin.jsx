import AdminPanel from '../components/AdminPanel'
import '../App.css'

function AdminPage({
  locations,
  routes,
  fleet,
  paymentInfo,
  adminError,
  isAdmin,
  onAdminLogin,
  onAddLocation,
  onAddRoute,
  onAddSeat,
  onUpdatePayment,
}) {
  return (
    <main className="page">
      <section className="admin" id="admin">
        <div className="admin__header">
          <p className="eyebrow">Admin</p>
          <h2>Control variables</h2>
          <p className="lede">
            Update locations, route prices, fleet info, and payment details.
          </p>
        </div>
        <AdminPanel
          locations={locations}
          routes={routes}
          fleet={fleet}
          paymentInfo={paymentInfo}
          onAdminLogin={onAdminLogin}
          adminError={adminError}
          isAdmin={isAdmin}
          onAddLocation={onAddLocation}
          onAddRoute={onAddRoute}
          onAddSeat={onAddSeat}
          onUpdatePayment={onUpdatePayment}
        />
      </section>
    </main>
  )
}

export default AdminPage

