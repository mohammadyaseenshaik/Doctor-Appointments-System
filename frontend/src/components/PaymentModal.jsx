import React, { useState } from 'react'
import { simulatePayment } from '../api/paymentApi'
import toast from 'react-hot-toast'
import { FaCreditCard, FaLock, FaTimes, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

/**
 * PaymentModal - Simulates a payment gateway UI.
 * Shows a card form, processes payment (80% success rate from backend),
 * and displays success/failure result.
 *
 * @param {Object} appointment - the appointment to pay for
 * @param {number} fee - consultation fee to charge
 * @param {Function} onClose - close the modal
 * @param {Function} onSuccess - called when payment succeeds
 */
const PaymentModal = ({ appointment, fee, onClose, onSuccess }) => {
  const [card, setCard] = useState({ number: '', holder: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // null | { success, message, transactionId }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'number') value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    if (name === 'expiry') value = value.replace(/\D/g, '').slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2')
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3)
    setCard(prev => ({ ...prev, [name]: value }))
  }

  const handlePay = async () => {
    if (!card.number || !card.holder || !card.expiry || !card.cvv) {
      toast.error('Please fill all card details')
      return
    }
    setLoading(true)
    try {
      const res = await simulatePayment({
        appointmentId: appointment.id,
        cardNumber: card.number.replace(/\s/g, ''),
        cardHolder: card.holder,
        expiry: card.expiry,
        cvv: card.cvv,
      })
      const data = res.data.data
      setResult(data)
      if (data.success) {
        toast.success('Payment successful! 🎉')
        onSuccess()
      } else {
        toast.error('Payment failed. Please try again.')
      }
    } catch (err) {
      toast.error('Payment processing error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '440px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', marginBottom: '0.25rem' }}>
              💳 Secure Payment
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              <FaLock style={{ marginRight: '4px', color: '#10b981' }} />
              256-bit SSL encrypted
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>
            <FaTimes />
          </button>
        </div>

        {/* Payment result screen */}
        {result ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            {result.success ? (
              <>
                <FaCheckCircle style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }} />
                <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Payment Successful!</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Transaction ID: {result.transactionId}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Amount: ₹{result.amount}</p>
                <button className="btn-primary-custom" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }} onClick={onClose}>
                  Done ✓
                </button>
              </>
            ) : (
              <>
                <FaTimesCircle style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' }} />
                <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Payment Failed</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{result.message}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button className="btn-secondary-custom" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setResult(null)}>
                    Try Again
                  </button>
                  <button className="btn-danger-custom" style={{ flex: 1 }} onClick={onClose}>Close</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Amount summary */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.1) 100%)',
              border: '1px solid rgba(79,70,229,0.2)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Consultation Fee</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', fontFamily: 'Outfit, sans-serif' }}>₹{fee}</p>
            </div>

            {/* Dummy card notice */}
            <div className="alert-custom alert-info" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
              🧪 Demo mode — use any card details. 80% success rate simulation.
            </div>

            {/* Card form */}
            <div className="form-group">
              <label className="form-label-custom">Card Number</label>
              <div style={{ position: 'relative' }}>
                <FaCreditCard style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
                <input
                  className="form-control-custom"
                  style={{ paddingLeft: '2.5rem' }}
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label-custom">Cardholder Name</label>
              <input
                className="form-control-custom"
                name="holder"
                placeholder="John Doe"
                value={card.holder}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label-custom">Expiry Date</label>
                <input
                  className="form-control-custom"
                  name="expiry"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label-custom">CVV</label>
                <input
                  className="form-control-custom"
                  name="cvv"
                  placeholder="***"
                  type="password"
                  value={card.cvv}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="btn-primary-custom"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? (
                <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
              ) : (
                `🔒 Pay ₹${fee}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentModal
