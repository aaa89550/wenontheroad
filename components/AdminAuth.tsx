'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // 檢查是否已登入
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 設定你的後台密碼（建議使用環境變數）
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'authenticated')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('密碼錯誤')
      setPassword('')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    router.push('/')
  }

  // 正在檢查登入狀態
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    )
  }

  // 未登入，顯示登入表單
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">後台登入</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="輸入後台密碼"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              登入
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              💡 預設密碼：<code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              可在 .env.local 中設定 NEXT_PUBLIC_ADMIN_PASSWORD
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 已登入，顯示內容
  return (
    <div>
      <div className="bg-gray-800 text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-sm">✓ 已登入後台</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded transition"
          >
            登出
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
