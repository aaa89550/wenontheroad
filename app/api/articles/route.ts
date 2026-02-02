import { NextResponse } from 'next/server'
import { saveArticle, getArticles } from '@/lib/articles'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as 'blog' | 'portfolio' | null

    if (!category || (category !== 'blog' && category !== 'portfolio')) {
      return NextResponse.json(
        { error: '無效的分類' },
        { status: 400 }
      )
    }

    const articles = await getArticles(category)
    
    return NextResponse.json(articles, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/articles:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, excerpt, category } = body

    // 驗證必要欄位
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: '缺少必要欄位' },
        { status: 400 }
      )
    }

    // 驗證分類
    if (category !== 'portfolio' && category !== 'blog') {
      return NextResponse.json(
        { error: '無效的分類' },
        { status: 400 }
      )
    }

    // 儲存文章
    const result = await saveArticle({ title, content, excerpt, category })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '儲存失敗' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        slug: result.slug,
        message: '文章已成功建立' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/articles:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
