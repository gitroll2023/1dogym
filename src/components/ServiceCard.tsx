interface ServiceCardProps {
  title: string
  description: string
  icon: string
}

export default function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="card group hover:scale-105">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-secondary-900">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  )
}
