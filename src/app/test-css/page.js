'use client'

export default function TestCSS() {
  return (
    <div className="p-8 min-h-screen bg-light">
      <h1 className="text-3xl font-bold mb-4 text-dark">CSS Variables Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 rounded bg-primary text-white">
          bg-primary class
        </div>
        
        <div className="p-4 rounded text-white" style={{backgroundColor: 'var(--color-primary)'}}>
          CSS var(--color-primary)
        </div>
        
        <div className="p-4 rounded bg-dark text-white">
          bg-dark class
        </div>
        
        <div className="p-4 rounded text-white" style={{backgroundColor: 'var(--color-dark)'}}>
          CSS var(--color-dark)
        </div>
        
        <div className="p-4 rounded bg-success text-white">
          bg-success class
        </div>
        
        <div className="p-4 rounded text-white" style={{backgroundColor: 'var(--color-success)'}}>
          CSS var(--color-success)
        </div>
      </div>
    </div>
  )
}
