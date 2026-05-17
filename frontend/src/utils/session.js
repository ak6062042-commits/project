export function getSessionId() {
  let id = localStorage.getItem('stylist_session')

  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('stylist_session', id)
  }

  return id
}