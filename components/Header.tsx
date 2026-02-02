import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-bg-main border-b border-bg-block sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl md:text-3xl font-light text-text-main hover:text-accent transition">
            我的部落格
          </Link>
          
          <ul className="flex gap-6 md:gap-10 items-center">
            <li>
              <a 
                href="#about" 
                className="text-text-sub hover:text-accent transition font-light"
              >
                關於我
              </a>
            </li>
            <li>
              <a 
                href="#portfolio" 
                className="text-text-sub hover:text-accent transition font-light"
              >
                作品集
              </a>
            </li>
            <li>
              <a 
                href="#blog" 
                className="text-text-sub hover:text-accent transition font-light"
              >
                個人書寫
              </a>
            </li>
            <li>
              <a 
                href="#newsletter" 
                className="text-text-sub hover:text-accent transition font-light"
              >
                訂閱電子報
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
