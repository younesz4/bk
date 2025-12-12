'use client'

interface DimensionsTableProps {
  width?: number | null
  depth?: number | null
  height?: number | null
}

export default function DimensionsTable({
  width,
  depth,
  height,
}: DimensionsTableProps) {
  if (!width && !depth && !height) {
    return null
  }

  const dimensions = [
    { label: 'Largeur', value: width, unit: 'cm' },
    { label: 'Profondeur', value: depth, unit: 'cm' },
    { label: 'Hauteur', value: height, unit: 'cm' },
  ].filter((dim) => dim.value !== null && dim.value !== undefined)

  if (dimensions.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-sm font-light text-walnut-500 mb-3">Dimensions</h3>
      <table className="w-full border-collapse">
        <tbody>
          {dimensions.map((dim) => (
            <tr key={dim.label} className="border-b border-walnut-200">
              <td className="py-2 text-walnut-700 font-light">{dim.label}</td>
              <td className="py-2 text-right text-walnut-700 font-light">
                {dim.value} {dim.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


