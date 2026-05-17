import { useState } from 'react'
import { askFAQ } from '../api/stylist'

const COMMON_QUESTIONS = [
  'Is it damaging?',
  'Will it look natural?',
  'How long does it last?',
  'Can I wash my hair?',
  'Is it painful?'
]

export default function FAQSection() {

  const [answer, setAnswer] = useState(null)

  const [loading, setLoading] = useState(false)

  const [active, setActive] = useState(null)

  async function handleQuestion(question) {

    setLoading(true)
    setActive(question)

    try {

      const res = await askFAQ(question)

      setAnswer(res.response)

    } catch (e) {

      console.error(
        e.response?.data ||
        e.message ||
        e
      )

      setAnswer(
        'Feel free to contact our stylists directly.'
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className="card faq-card">

      <p className="section-label">
        Common Questions
      </p>

      <div className="faq-buttons">

        {COMMON_QUESTIONS.map(q => (

          <button
            key={q}
            onClick={() => handleQuestion(q)}
            className={
              active === q
                ? 'faq-btn-active'
                : 'faq-btn'
            }
          >
            {q}
          </button>

        ))}

      </div>

      {loading && (
        <p className="thinking-text">
          Thinking...
        </p>
      )}

      {answer && !loading && (

        <div className="faq-answer">

          <p>
            {answer}
          </p>

        </div>

      )}

    </div>
  )
}