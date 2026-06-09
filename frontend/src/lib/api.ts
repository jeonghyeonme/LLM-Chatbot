import { supabase } from './supabase'

export interface Schedule {
  id: string
  title: string
  start_date: string
  end_date: string
  type: 'exam' | 'info'
}

export interface Meal {
  id: string
  date: string
  meal_type: string
  menu_category: string | null
  restaurant_type: string | null
  menu_items: string[]
  price: string
}

export interface Facility {
  id: string
  name: string
  latitude: number
  longitude: number
}

// ──────────────────────────────────────────────────────────────────────────────
// Configuration Constants
// ──────────────────────────────────────────────────────────────────────────────
const EXCLUDE_KEYWORDS = ['수업일수', '학기개시']
const EXAM_KEYWORD = '평가'

const PRICE_MAP: Record<string, string> = {
  '조식|일반': '1,000원',
  '중식|일반': '5,500원',
  '중식|특식': '6,500원',
  '중식|간편식': '1,000~5,000원',
}
const DEFAULT_PRICE = '가격 미정'

// ──────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────────────────────────────────────
function resolvePrice(mealType: string, menuCategory: string | null): string {
  const key = `${mealType}|${menuCategory || ''}`
  return PRICE_MAP[key] || DEFAULT_PRICE
}

function splitMenu(menuContent: string | null): string[] {
  if (!menuContent) return []
  return menuContent.split('\n').map((line) => line.trim()).filter(Boolean)
}

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// ──────────────────────────────────────────────────────────────────────────────
// API Functions (Directly via Supabase where possible)
// ──────────────────────────────────────────────────────────────────────────────

export async function fetchSchedules(params?: {
  start?: string
  end?: string
  limit?: number
}): Promise<Schedule[]> {
  try {
    let query = supabase.from('schedules').select('*')
    
    if (params?.start) query = query.gte('start_date', params.start)
    if (params?.end) query = query.lte('start_date', params.end)
    if (params?.limit) query = query.limit(params.limit)

    const { data, error } = await query.order('start_date', { ascending: true })
    
    if (error) throw error

    return (data || [])
      .filter((r: any) => !EXCLUDE_KEYWORDS.some((kw) => r.title?.includes(kw)))
      .map((r: any) => ({
        id: r.id,
        title: r.title,
        start_date: r.start_date,
        end_date: r.end_date,
        type: r.title?.includes(EXAM_KEYWORD) ? 'exam' : 'info',
      }))
  } catch (err) {
    console.error('Failed to fetch schedules:', err)
    throw err
  }
}

export async function fetchMeals(params?: {
  date?: string
  meal_type?: string
  limit?: number
}): Promise<Meal[]> {
  try {
    let query = supabase.from('meals').select('*')
    
    if (params?.date) query = query.eq('date', params.date)
    if (params?.meal_type) query = query.eq('meal_type', params.meal_type)
    if (params?.limit) query = query.limit(params.limit)

    const { data, error } = await query.order('date')
    
    if (error) throw error

    return (data || []).map((r: any) => ({
      id: r.id,
      date: r.date,
      meal_type: r.meal_type,
      menu_category: r.menu_category,
      restaurant_type: r.restaurant_type,
      menu_items: splitMenu(r.menu_content),
      price: resolvePrice(r.meal_type, r.menu_category),
    }))
  } catch (err) {
    console.error('Failed to fetch meals:', err)
    throw err
  }
}

export async function fetchFacilities(params?: {
  name?: string
  limit?: number
}): Promise<Facility[]> {
  try {
    let query = supabase.from('facilities').select('*')
    
    if (params?.name) query = query.ilike('name', `%${params.name}%`)
    if (params?.limit) query = query.limit(params.limit)

    const { data, error } = await query.order('name')
    
    if (error) throw error

    return (data || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
    }))
  } catch (err) {
    console.error('Failed to fetch facilities:', err)
    throw err
  }
}

export async function fetchDirections(params: {
  start: string
  goal: string
  option?: string
}): Promise<any> {
  const url = new URL(`${API_BASE_URL}/api/data/directions`, window.location.origin)
  url.searchParams.append('start', params.start)
  url.searchParams.append('goal', params.goal)
  if (params.option) url.searchParams.append('option', params.option)

  const response = await fetch(url.toString())
  if (!response.ok) {
    console.error('Failed to fetch directions')
    throw new Error('Failed to fetch directions')
  }

  return response.json()
}

// ──────────────────────────────────────────────────────────────────────────────
// Chat API Functions
// ──────────────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'bot' | 'assistant'
  content: string
}

// 브라우저 로컬 스토리지에서 세션 ID를 가져오거나 없으면 새로 생성 (2시간 만료)
export function getOrCreateSessionId(): string {
  const SESSION_KEY = 'induck_session_id'
  const TIMESTAMP_KEY = 'induck_session_timestamp'
  const EXPIRATION_MS = 2 * 60 * 60 * 1000 // 2시간

  let sessionId = localStorage.getItem(SESSION_KEY)
  const timestampStr = localStorage.getItem(TIMESTAMP_KEY)
  const now = Date.now()

  // 세션이 없거나 만료된 경우 새로 생성
  if (!sessionId || !timestampStr || (now - parseInt(timestampStr, 10) > EXPIRATION_MS)) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, sessionId)
    localStorage.setItem(TIMESTAMP_KEY, now.toString())
  } else {
    // 세션이 유효하면 만료 시간 갱신 (선택적: 마지막 활동 기준 연장)
    localStorage.setItem(TIMESTAMP_KEY, now.toString())
  }

  return sessionId
}

// 이전 대화 기록 불러오기 (Supabase 직접 조회)
export async function fetchChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return (data || []).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'bot' : msg.role,
      content: msg.content
    }))
  } catch (err) {
    console.error('Failed to fetch chat history:', err)
    return []
  }
}

export async function sendMessage(
  messages: ChatMessage[],
  onUpdate?: (content: string) => void
): Promise<string> {
  const sessionId = getOrCreateSessionId()
  
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, session_id: sessionId }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || 'Failed to send message')
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Failed to get response reader')

  let fullContent = ''
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') break
        
        try {
          const parsed = JSON.parse(data)
          if (parsed.content) {
            fullContent += parsed.content
            if (onUpdate) onUpdate(fullContent)
          }
        } catch (e) {
          console.error('Failed to parse stream chunk:', e)
        }
      }
    }
  }

  return fullContent
}

