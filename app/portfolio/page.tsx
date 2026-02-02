import { getArticles } from '@/lib/articles'
import Link from 'next/link'

export default async function PortfolioPage() {
  const portfolioArticles = await getArticles('portfolio')

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <a href="/" className="text-accent font-light hover:underline">← 返回首頁</a>
      </div>
      
      <h1 className="text-5xl font-light text-text-main mb-12">作品集</h1>
      
      <div className="space-y-6">
        {portfolioArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-sub font-light">目前還沒有作品，請到後台新增</p>
          </div>
        ) : (
          portfolioArticles.map((article) => (
            <Link 
              key={article.slug} 
              href={`/portfolio/${article.slug}`}
              className="block group pb-6 border-b border-text-sub border-opacity-20 hover:border-accent transition"
            >
              <h2 className="text-2xl font-light text-text-main mb-2 group-hover:text-accent transition">{article.title}</h2>
              <p className="text-text-sub font-light mb-3">{article.excerpt}</p>
              <span className="text-accent font-light group-hover:underline">
                查看詳情
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
