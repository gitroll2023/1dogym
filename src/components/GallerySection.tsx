import Image from 'next/image'

const galleryImages = [
  { src: '/img/sub1.jpg', alt: '모임' },
  { src: '/img/sub2.jpg', alt: '1:1 PT' },
  { src: '/img/sub3.jpg', alt: '1:1 PT' },
  { src: '/img/sub4.jpg', alt: '그룹' },
  { src: '/img/sub5.jpg', alt: '그룹' },
  { src: '/img/sub6.jpg', alt: '모임' }
]

export default function GallerySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">갤러리</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* 참가하기 섹션 */}
      <div className="mt-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 skew-y-2"></div>
        <div className="container mx-auto px-4 relative">
          <div className="py-16 text-center">
            <h3 className="text-4xl font-bold text-white mb-6">
              지금 바로 시작하세요
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              1도GYM과 함께라면 당신의 건강한 변화가 시작됩니다
            </p>
            <a
              href="/apply"
              className="inline-block px-12 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg
                hover:bg-blue-50 transition-all duration-300 transform hover:scale-105
                shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              나도 참가 신청하기
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
