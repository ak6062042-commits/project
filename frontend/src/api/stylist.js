import axios from 'axios'

const BASE = 'http://localhost:8000'

export async function getRecommendation(data) {
  const res = await axios.post(
    `${BASE}/recommend`,
    data
  )

  return res.data
}

export async function getChatResponse(data) {
  const res = await axios.post(
    `${BASE}/chat`,
    data
  )

  return res.data
}

export async function askFollowUp(data) {
  const res = await axios.post(
    `${BASE}/chat`,
    data
  )

  return res.data
}

export async function addToCart(item) {
  const res = await axios.post(
    `${BASE}/cart/add`,
    item
  )

  return res.data
}

export async function submitBooking(data) {
  const res = await axios.post(
    `${BASE}/booking`,
    data
  )

  return res.data
}

export async function askFAQ(question) {
  const res = await axios.post(
    `${BASE}/faq`,
    { question }
  )

  return res.data
}