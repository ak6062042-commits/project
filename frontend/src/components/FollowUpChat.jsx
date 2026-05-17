import { useState } from 'react'

import { askFollowUp } from '../api/stylist'

import { getSessionId } from '../utils/session'

export default function FollowUpChat({
  formData
}) {

  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState([])

  async function handleSend() {

    if (!message.trim()) return

    const userMessage = message

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userMessage
      }
    ])

    setMessage('')

    setLoading(true)

    try {

      const res = await askFollowUp({
        ...formData,
        user_message: userMessage,
        session_id: getSessionId()
      })

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.stylist_response
        }
      ])

    } catch (e) {

      console.error(
        e.response?.data ||
        e.message ||
        e
      )

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry — something went wrong.'
        }
      ])

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className="card followup-card">

      <p className="section-label">
        Ask Your Stylist
      </p>

      <div className="chat-messages">

        {messages.map((m, i) => (

          <div
            key={i}
            className={
              m.role === 'user'
                ? 'user-bubble'
                : 'assistant-bubble'
            }
          >
            {m.content}
          </div>

        ))}

      </div>

      <div className="chat-input-row">

        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="chat-input"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="gold-btn"
        >
          {loading ? '...' : 'Send'}
        </button>

      </div>

    </div>
  )
}