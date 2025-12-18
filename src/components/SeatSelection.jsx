import { useState } from 'react'
import './SeatSelection.css'

// const defaultSeats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2']

const availBuses = ['50 Seater', '25 Seater', '45 seater']

function SeatSelection({ onSubmit, onBack, seats = availBuses }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (seatId) => {
    setSelected(seatId)
  }

  const handleContinue = (event) => {
    event.preventDefault()
    if (!selected) return
    onSubmit(selected)
  }

  return (
    <form className="seat" onSubmit={handleContinue}>
      <div className="seat__grid">
        {seats.map((seatId) => (
          <button
            type="button"
            key={seatId}
            className={
              selected === seatId ? 'seat__item seat__item--active' : 'seat__item'
            }
            onClick={() => handleSelect(seatId)}
          >
            {seatId}
          </button>
        ))}
      </div>
      <div className="seat__actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="primary-button seat__continue"
          disabled={!selected}
        >
          Continue to payment
        </button>
      </div>
    </form>
  )
}

export default SeatSelection

