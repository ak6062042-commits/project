import { useState } from 'react'

import {
  addToCart,
  submitBooking
} from '../api/stylist'

import FollowUpChat from './FollowUpChat'
import PriceCard from './PriceCard'
import StatusMessage from './StatusMessage'

export default function ResultCard({
  recommendation,
  stylistResponse,
  formData
}) {

  const [status, setStatus] = useState(null)

  const r = recommendation

  async function handleCart() {

    try {

      await addToCart({
        method: r.method,
        desired_length_cm: r.desired_length,
        grams: r.grams,
        packs: r.packs,
        addon_ids: r.addons.map(a => a.id)
      })

      setStatus('cart')

    } catch (e) {

      console.error(e)
    }
  }

  async function handleBooking() {

    try {

      await submitBooking({
        name: 'Guest',
        email: 'guest@example.com',
        notes:
          `${r.method} ${r.desired_length}cm`
      })

      setStatus('booked')

    } catch (e) {

      console.error(e)
    }
  }

  return (
    <div className="card">

      <p className="section-label">
        Your Recommendation
      </p>

      <p className="stylist-response">
        "{stylistResponse}"
      </p>

      <div className="recommendation-badge">

        {r.salon_booking
          ? 'Salon Professional Recommended'
          : 'DIY Friendly Application'}

      </div>

      <div className="result-grid">

        {[
          {
            label: 'Method',
            value:
              r.method.charAt(0).toUpperCase()
              + r.method.slice(1)
          },

          {
            label: 'Length',
            value:
              `${r.desired_length} cm`
          },

          {
            label: 'Amount',
            value:
              `${r.grams}g`
          },

          {
            label: 'Packs',
            value:
              `${r.packs} packs`
          },

        ].map(item => (

          <div
            key={item.label}
            className="result-item"
          >

            <p className="result-label">
              {item.label}
            </p>

            <p className="result-value">
              {item.value}
            </p>

          </div>

        ))}

      </div>

      {r.addons?.length > 0 && (

        <div className="addons-wrapper">

          <p className="addons-title">
            Recommended Add-ons
          </p>

          {r.addons.map(a => (

            <div
              key={a.id}
              className="addon-row"
            >

              <span>
                {a.name}
              </span>

              <span className="gold-text">
                {a.price_nok} NOK
              </span>

            </div>

          ))}

        </div>

      )}

      {r.total_price_nok && (
        <PriceCard
          total={r.total_price_nok}
        />
      )}

      {status === 'cart' && (
        <StatusMessage
          type="success"
          message="✓ Added to cart"
        />
      )}

      {status === 'booked' && (
        <StatusMessage
          type="success"
          message="✓ Booking request sent"
        />
      )}

      <div className="action-buttons">

        {r.salon_booking ? (

          <button
            onClick={handleBooking}
            className="gold-btn"
          >
            Book Salon
          </button>

        ) : (

          <button
            onClick={handleCart}
            className="gold-btn"
          >
            Add to Cart
          </button>

        )}

      </div>

      <FollowUpChat
        formData={formData}
      />

    </div>
  )
}