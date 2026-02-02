export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-block border-t border-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-light text-text-main mb-4">關於本站</h3>
            <p className="text-text-sub font-light leading-relaxed">
              這是我的個人部落格，分享我的作品、想法和生活。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-light text-text-main mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-text-sub hover:text-accent transition font-light">
                  關於我
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-text-sub hover:text-accent transition font-light">
                  作品集
                </a>
              </li>
              <li>
                <a href="#blog" className="text-text-sub hover:text-accent transition font-light">
                  個人書寫
                </a>
              </li>
              <li>
                <a href="#newsletter" className="text-text-sub hover:text-accent transition font-light">
                  訂閱電子報
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-light text-text-main mb-4">聯絡我</h3>
            <ul className="space-y-2 text-text-sub font-light">
              <li>Email: your@email.com</li>
              <li>GitHub: @yourusername</li>
              <li>Twitter: @yourusername</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8 text-center text-text-sub font-light">
          <p>&copy; {currentYear} 我的部落格. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
