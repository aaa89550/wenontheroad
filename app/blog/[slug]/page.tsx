import { getArticles, getArticleBySlug } from '@/lib/articles'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const articles = await getArticles('blog')
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticleBySlug(params.slug, 'blog')

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <a href="/blog" className="text-accent font-light hover:underline">← 返回個人書寫</a>
      </div>
      
      <article>
        <h1 className="text-5xl font-light text-text-main mb-4">{article.title}</h1>
        <div className="text-text-sub font-light mb-12 pb-8 border-b border-text-sub border-opacity-20">
          {new Date(article.date).toLocaleDateString('zh-TW')}
        </div>
        <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:text-text-main prose-p:text-text-sub prose-p:font-light prose-a:text-accent">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
