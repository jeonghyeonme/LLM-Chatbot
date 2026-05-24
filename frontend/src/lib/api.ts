const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

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

interface ListResponse<T> {
  items: T[]
  count: number
}

async function getJSON<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(path, BASE_URL)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} — ${path}`)
  }
  return (await res.json()) as T
}

export async function fetchSchedules(params?: {
  start?: string
  end?: string
  limit?: number
}): Promise<Schedule[]> {
  const data = await getJSON<ListResponse<Schedule>>('/api/calendar/schedules', {
    start: params?.start,
    end: params?.end,
    limit: params?.limit?.toString(),
  })
  return data.items
}

export async function fetchMeals(params?: {
  date?: string
  meal_type?: string
  limit?: number
}): Promise<Meal[]> {
  const data = await getJSON<ListResponse<Meal>>('/api/mealPlan/meals', {
    date: params?.date,
    meal_type: params?.meal_type,
    limit: params?.limit?.toString(),
  })
  return data.items
}
