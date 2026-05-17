import { useState } from 'react'
import { getChatResponse, getRecommendation } from './api/stylist'
import StepCard from './components/StepCard'
import ResultCard from './components/ResultCard'
import LoadingScreen from './components/LoadingScreen'

const STEPS = [
  {
    key: 'goal',
    question: 'What is your main goal?',
    options: [
      { label: 'More Volume', value: 'volume' },
      { label: 'More Length', value: 'length' },
      { label: 'Both', value: 'both' },
    ]
  },
  {
    key: 'hair_type',
    question: 'What is your hair type?',
    options: [
      { label: 'Thin', value: 'thin' },
      { label: 'Medium', value: 'medium' },
      { label: 'Thick', value: 'thick' },
    ]
  },
  {
    key: 'current_length',
    question: 'How long is your hair now?',
    options: [
      { label: 'Short (above shoulders)', value: 'short' },
      { label: 'Medium (shoulder length)', value: 'medium' },
      { label: 'Long (below shoulders)', value: 'long' },
    ]
  },
  {
    key: 'desired_length_cm',
    question: 'What length do you want?',
    options: [
      { label: '40 cm', value: 40 },
      { label: '50 cm', value: 50 },
      { label: '60 cm', value: 60 },
    ]
  },
  {
    key: 'location',
    question: 'Where are you located?',
    options: [
      { label: 'Oslo', value: 'Oslo' },
      { label: 'Lillestrøm', value: 'Lillestrøm' },
      { label: 'Other location', value: 'Bergen' },
    ]
  },
]

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

async function handleSelect(value) {
  const currentKey = STEPS[step].key
  const updatedAnswers = { ...answers, [currentKey]: value }
  setAnswers(updatedAnswers)

  if (step < STEPS.length - 1) {
    setStep(step + 1)
  } else {
    setLoading(true)
    setError(null)
    try {
      const response = await getChatResponse({
        ...updatedAnswers,
        user_message: 'What do you recommend for me?'
      })
      setResult(response)
    } catch (e) {
      // Gemini rate limit hit — try /recommend only as last fallback
      try {
        const fallback = await getRecommendation(updatedAnswers)
        setResult({
          recommendation: fallback,
          stylist_response:
            `${fallback.method.charAt(0).toUpperCase() + fallback.method.slice(1)} extensions are the right choice for your hair. ` +
            `You need ${fallback.grams}g — that's ${fallback.packs} packs at ${fallback.desired_length}cm. ` +
            (fallback.salon_booking
              ? 'Since you are near Oslo, I recommend booking a salon appointment.'
              : 'These are easy to apply at home.')
        })
      } catch {
        setError('Something went wrong. Please wait a moment and try again.')
      }
    } finally {
      setLoading(false)
    }
  }
}

  function handleRestart() {
    setStep(0)
    setAnswers({})
    setResult(null)
    setError(null)
  }

  return (
    <div>
      <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        <h1>EXTENSIONS</h1>
        <p style={{ marginTop: '8px', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
          Guided stylist consultation
        </p>
      </div>

      {!loading && !result && (
        <>
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '32px'
          }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                flex: 1,
                height: '2px',
                background: i <= step ? 'var(--gold)' : 'var(--border)',
                borderRadius: '2px',
                transition: 'background 0.3s ease'
              }} />
            ))}
          </div>

          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
            marginBottom: '20px'
          }}>
            Step {step + 1} of {STEPS.length}
          </p>

          <StepCard
            question={STEPS[step].question}
            options={STEPS[step].options}
            onSelect={handleSelect}
          />
        </>
      )}

      {loading && <LoadingScreen />}

      {error && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid #8b2020',
          borderRadius: '12px',
          padding: '24px',
          color: '#e07070',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {result && (
        <>
          <ResultCard
            recommendation={result.recommendation}
            stylistResponse={result.stylist_response}
            formData={answers}
          />
          <button
            onClick={handleRestart}
            style={{
              marginTop: '16px',
              width: '100%',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              letterSpacing: '0.05em'
            }}
          >
            Start Over
          </button>
        </>
      )}
    </div>
  )
}