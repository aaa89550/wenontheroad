# 部署说明

## 双模式部署架构

### 前端展示（GitHub Pages）
- 自动部署静态网站到 https://aaa89550.github.io/wenontheroad
- 每次 push 到 main 分支会自动重新构建和部署
- 访客可以浏览文章和作品

### 后台管理（Codespaces）
- 在 Codespaces 中运行开发服务器
- 访问 `/admin` 管理内容
- 上传、编辑、删除文章
- 管理订阅者和导出数据

## 使用流程

### 1. 日常管理（在 Codespaces）

```bash
# 启动开发服务器
npm run dev

# 访问后台
打开 http://localhost:3000/admin
密码：admin123（或 .env.local 中设置的密码）

# 管理文章
- 上传新文章
- 删除文章
- 管理订阅者
```

### 2. 发布更新（推送到 GitHub）

```bash
# 提交更改
git add .
git commit -m "新增文章"
git push origin main

# GitHub Actions 会自动：
# 1. 构建静态网站
# 2. 部署到 GitHub Pages
# 3. 5-10 分钟后网站更新
```

### 3. 本地测试静态构建

```bash
# 测试静态导出
BUILD_STATIC=true npm run build

# 查看生成的文件
ls -la out/
```

## GitHub Pages 设置

1. 进入仓库 Settings > Pages
2. Source 选择 "GitHub Actions"
3. 保存

## 注意事项

- ✓ 前端是完全静态的，无需服务器
- ✓ 后台功能只在 Codespaces/本地开发时可用
- ✓ API 路由不会部署到 GitHub Pages
- ✓ 订阅者数据保存在 `data/subscribers.json`
- ✓ 文章保存在 `content/blog/` 和 `content/portfolio/`

## 自定义域名（可选）

如果有自己的域名：

1. 在仓库 Settings > Pages 设置 Custom domain
2. 在域名 DNS 添加 CNAME 记录指向 `aaa89550.github.io`
3. 等待 DNS 传播（可能需要几小时）
