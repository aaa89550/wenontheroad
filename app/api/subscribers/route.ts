import { promises as fs } from 'fs'
import path from 'path'

const subscribersFile = path.join(process.cwd(), 'data', 'subscribers.json')

// 確保目錄存在
async function ensureDir() {
  try {
    await fs.mkdir(path.dirname(subscribersFile), { recursive: true })
  } catch (error) {
    // 目錄已存在
  }
}

// 讀取訂閱者列表
async function getSubscribers(): Promise<string[]> {
  try {
    await ensureDir()
    const data = await fs.readFile(subscribersFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// 保存訂閱者
async function saveSubscriber(email: string) {
  await ensureDir()
  const subscribers = await getSubscribers()
  
  // 檢查是否已訂閱
  if (subscribers.includes(email)) {
    throw new Error('此郵件已訂閱')
  }
  
  subscribers.push(email)
  await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return Response.json(
        { error: '無效的郵件地址' },
        { status: 400 }
      )
    }

    await saveSubscriber(email)

    return Response.json(
      { message: '訂閱成功' },
      { status: 201 }
    )
  } catch (error: any) {
    return Response.json(
      { error: error.message || '訂閱失敗' },
      { status: 400 }
    )
  }
}

export async function GET() {
  try {
    const subscribers = await getSubscribers()
    return Response.json(subscribers, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: '無法讀取訂閱者' },
      { status: 500 }
    )
  }
}
