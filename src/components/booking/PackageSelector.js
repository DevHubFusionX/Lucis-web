'use client'
import { theme } from '../../lib/theme'

export default function PackageSelector({
  packages,
  loading,
  selectedPackages,
  selectPackage
}) {
  return (
    <div>
      <h3 style={{
        fontSize: theme.typography.fontSize.lg,
        fontWeight: '600',
        color: theme.colors.gray[900],
        marginBottom: theme.spacing.sm
      }}>Select Package</h3>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: `2px solid ${theme.colors.primary[800]}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.gray[600] }}>Loading packages...</span>
        </div>
      ) : packages.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => selectPackage(pkg.id)}
              style={{
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                border: `2px solid ${selectedPackages.includes(pkg.id) ? theme.colors.primary[800] : theme.colors.gray[200]}`,
                backgroundColor: selectedPackages.includes(pkg.id) ? theme.colors.primary[50] : theme.colors.white,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${selectedPackages.includes(pkg.id) ? theme.colors.primary[800] : theme.colors.gray[300]}`,
                  backgroundColor: selectedPackages.includes(pkg.id) ? theme.colors.primary[800] : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedPackages.includes(pkg.id) && (
                    <svg style={{ width: '12px', height: '12px', color: theme.colors.white }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: theme.colors.gray[900],
                    fontSize: theme.typography.fontSize.base
                  }}>{pkg.name}</div>
                  <div style={{
                    color: theme.colors.gray[600],
                    fontSize: theme.typography.fontSize.sm,
                    marginTop: '2px'
                  }}>{pkg.description}</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    marginTop: theme.spacing.xs
                  }}>
                    <span style={{
                      fontWeight: '700',
                      color: theme.colors.primary[800],
                      fontSize: theme.typography.fontSize.lg
                    }}>${pkg.price}</span>
                    <span style={{
                      color: theme.colors.gray[500],
                      fontSize: theme.typography.fontSize.xs
                    }}>{pkg.duration} min • {pkg.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          color: theme.colors.gray[500]
        }}>
          <div style={{ fontSize: theme.typography.fontSize.sm }}>No packages available</div>
          <div style={{ fontSize: theme.typography.fontSize.xs }}>Contact the professional directly</div>
        </div>
      )}
    </div>
  )
}
