'use client'
import { Check } from 'lucide-react'

export default function PackageSelector({
  packages, loading, selectedPackages, selectPackage, theme
}) {
  const primaryColor = theme?.colors?.primary?.[800] || '#1F3A5F'

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : packages.length > 0 ? (
        <div className="space-y-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackages.includes(pkg.id)
            return (
              <div
                key={pkg.id}
                onClick={() => selectPackage(pkg.id)}
                className={`relative group cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 flex items-center justify-between gap-4 text-left hover:border-gray-200`}
                style={{
                  borderColor: isSelected ? primaryColor : 'transparent',
                  backgroundColor: isSelected ? theme?.colors?.primary?.[50] : '#ffffff',
                  boxShadow: isSelected ? `0 4px 12px -2px ${theme?.colors?.primary?.[100]}` : '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-gray-900 text-base">{pkg.name}</h4>
                    {pkg.isPopular && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] uppercase font-bold tracking-wider rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{pkg.description}</p>
                  <div className="mt-1.5 text-xs font-medium text-gray-400">
                    Duration: {pkg.duration} mins
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="text-lg font-display font-medium text-gray-900">
                    ₦{pkg.price.toLocaleString()}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors`}
                    style={{
                      borderColor: isSelected ? primaryColor : '#d1d5db',
                      backgroundColor: isSelected ? primaryColor : 'transparent'
                    }}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No packages available</p>
        </div>
      )}
    </div>
  )
}

