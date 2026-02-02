import { getArticles } from '@/lib/articles'
import Link from 'next/link'

export default async function BlogPage() {
  const blogArticles = await getArticles('blog')

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <a href="/" className="text-accent font-light hover:underline">← 返回首頁</a>
      </div>
      
      <h1 className="text-5xl font-light text-text-main mb-12">個人書寫</h1>
      
      <div className="space-y-8">
        {blogArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-sub font-light">目前還沒有文章，請到後台新增</p>
          </div>
        ) : (
          blogArticles.map((article) => (
            <Link 
              key={article.slug} 
              href={`/blog/${article.slug}`}
              className="block group pb-6 border-b border-text-sub border-opacity-20 hover:border-accent transition"
            >
              <h2 className="text-2xl font-light text-text-main mb-2 group-hover:text-accent transition">{article.title}</h2>
              <p className="text-text-sub text-sm font-light mb-3">
                {new Date(article.date).toLocaleDateString('zh-TW')}
              </p>
              <p className="text-text-sub font-light">{article.excerpt}</p>
              <span className="text-accent font-light group-hover:underline mt-3 inline-block">
                繼續閱讀
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
