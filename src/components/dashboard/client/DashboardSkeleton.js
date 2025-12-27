export default function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-20">
       <div className="h-[280px] bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_,i) => <div key={i} className="h-40 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_,i) => <div key={i} className="h-96 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)}
             </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
             <div className="h-[400px] bg-gray-100 rounded-[2rem] animate-pulse"></div>
             <div className="h-[300px] bg-gray-100 rounded-[2rem] animate-pulse"></div>
          </div>
       </div>
    </div>
  )
}
