'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const slides = [
  {
    image: '/img/main1.jpg',
    title: '체계적인 운동 프로그램',
    description: '미주신경을 자극하는 고차원 운동 PT'
  },
  {
    image: '/img/main2.jpg',
    title: '합리적인 가격',
    description: 'PT 1회 5천원으로 시작하는 가성비 운동'
  },
  {
    image: '/img/main3.jpg',
    title: '전문 트레이너와 함께',
    description: '1:1 맞춤 지도로 정확한 자세와 운동 방법 습득'
  }
]

export default function MainSlideshow() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // 초기 체크
    checkMobile()
    
    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkMobile)
    
    // 클린업
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="h-screen relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={!isMobile}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="w-full h-full [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden md:[&_.swiper-button-next]:block md:[&_.swiper-button-prev]:block"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
              {/* 이미지 오버레이 - 더 진한 그라데이션 적용 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            </div>
            
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
              {/* 텍스트에 그림자 효과 강화 */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white 
                [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)]">
                {slide.title}
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl 
                [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                {slide.description}
              </p>
              <a 
                href="/apply" 
                className="mt-8 px-8 py-3 text-lg font-semibold bg-white/20 backdrop-blur-sm 
                  hover:bg-white/30 border-2 border-white text-white rounded-lg
                  transition-all duration-300 hover:scale-105
                  [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
              >
                지금 시작하기
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
