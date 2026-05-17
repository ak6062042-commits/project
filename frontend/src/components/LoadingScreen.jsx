import { useEffect, useState } from 'react'

const MESSAGES = [
  'Analysing your hair profile...',
  'Calculating the right amount...',
  'Finding your perfect method...',
  'Matching you with the perfect style...',
  'Preparing your recommendation...',
]

export default function LoadingScreen() {

  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {

    const interval = setInterval(() => {

      setMsgIndex(prev =>
        (prev + 1) % MESSAGES.length
      )

    }, 1200)

    return () => clearInterval(interval)

  }, [])

  return (
    <div className="card loading-card">

      <div className="spinner" />

      <p className="loading-text">
        {MESSAGES[msgIndex]}
      </p>

    </div>
  )
}