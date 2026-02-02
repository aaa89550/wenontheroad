'use client'

import { useState, useEffect } from 'react'

interface Article {
  slug: string
  title: string
  excerpt: string
  date: string
}

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<Article[]>([])
  const [portfolioProjects, setPortfolioProjects] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [emailMessage, setEmailMessage] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [blogRes, portfolioRes] = await Promise.all([
          fetch('/api/articles?category=blog'),
          fetch('/api/articles?category=portfolio'),
        ])
        
        if (blogRes.ok) {
          const blogData = await blogRes.json()
          setBlogPosts(blogData)
        }
        
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json()
          setPortfolioProjects(portfolioData)
        }
      } catch (error) {
        console.error('載入文章失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailStatus('loading')

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('訂閱失敗')
      }
      
      setEmailStatus('success')
      setEmailMessage('訂閱成功！感謝您的訂閱。')
      setEmail('')
      
      setTimeout(() => {
        setEmailStatus('idle')
        setEmailMessage('')
      }, 3000)
    } catch (error) {
      setEmailStatus('error')
      setEmailMessage('訂閱失敗，請稍後再試。')
    }
  }

  return (
    <div className="bg-bg-main">
      {/* 英雄區 */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light text-text-main mb-6 leading-tight">
            歡迎來到我的部落格
          </h1>
          <p className="text-lg md:text-xl text-text-sub font-light leading-relaxed mb-8">
            這裡是我分享作品、想法和生活的地方。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#about" className="px-8 py-3 bg-accent text-white font-light hover:opacity-90 transition rounded-full">
              了解更多
            </a>
            <a href="#newsletter" className="px-8 py-3 border border-accent text-accent font-light hover:bg-accent hover:text-white transition rounded-full">
              訂閱電子報
            </a>
          </div>
        </div>
      </section>

      {/* 關於我區 */}
      <section id="about" className="bg-bg-block py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-light text-text-main mb-8">關於我</h2>
          
          <div className="space-y-6 text-text-sub font-light leading-relaxed">
            <p>
              歡迎來到我的個人網站！我是一位熱愛創作和分享的內容創作者。
            </p>
            <p>
              我的專業背景包括設計、開發和內容策劃等多個領域。透過這個部落格，我希望能分享我的知識、經驗和對生活的觀察。
            </p>
            <p>
              在這裡，你會找到我的作品集、個人寫作和各種有趣的想法。歡迎探索，也期待與你交流。
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-text-sub border-opacity-20">
            <h3 className="text-xl font-light text-text-main mb-6">興趣與專長</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg">
                <div className="text-3xl mb-3"></div>
                <h4 className="font-light text-text-main mb-2">設計</h4>
                <p className="text-sm text-text-sub font-light">UI/UX 設計與視覺創意</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <div className="text-3xl mb-3"></div>
                <h4 className="font-light text-text-main mb-2">開發</h4>
                <p className="text-sm text-text-sub font-light">前端開發與全端技術</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <div className="text-3xl mb-3"></div>
                <h4 className="font-light text-text-main mb-2">寫作</h4>
                <p className="text-sm text-text-sub font-light">內容創作與思想分享</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 作品集區 */}
      <section id="portfolio" className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-light text-text-main">作品集</h2>
            {portfolioProjects.length > 3 && (
              <a href="/portfolio" className="text-accent font-light hover:underline">
                看更多
              </a>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {loading ? (
              <p className="text-text-sub font-light">載入中...</p>
            ) : portfolioProjects.length > 0 ? (
              portfolioProjects.slice(0, 3).map((project) => (
                <a key={project.slug} href={`/portfolio/${project.slug}`} className="group">
                  <div className="bg-bg-block p-8 rounded-lg hover:shadow-md transition">
                    <h3 className="text-2xl font-light text-text-main mb-3 group-hover:text-accent transition">
                      {project.title}
                    </h3>
                    <p className="text-text-sub font-light mb-4">
                      {project.excerpt}
                    </p>
                    <span className="text-accent font-light group-hover:underline">
                      查看詳情
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-text-sub font-light">暫無作品</p>
            )}
          </div>
        </div>
      </section>

      {/* 個人書寫區 */}
      <section id="blog" className="bg-bg-block py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-light text-text-main">個人書寫</h2>
            {blogPosts.length > 3 && (
              <a href="/blog" className="text-accent font-light hover:underline">
                看更多
              </a>
            )}
          </div>
          
          <div className="space-y-8">
            {loading ? (
              <p className="text-text-sub font-light">載入中...</p>
            ) : blogPosts.length > 0 ? (
              blogPosts.slice(0, 3).map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <div className="pb-6 border-b border-text-sub border-opacity-20 hover:border-accent transition">
                    <h3 className="text-2xl font-light text-text-main mb-2 group-hover:text-accent transition">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-sub font-light mb-3">
                      {post.date}
                    </p>
                    <p className="text-text-sub font-light leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-text-sub font-light">暫無文章</p>
            )}
          </div>
        </div>
      </section>

      {/* 訂閱電子報區 */}
      <section id="newsletter" className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl font-light text-text-main mb-8 text-center">訂閱電子報</h2>
          <p className="text-lg text-text-sub font-light text-center mb-12">
            訂閱我的電子報，獲取最新的文章和作品更新。
          </p>

          <div className="bg-bg-block p-8 md:p-12 rounded-lg">
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-light text-text-main mb-2">
                  電子郵件地址
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-text-sub border-opacity-20 text-text-main font-light placeholder-text-sub rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="your@email.com"
                  required
                  disabled={emailStatus === 'loading'}
                />
              </div>

              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 font-light"
              >
                {emailStatus === 'loading' ? '訂閱中...' : '訂閱'}
              </button>

              {emailStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-light">{emailMessage}</p>
                </div>
              )}

              {emailStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-light">{emailMessage}</p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-text-sub border-opacity-20">
              <h3 className="font-light text-text-main mb-4">為什麼要訂閱？</h3>
              <ul className="space-y-3 text-sm text-text-sub font-light">
                <li>• 獲取最新文章和作品更新</li>
                <li>• 獨家內容和見解分享</li>
                <li>• 不定期的精選推薦</li>
                <li>• 隨時可以取消訂閱</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
