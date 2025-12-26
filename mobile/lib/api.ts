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
export const useApi = () => {
  const { getToken } = useAuth()

  useEffect(() => {
    if (isInterceptorSet) return

    isInterceptorSet = true
    const interceptor = api.interceptors.request.use(async config => {
      const token = await getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    // cleanup: remove interceptor when component unmounts

    return () => {
      api.interceptors.request.eject(interceptor)
      isInterceptorSet = false
    }
  }, [getToken])

  return api
}

// on every single req, we would like have an auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers
