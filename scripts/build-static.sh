#!/bin/bash

# 静态构建脚本 - 临时移除 API 路由和管理页面

echo "准备静态构建..."

# 创建备份
mkdir -p .build-backup
cp -r app/api .build-backup/ 2>/dev/null || true
cp app/admin/page.tsx .build-backup/admin-page.tsx 2>/dev/null || true

# 临时移除 API 路由
if [ -d "app/api" ]; then
  echo "临时移除 API 路由..."
  rm -rf app/api
fi

# 临时替换管理页面为占位符
if [ -f "app/admin/page.tsx" ]; then
  echo "临时替换管理页面..."
  cat > app/admin/page.tsx << 'EOF'
export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main">
      <div className="text-center p-8">
        <h1 className="text-3xl font-light text-text-main mb-4">后台管理</h1>
        <p className="text-text-sub font-light mb-6">
          后台管理功能仅在开发环境中可用。
        </p>
        <p className="text-sm text-text-sub font-light">
          请在 Codespaces 或本地环境运行 <code className="bg-bg-block px-2 py-1 rounded">npm run dev</code> 来访问管理功能。
        </p>
      </div>
    </div>
  )
}
EOF
fi

echo "构建静态网站..."
BUILD_STATIC=true npm run build

# 恢复文件
echo "恢复原始文件..."
if [ -d ".build-backup/api" ]; then
  mkdir -p app
  cp -r .build-backup/api app/
fi

if [ -f ".build-backup/admin-page.tsx" ]; then
  cp .build-backup/admin-page.tsx app/admin/page.tsx
fi

# 清理备份
rm -rf .build-backup

echo "静态构建完成！"
