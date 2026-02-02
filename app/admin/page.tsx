'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'articles' | 'article-list' | 'subscribers'>('articles')
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<'portfolio' | 'blog'>('blog')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const [subscribers, setSubscribers] = useState<string[]>([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)

  interface Article {
    slug: string
    title: string
    excerpt: string
    date: string
  }
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (loginPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'authenticated')
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('密碼錯誤')
      setLoginPassword('')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    router.push('/')
  }

  const loadSubscribers = async () => {
    setLoadingSubscribers(true)
    try {
      const response = await fetch('/api/subscribers')
      if (!response.ok) throw new Error('載入失敗')
      const data = await response.json()
      setSubscribers(data)
    } catch (error) {
      console.error('載入訂閱者失敗:', error)
    } finally {
      setLoadingSubscribers(false)
    }
  }

  const loadArticles = async () => {
    setLoadingArticles(true)
    try {
      const [blogRes, portfolioRes] = await Promise.all([
        fetch('/api/articles?category=blog'),
        fetch('/api/articles?category=portfolio'),
      ])

      let allArticles: Article[] = []

      if (blogRes.ok) {
        const blogData = await blogRes.json()
        allArticles = allArticles.concat(blogData)
      }

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        allArticles = allArticles.concat(portfolioData)
      }

      setArticles(allArticles)
    } catch (error) {
      console.error('載入文章失敗:', error)
    } finally {
      setLoadingArticles(false)
    }
  }

  const handleDeleteArticle = async (slug: string) => {
    if (!confirm('確定要刪除這篇文章嗎？')) {
      return
    }

    setDeletingSlug(slug)
    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('刪除失敗')
      }

      setArticles(articles.filter(article => article.slug !== slug))
      alert('文章已刪除')
    } catch (error) {
      console.error('刪除文章失敗:', error)
      alert('刪除失敗')
    } finally {
      setDeletingSlug(null)
    }
  }

  const exportToExcel = async () => {
    if (subscribers.length === 0) {
      alert('沒有訂閱者資料')
      return
    }

    try {
      // @ts-ignore
      const XLSX = (await import('xlsx')).default
      
      const wsData = [
        ['郵件地址', '訂閱日期'],
        ...subscribers.map((email) => [
          email,
          new Date().toLocaleDateString('zh-TW')
        ])
      ]
      
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '訂閱者')
      
      ws['!cols'] = [
        { wch: 30 },
        { wch: 15 }
      ]
      
      XLSX.writeFile(wb, `subscribers-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('導出失敗:', error)
      alert('導出失敗')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // @ts-ignore
      const TurndownService = (await import('turndown')).default
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      })
      
      const markdownContent = turndownService.turndown(content)

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: markdownContent,
          excerpt,
          category,
        }),
      })

      if (!response.ok) {
        throw new Error('上傳失敗')
      }

      setStatus('success')
      setMessage('文章上傳成功！')
      
      setTitle('')
      setContent('')
      setExcerpt('')
      
      setTimeout(() => {
        router.push(category === 'portfolio' ? '/portfolio' : '/blog')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setMessage('上傳失敗，請稍後再試。')
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="bg-bg-block p-8 rounded-lg w-full max-w-md">
          <h1 className="text-3xl font-light text-text-main mb-8 text-center">後台登入</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-light text-text-main mb-2">
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 border border-text-sub border-opacity-20 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="輸入後台密碼"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-light">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-accent text-white py-2 px-4 rounded-lg hover:opacity-90 transition font-light"
            >
              登入
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-text-sub border-opacity-20">
            <p className="text-sm text-text-sub text-center font-light">
              預設密碼：<code className="bg-white px-2 py-1 rounded text-xs">admin123</code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-accent text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-sm font-light">已登入後台</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-1 rounded transition font-light"
          >
            登出
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl font-light text-text-main mb-8">管理後台</h1>
        
        <div className="flex gap-4 mb-8 border-b border-text-sub border-opacity-20">
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-3 px-4 font-light transition ${
              activeTab === 'articles'
                ? 'text-accent border-b-2 border-accent -mb-px'
                : 'text-text-sub hover:text-text-main'
            }`}
          >
            上傳文章
          </button>
          <button
            onClick={() => {
              setActiveTab('article-list')
              loadArticles()
            }}
            className={`py-3 px-4 font-light transition ${
              activeTab === 'article-list'
                ? 'text-accent border-b-2 border-accent -mb-px'
                : 'text-text-sub hover:text-text-main'
            }`}
          >
            文章列表
          </button>
          <button
            onClick={() => {
              setActiveTab('subscribers')
              loadSubscribers()
            }}
            className={`py-3 px-4 font-light transition ${
              activeTab === 'subscribers'
                ? 'text-accent border-b-2 border-accent -mb-px'
                : 'text-text-sub hover:text-text-main'
            }`}
          >
            訂閱者管理
          </button>
        </div>

        {activeTab === 'articles' && (
          <div className="bg-bg-block p-8 rounded-lg">
            <h2 className="text-2xl font-light text-text-main mb-6">上傳新文章</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-light text-text-main mb-2">
                  分類 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'portfolio' | 'blog')}
                  className="w-full px-4 py-2 border border-text-sub border-opacity-20 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  required
                >
                  <option value="blog">個人書寫</option>
                  <option value="portfolio">作品集</option>
                </select>
                <p className="text-sm text-text-sub font-light mt-1">
                  選擇要發布到哪個類別
                </p>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-light text-text-main mb-2">
                  文章標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-text-sub border-opacity-20 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="輸入文章標題"
                  required
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-light text-text-main mb-2">
                  文章摘要 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-text-sub border-opacity-20 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="簡短描述這篇文章的內容"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-light text-text-main mb-2">
                  文章內容 <span className="text-red-500">*</span>
                </label>
                <div className="bg-white rounded-lg border border-text-sub border-opacity-20">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="h-96"
                    placeholder="開始撰寫文章內容..."
                  />
                </div>
                <p className="text-sm text-text-sub font-light mt-12">
                  使用上方工具列進行文字格式化、插入圖片和連結
                </p>
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || !content.trim()}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 font-light"
              >
                {status === 'loading' ? '上傳中...' : '上傳文章'}
              </button>

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{message}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{message}</p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-text-sub border-opacity-20">
              <h3 className="text-lg font-light text-text-main mb-4">編輯器功能說明</h3>
              <div className="bg-bg-main p-4 rounded-lg text-sm space-y-2 text-text-sub font-light">
                <p>• 使用工具列可以格式化文字（粗體、斜體、底線）</p>
                <p>• 可以調整標題大小（H1-H6）和字體大小</p>
                <p>• 支援文字顏色和背景色</p>
                <p>• 點擊圖片圖示可以插入圖片（需要圖片網址）</p>
                <p>• 點擊連結圖示可以新增超連結</p>
                <p>• 支援有序和無序列表</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'article-list' && (
          <div className="bg-bg-block p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-text-main">文章列表</h2>
              <button
                onClick={loadArticles}
                disabled={loadingArticles}
                className="text-sm bg-accent text-white py-2 px-4 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 font-light"
              >
                重新載入
              </button>
            </div>

            {loadingArticles ? (
              <div className="text-center py-8">
                <p className="text-text-sub font-light">載入中...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-sub font-light">暫無文章</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-text-sub font-light">
                    總計：<span className="text-accent font-medium">{articles.length}</span> 篇文章
                  </p>
                </div>
                <div className="border border-text-sub border-opacity-20 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-bg-main border-b border-text-sub border-opacity-20">
                        <th className="px-6 py-4 text-left text-sm font-light text-text-main">標題</th>
                        <th className="px-6 py-4 text-left text-sm font-light text-text-main">日期</th>
                        <th className="px-6 py-4 text-right text-sm font-light text-text-main">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.slug} className="border-b border-text-sub border-opacity-10 hover:bg-bg-main transition">
                          <td className="px-6 py-3 text-sm text-text-main font-light">{article.title}</td>
                          <td className="px-6 py-3 text-sm text-text-sub font-light">{article.date}</td>
                          <td className="px-6 py-3 text-sm text-right font-light">
                            <button
                              onClick={() => handleDeleteArticle(article.slug)}
                              disabled={deletingSlug === article.slug}
                              className="text-red-600 hover:text-red-800 transition disabled:text-gray-400"
                            >
                              {deletingSlug === article.slug ? '刪除中...' : '刪除'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-bg-block p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-text-main">訂閱者管理</h2>
              <button
                onClick={exportToExcel}
                disabled={subscribers.length === 0 || loadingSubscribers}
                className="bg-accent text-white py-2 px-6 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 font-light text-sm"
              >
                導出 Excel
              </button>
            </div>

            {loadingSubscribers ? (
              <div className="text-center py-8">
                <p className="text-text-sub font-light">載入中...</p>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-sub font-light">目前沒有訂閱者</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-text-sub font-light">
                    總計：<span className="text-accent font-medium">{subscribers.length}</span> 位訂閱者
                  </p>
                </div>
                <div className="border border-text-sub border-opacity-20 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-bg-main border-b border-text-sub border-opacity-20">
                        <th className="px-6 py-4 text-left text-sm font-light text-text-main">郵件地址</th>
                        <th className="px-6 py-4 text-right text-sm font-light text-text-main">序號</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((email, index) => (
                        <tr key={email} className="border-b border-text-sub border-opacity-10 hover:bg-bg-main transition">
                          <td className="px-6 py-3 text-sm text-text-main font-light">{email}</td>
                          <td className="px-6 py-3 text-sm text-text-sub font-light text-right">{index + 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
