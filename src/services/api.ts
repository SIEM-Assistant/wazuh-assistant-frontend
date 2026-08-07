import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 60000,
})

export interface GenerateQueryRequest {
  prompt: string
}

export interface GenerateQueryResponse {
  query?: string
  generated_query?: string
  message?: string
  summary?: string
  error?: string
}

export interface ExecuteQueryRequest {
  query: string
}

export interface ExecuteQueryResponse {
  result?: unknown
  output?: unknown
  data?: unknown
  message?: string
  error?: string
}

export interface SummaryRequest {
  content: string
}

export interface SummaryResponse {
  summary?: string
  message?: string
  error?: string
}

export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

export const generateQuery = async (payload: GenerateQueryRequest) => {
  const response = await api.post('/generate-query', payload)
  return response.data as GenerateQueryResponse
}

export const executeQuery = async (payload: ExecuteQueryRequest) => {
  const response = await api.post('/execute-query', payload)
  return response.data as ExecuteQueryResponse
}

export const summarizeLogs = async (payload: SummaryRequest) => {
  const response = await api.post('/summarize', payload)
  return response.data as SummaryResponse
}
