export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <a href="/" className="text-accent font-light hover:underline">← 返回首頁</a>
      </div>

      <h1 className="text-5xl font-light text-text-main mb-12">關於我</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-light text-text-main mb-4">我是誰</h2>
          <p className="text-text-sub font-light leading-relaxed">
            歡迎來到我的個人網站！我是一位...
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light text-text-main mb-4">我的背景</h2>
          <p className="text-text-sub font-light leading-relaxed">
            我的專業背景包括...
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light text-text-main mb-4">興趣與專長</h2>
          <ul className="space-y-3 text-text-sub font-light">
            <li>• 專長項目 1</li>
            <li>• 專長項目 2</li>
            <li>• 專長項目 3</li>
          </ul>
        </section>

        <section className="pt-8 border-t border-text-sub border-opacity-20">
          <h2 className="text-2xl font-light text-text-main mb-4">聯絡方式</h2>
          <p className="text-text-sub font-light leading-relaxed">
            歡迎透過以下方式與我聯繫...
          </p>
        </section>
      </div>
    </div>
  )
}
