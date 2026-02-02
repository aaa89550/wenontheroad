import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content')

export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  category: 'portfolio' | 'blog'
}

export async function getArticles(category: 'portfolio' | 'blog'): Promise<Article[]> {
  try {
    const categoryPath = path.join(articlesDirectory, category)
    
    // 確保目錄存在
    try {
      await fs.access(categoryPath)
    } catch {
      return []
    }

    const files = await fs.readdir(categoryPath)
    const mdFiles = files.filter(file => file.endsWith('.md'))

    const articles = await Promise.all(
      mdFiles.map(async (filename) => {
        const slug = filename.replace(/\.md$/, '')
        const filePath = path.join(categoryPath, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          content,
          category,
        }
      })
    )

    // 按日期排序（最新的在前面）
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}

export async function getArticleBySlug(
  slug: string,
  category: 'portfolio' | 'blog'
): Promise<Article | null> {
  try {
    const filePath = path.join(articlesDirectory, category, `${slug}.md`)
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      content,
      category,
    }
  } catch (error) {
    console.error('Error reading article:', error)
    return null
  }
}

export async function saveArticle(article: {
  title: string
  content: string
  excerpt: string
  category: 'portfolio' | 'blog'
}): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const { title, content, excerpt, category } = article
    
    // 生成 slug（將標題轉換為 URL 友好的格式）
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, '')
      .substring(0, 50) || `article-${Date.now()}`

    // 確保目錄存在
    const categoryPath = path.join(articlesDirectory, category)
    await fs.mkdir(categoryPath, { recursive: true })

    // 建立 markdown 檔案內容（包含 frontmatter）
    const frontmatter = {
      title,
      date: new Date().toISOString(),
      excerpt,
    }

    const fileContent = matter.stringify(content, frontmatter)

    // 寫入檔案
    const filePath = path.join(categoryPath, `${slug}.md`)
    await fs.writeFile(filePath, fileContent, 'utf8')

    return { success: true, slug }
  } catch (error) {
    console.error('Error saving article:', error)
    return { success: false, error: 'Failed to save article' }
  }
}
