export default function StepCard({
  question,
  options,
  onSelect
}) {

  return (
    <div className="card">

      <h2>
        {question}
      </h2>

      <div className="step-options">

        {options.map(opt => (

          <button
            key={opt.value}
            className="step-option-btn"
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </button>

        ))}

      </div>

    </div>
  )
}