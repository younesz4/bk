'use client'

interface Material {
  id: string
  name: string
  order: number
}

interface MaterialsListProps {
  materials: Material[]
}

export default function MaterialsList({ materials }: MaterialsListProps) {
  if (!materials || materials.length === 0) {
    return null
  }

  // Sort by order
  const sortedMaterials = [...materials].sort((a, b) => a.order - b.order)

  return (
    <div>
      <h3 className="text-sm font-light text-walnut-500 mb-3">Matériaux</h3>
      <ul className="space-y-2">
        {sortedMaterials.map((material) => (
          <li key={material.id} className="text-walnut-700 font-light">
            • {material.name}
          </li>
        ))}
      </ul>
    </div>
  )
}


