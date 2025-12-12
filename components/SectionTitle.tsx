interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionTitle({ title, subtitle, align = 'left' }: SectionTitleProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={`mb-12 ${alignClasses[align]}`}>
      <h2 className="text-walnut-800 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-walnut-600 font-light text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}

