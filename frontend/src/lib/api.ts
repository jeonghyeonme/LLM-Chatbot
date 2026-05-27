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

// ──────────────────────────────────────────────────────────────────────────────
// Configuration Constants (Same as Backend)
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

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')

// ──────────────────────────────────────────────────────────────────────────────
// API Functions (Via Backend for CORS & Security)
// ──────────────────────────────────────────────────────────────────────────────

export async function fetchSchedules(params?: {
  start?: string
  end?: string
  limit?: number
}): Promise<Schedule[]> {
  const url = new URL(`${API_BASE_URL}/api/data/schedules`)
  if (params?.start) url.searchParams.append('start', params.start)
  if (params?.end) url.searchParams.append('end', params.end)
  if (params?.limit) url.searchParams.append('limit', params.limit.toString())

  const response = await fetch(url.toString())
  if (!response.ok) {
    console.error('Failed to fetch schedules')
    throw new Error('Failed to fetch schedules')
  }

  const data = await response.json()

  return (data || [])
    .filter((r: any) => !EXCLUDE_KEYWORDS.some((kw) => r.title?.includes(kw)))
    .map((r: any) => ({
      id: r.id,
      title: r.title,
      start_date: r.start_date,
      end_date: r.end_date,
      type: r.title?.includes(EXAM_KEYWORD) ? 'exam' : 'info',
    }))
}

export async function fetchMeals(params?: {
  date?: string
  meal_type?: string
  limit?: number
}): Promise<Meal[]> {
  const url = new URL(`${API_BASE_URL}/api/data/meals`)
  if (params?.date) url.searchParams.append('date', params.date)
  if (params?.meal_type) url.searchParams.append('meal_type', params.meal_type)
  if (params?.limit) url.searchParams.append('limit', params.limit.toString())

  const response = await fetch(url.toString())
  if (!response.ok) {
    console.error('Failed to fetch meals')
    throw new Error('Failed to fetch meals')
  }

  const data = await response.json()

  return (data || []).map((r: any) => ({
    id: r.id,
    date: r.date,
    meal_type: r.meal_type,
    menu_category: r.menu_category,
    restaurant_type: r.restaurant_type,
    menu_items: splitMenu(r.menu_content),
    price: resolvePrice(r.meal_type, r.menu_category),
  }))
}

// ──────────────────────────────────────────────────────────────────────────────
// Chat API Functions
// ──────────────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'bot' | 'assistant'
  content: string
}

export async function sendMessage(
  messages: ChatMessage[],
  onUpdate?: (content: string) => void
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
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
