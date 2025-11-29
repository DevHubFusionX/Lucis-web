'use client'

export default function TailwindConfigTest() {
  return (
    <div className="p-8" style={{backgroundColor: '#F5F7FA', minHeight: '100vh'}}>
      <h1 className="text-3xl font-bold mb-4" style={{color: '#0A0A0A'}}>Tailwind Config Test</h1>
      <p className="mb-8" style={{color: '#6B7280'}}>Comparison: Tailwind Classes (left) vs Inline Styles (right)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tailwind Classes */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{color: '#0A0A0A'}}>Using Tailwind Classes</h2>
          <div className="space-y-2">
            <div className="bg-primary h-12 rounded flex items-center px-4" style={{color: '#FFF'}}>bg-primary</div>
            <div className="bg-dark h-12 rounded flex items-center px-4" style={{color: '#FFF'}}>bg-dark</div>
            <div className="bg-light h-12 rounded flex items-center px-4" style={{color: '#0A0A0A'}}>bg-light</div>
            <div className="bg-success h-12 rounded flex items-center px-4" style={{color: '#FFF'}}>bg-success</div>
            <div className="bg-error h-12 rounded flex items-center px-4" style={{color: '#FFF'}}>bg-error</div>
            <div className="bg-warning h-12 rounded flex items-center px-4" style={{color: '#FFF'}}>bg-warning</div>
          </div>
        </div>
        
        {/* Inline Styles */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{color: '#0A0A0A'}}>Using Inline Styles</h2>
          <div className="space-y-2">
            <div className="h-12 rounded flex items-center px-4" style={{backgroundColor: '#0057FF', color: '#FFF'}}>#0057FF (primary)</div>
            <div className="h-12 rounded flex items-center px-4" style={{backgroundColor: '#0A0A0A', color: '#FFF'}}>#0A0A0A (dark)</div>
            <div className="h-12 rounded flex items-center px-4" style={{backgroundColor: '#F5F7FA', color: '#0A0A0A'}}>#F5F7FA (light)</div>
            <div className="h-12 rounded flex items-center px-4" style={{backgroundColor: '#16A34A', color: '#FFF'}}>#16A34A (success)</div>
            <div className="h-12 rounded flex items-center px-4" style={{backgroundColor: '#DC2626', color: '#FFF'}}>#DC2626 (error)</div>
            <div className="h-12 rounded flex items-center px-4" style={{backgroundColor: '#CA8A04', color: '#FFF'}}>#CA8A04 (warning)</div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-lg" style={{backgroundColor: '#FFFFFF', border: '1px solid #E1E6EB'}}>
        <h2 className="text-xl font-bold mb-4" style={{color: '#0A0A0A'}}>Diagnosis</h2>
        <div className="space-y-3" style={{color: '#0A0A0A'}}>
          <p>✓ If RIGHT column shows colors: Inline styles work</p>
          <p>✗ If LEFT column is empty/white: Tailwind custom colors not compiling</p>
          <p className="mt-4 font-semibold">Solution: Tailwind v4 requires different config. Custom colors must be defined in globals.css using @theme directive.</p>
        </div>
      </div>
    </div>
  )
}
