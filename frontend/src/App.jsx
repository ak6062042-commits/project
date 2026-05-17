import { useState } from 'react'

import {
  getChatResponse,
  getRecommendation
} from './api/stylist'

import { getSessionId } from './utils/session'

import StepCard from './components/StepCard'
import ResultCard from './components/ResultCard'
import LoadingScreen from './components/LoadingScreen'
import FAQSection from './components/FAQSection'
import ProgressBar from './components/ProgressBar'

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
      {
        label: 'Short (above shoulders)',
        value: 'short'
      },

      {
        label: 'Medium (shoulder length)',
        value: 'medium'
      },

      {
        label: 'Long (below shoulders)',
        value: 'long'
      },
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

    const updatedAnswers = {
      ...answers,
      [currentKey]: value
    }

    setAnswers(updatedAnswers)

    if (step < STEPS.length - 1) {

      setStep(prev => prev + 1)

      return
    }

    setLoading(true)

    setError(null)

    try {

      const response = await getChatResponse({
        ...updatedAnswers,
        user_message:
          'What do you recommend for me?',
        session_id: getSessionId()
      })

      setResult(response)

    } catch (e) {

      console.error(
        e.response?.data ||
        e.message ||
        e
      )

      try {

        const fallback =
          await getRecommendation(updatedAnswers)

        setResult({
          recommendation: fallback,

          stylist_response:
            `${fallback.method
              .charAt(0)
              .toUpperCase()
            + fallback.method.slice(1)} `
            +
            `extensions are the best choice for your hair. `
            +
            `You'll need ${fallback.grams}g `
            +
            `(${fallback.packs} packs).`
        })

      } catch (fallbackError) {

        console.error(
          fallbackError.response?.data ||
          fallbackError.message ||
          fallbackError
        )

        setError(
          'Something went wrong. Please try again.'
        )
      }

    } finally {

      setLoading(false)
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

      <div className="hero-section">

        <h1>
          EXTENSIONS
        </h1>

        <p className="hero-subtitle">
          Guided stylist consultation
        </p>

      </div>

      {!loading && !result && (

        <>

          <ProgressBar
            step={step}
            total={STEPS.length}
          />

          <p className="step-indicator">
            Step {step + 1}
            {' '}
            of
            {' '}
            {STEPS.length}
          </p>

          <StepCard
            question={STEPS[step].question}
            options={STEPS[step].options}
            onSelect={handleSelect}
          />

        </>

      )}

      {loading && (
        <LoadingScreen />
      )}

      {error && (

        <div className="error-card">
          {error}
        </div>

      )}

      {result && (

        <>

          <ResultCard
            recommendation={result.recommendation}
            stylistResponse={
              result.stylist_response
            }
            formData={answers}
          />

          <FAQSection />

          <button
            onClick={handleRestart}
            className="restart-btn"
          >
            Start Over
          </button>

        </>

      )}

    </div>
  )
}