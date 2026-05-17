import { addToCart, submitBooking } from '../api/stylist'
import { useState } from 'react'

export default function ResultCard({ recommendation, stylistResponse, formData }) {
  const [status, setStatus] = useState(null)
  const r = recommendation

  async function handleCart() {
    await addToCart({
      method: r.method,
      desired_length_cm: r.desired_length,
      grams: r.grams,
      packs: r.packs,
      addon_ids: r.addons.map(a => a.id)
    })
    setStatus('cart')
  }

  async function handleBooking() {
    await submitBooking({
      name: 'Guest',
      email: 'guest@example.com',
      notes: `${r.method} ${r.desired_length}cm`
    })
    setStatus('booked')
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--gold-dim)',
      borderRadius: '12px',
      padding: '32px',
    }}>
      <p style={{
        color: 'var(--gold)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '16px'
      }}>
        Your Recommendation
      </p>

      <p style={{
        color: 'var(--text)',
        fontSize: '1rem',
        lineHeight: '1.7',
        marginBottom: '28px',
        fontStyle: 'italic'
      }}>
        "{stylistResponse}"
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {[
          { label: 'Method', value: r.method.charAt(0).toUpperCase() + r.method.slice(1) },
          { label: 'Length', value: `${r.desired_length} cm` },
          { label: 'Amount', value: `${r.grams}g` },
          { label: 'Packs', value: `${r.packs} packs` },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {item.label}
            </p>
            <p style={{ color: 'var(--text)', fontSize: '1rem', fontWeight: 500 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {r.addons?.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Recommended Add-ons
          </p>
          {r.addons.map(a => (
            <div key={a.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: 'var(--text)' }}>{a.name}</span>
              <span style={{ color: 'var(--gold)' }}>{a.price_nok} NOK</span>
            </div>
          ))}
        </div>
      )}

      {r.total_price_nok && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Estimated total: <span style={{ color: 'var(--gold)' }}>{r.total_price_nok} NOK</span>
        </p>
      )}

      {status === 'cart' && (
        <p style={{ color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '16px' }}>
          ✓ Added to cart
        </p>
      )}
      {status === 'booked' && (
        <p style={{ color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '16px' }}>
          ✓ Booking request sent
        </p>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {r.salon_booking ? (
          <button onClick={handleBooking} style={{
            flex: 1,
            background: 'var(--gold)',
            color: 'var(--black)',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.9rem',
            letterSpacing: '0.05em'
          }}>
            Book Salon
          </button>
        ) : (
          <button onClick={handleCart} style={{
            flex: 1,
            background: 'var(--gold)',
            color: 'var(--black)',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.9rem',
            letterSpacing: '0.05em'
          }}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}