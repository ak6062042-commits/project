export default function StatusMessage({
  type,
  message
}) {

  return (
    <div className={`status-${type}`}>
      {message}
    </div>
  )
}