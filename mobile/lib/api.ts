import { useAuth } from '@clerk/clerk-expo'
import axios from 'axios'
import { useEffect } from 'react'

// localhost will work in simulator
// const API_URL = 'http://localhost:3000/api'
const API_URL = 'https://table-tales-three.vercel.app/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
let isInterceptorSet = false
let interceptorId: number | null = null
export const useApi = () => {
  const { getToken } = useAuth()

  useEffect(() => {
    if (isInterceptorSet) return

    isInterceptorSet = true
    interceptorId = api.interceptors.request.use(async config => {
      const token = await getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    return () => {
      if (interceptorId !== null) {
        api.interceptors.request.eject(interceptorId)
        interceptorId = null
      }
      isInterceptorSet = false
    }
  }, [getToken])

  return api
}

// on every single req, we would like have an auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers
