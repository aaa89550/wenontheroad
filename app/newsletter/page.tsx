'use client'

import { useState } from 'react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

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
      
      setStatus('success')
      setMessage('訂閱成功！感謝您的訂閱。')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('訂閱失敗，請稍後再試。')
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-12">
        <a href="/" className="text-accent font-light hover:underline">← 返回首頁</a>
      </div>
      
      <h1 className="text-5xl font-light text-text-main mb-8 text-center">訂閱電子報</h1>
      <p className="text-lg text-text-sub font-light text-center mb-12">
        訂閱我的電子報，獲取最新的文章和作品更新。
      </p>

      <div className="bg-bg-block p-8 md:p-12 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-light text-text-main mb-2">
              電子郵件地址
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-text-sub border-opacity-20 text-text-main font-light placeholder-text-sub rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="your@email.com"
              disabled={status === 'loading'}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-accent text-white py-3 px-6 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 font-light"
          >
            {status === 'loading' ? '訂閱中...' : '訂閱'}
          </button>

          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-light">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-light">{message}</p>
            </div>
          )}
        </form>

        <div className="mt-8 pt-8 border-t border-text-sub border-opacity-20">
          <h2 className="font-light text-text-main mb-4">為什麼要訂閱？</h2>
          <ul className="space-y-3 text-sm text-text-sub font-light">
            <li>• 獲取最新文章和作品更新</li>
            <li>• 獨家內容和見解分享</li>
            <li>• 不定期的精選推薦</li>
            <li>• 隨時可以取消訂閱</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
