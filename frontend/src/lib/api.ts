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

// ──────────────────────────────────────────────────────────────────────────────
// Configuration Constants (Same as Backend)
// ──────────────────────────────────────────────────────────────────────────────
const EXCLUDE_KEYWORDS = ['수업일수', '학기개시']
const EXAM_KEYWORD = '평가'
const TARGET_RESTAURANT = '학생식당'

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

// ──────────────────────────────────────────────────────────────────────────────
// API Functions (Directly via Supabase)
// ──────────────────────────────────────────────────────────────────────────────

export async function fetchSchedules(params?: {
  start?: string
  end?: string
  limit?: number
}): Promise<Schedule[]> {
  let query = supabase
    .from('schedules')
    .select('id, title, start_date, end_date')
    .order('start_date', { ascending: true })
    .limit(params?.limit || 100)

  if (params?.start) query = query.gte('start_date', params.start)
  if (params?.end) query = query.lte('start_date', params.end)

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch schedules:', error)
    throw error
  }

  return (data || [])
    .filter((r) => !EXCLUDE_KEYWORDS.some((kw) => r.title?.includes(kw)))
    .map((r) => ({
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
  let query = supabase
    .from('meals')
    .select('id, date, meal_type, menu_category, menu_content, restaurant_type')
    .eq('restaurant_type', TARGET_RESTAURANT)
    .order('date', { ascending: true })
    .limit(params?.limit || 50)

  if (params?.date) query = query.eq('date', params.date)
  if (params?.meal_type) query = query.eq('meal_type', params.meal_type)

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch meals:', error)
    throw error
  }

  return (data || []).map((r) => ({
    id: r.id,
    date: r.date,
    meal_type: r.meal_type,
    menu_category: r.menu_category,
    restaurant_type: r.restaurant_type,
    menu_items: splitMenu(r.menu_content),
    price: resolvePrice(r.meal_type, r.menu_category),
  }))
}
