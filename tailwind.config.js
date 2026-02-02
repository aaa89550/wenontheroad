/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#F3F1EC',      // 主背景 米白
        'bg-block': '#DDE3D6',     // 區塊底色 灰綠
        'text-main': '#2F332D',    // 主文字 深灰綠
        'text-sub': '#6F756B',     // 輔助文字 中灰
        'accent': '#9CAF88',       // 重點色 苔綠色
      },
    },
  },
  plugins: [],
}
