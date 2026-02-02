'use client'
import Image from 'next/image'
import { Calendar, Clock, Sparkles, ShieldCheck } from 'lucide-react'

export default function BookingReview({
    professional,
    selectedPackages,
    selectedDate,
    selectedTime,
    formatTime,
    totalPrice,
    theme
}) {
    const totalDuration = selectedPackages.reduce((acc, pkg) => acc + (parseInt(pkg.duration) || 0), 0)

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 space-y-6">
                {/* Professional */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="relative w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 overflow-hidden">
                        {professional?.profilePicture?.url ? (
                            <Image
                                fill
                                src={professional.profilePicture.url}
                                alt={professional.firstName}
                                className="object-cover"
                                sizes="48px"
                            />
                        ) : (professional?.firstName?.[0] || 'P')}
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Professional</div>
                        <h4 className="text-base font-bold text-gray-900">{professional?.firstName} {professional?.lastName}</h4>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Package Info */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Sparkles size={12} className="text-blue-500" /> Services ({selectedPackages.length})
                        </div>
                        <div className="space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                            {selectedPackages.map(pkg => (
                                <div key={pkg.id} className="border-b border-gray-200/50 last:border-0 pb-1 last:pb-0">
                                    <div className="font-bold text-gray-900 text-[13px]">{pkg.name}</div>
                                    <div className="text-[10px] text-gray-500">{pkg.duration} mins • ₦{pkg.price.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200 text-xs font-bold text-gray-600 flex items-center gap-1">
                            <Clock size={10} /> Total: {totalDuration} mins
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Calendar size={12} className="text-purple-500" /> Date & Time
                        </div>
                        <div className="font-bold text-gray-900 text-sm mb-1">
                            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            }) : 'No date'}
                        </div>
                        <div className="text-blue-600 text-sm font-bold flex items-center gap-1.5 mt-1">
                            <Clock size={14} />
                            {selectedTime ? (formatTime ? formatTime(selectedTime) : selectedTime) : 'No time'}
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                    <div className="text-gray-500 text-sm font-medium">Total Amount</div>
                    <div className="text-2xl font-display font-medium text-gray-900">
                        ₦{totalPrice.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100 mt-4">
                <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed opacity-80 font-medium">
                    Your booking is secure. Payment will be handled at the venue.
                </p>
            </div>
        </div>
    )
}
