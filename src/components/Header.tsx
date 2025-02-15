import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-soft fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 sm:h-20">
          <Link href="/" className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              1도GYM
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
