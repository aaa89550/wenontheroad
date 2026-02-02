import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: '缺少 slug 參數' },
        { status: 400 }
      )
    }

    // 嘗試刪除 blog 或 portfolio 中的文章
    const blogPath = path.join(process.cwd(), 'content', 'blog', `${slug}.md`)
    const portfolioPath = path.join(process.cwd(), 'content', 'portfolio', `${slug}.md`)

    let deleted = false
    let deletedPath = ''

    try {
      await fs.unlink(blogPath)
      deleted = true
      deletedPath = 'blog'
    } catch (error) {
      try {
        await fs.unlink(portfolioPath)
        deleted = true
        deletedPath = 'portfolio'
      } catch (error) {
        // 兩個路徑都不存在
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: '文章已刪除',
        deletedPath
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/articles/[slug]:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
