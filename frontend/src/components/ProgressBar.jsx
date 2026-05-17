export default function ProgressBar({
  step,
  total
}) {

  return (
    <div className="progress-wrapper">

      {[...Array(total)].map((_, i) => (

        <div
          key={i}
          className={
            i <= step
              ? 'progress-active'
              : 'progress-inactive'
          }
        />

      ))}

    </div>
  )
}