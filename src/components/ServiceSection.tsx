import ServiceCard from './ServiceCard'

const services = [
  {
    title: '합리적인 가격',
    description: 'PT 1회 5천원으로 시작하는 가성비 운동',
    icon: '💰'
  },
  {
    title: '전문 트레이너',
    description: '1:1 맞춤 지도로 정확한 자세와 운동 방법 습득',
    icon: '💪'
  },
  {
    title: '개인별 피드백',
    description: '자세 교정과 식단 관리를 통한 맞춤형 피드백',
    icon: '📝'
  },
  {
    title: '운동 체크 시스템',
    description: '일일 운동 기록과 진행 상황 모니터링',
    icon: '✅'
  },
  {
    title: '활발한 커뮤니티',
    description: '함께 운동하고 성장하는 멋진 사람들과의 만남',
    icon: '👥'
  },
  {
    title: '고차원 PT 프로그램',
    description: '미주신경을 자극하는 전문적인 운동 프로그램',
    icon: '🎯'
  }
]

export default function ServiceSection() {
  return (
    <section id="services" className="py-24 px-4 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">우리의 특별함</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            1도GYM만의 특별한 서비스로 여러분의 건강한 라이프스타일을 만들어드립니다
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
