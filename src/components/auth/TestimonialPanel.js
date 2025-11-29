'use client'
import { authData } from '../../data/authData'
import SocialLoginButtons from './SocialLoginButtons'
import { theme } from '../../lib/theme'

const displayFont = theme.typography.fontFamily.display.join(', ')
const sansFont = theme.typography.fontFamily.sans.join(', ')

const panelBaseStyle = {
  background:
    'linear-gradient(135deg, rgba(30,58,138,0.95), rgba(15,23,42,0.9))',
  border: '1px solid rgba(255,255,255,0.12)',
  backdropFilter: 'blur(24px)'
}

const highlightCardStyle = {
  backgroundColor: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.18)'
}

const overlayBaseStyle = {
  backgroundColor: 'rgba(255,255,255,0.96)',
  border: '1px solid rgba(148,163,184,0.25)',
  backdropFilter: 'blur(18px)'
}

export default function TestimonialPanel ({
  testimonial,
  overlayCard,
  isSignup = false,
  onNavigate
}) {
  const hasHighlights = Boolean(isSignup && testimonial?.highlights?.length)
  const showOverlayCard = Boolean(!isSignup && overlayCard)

  const handleNavigate = direction => {
    if (!onNavigate) return
    onNavigate(direction)
  }

  const renderOverlayContent = () => {
    if (!overlayCard) return null
    if (overlayCard.userCount) {
      return (
        <div className='flex -space-x-2' aria-label='User avatars'>
          {['#F59E0B', '#10B981', '#8B5CF6'].map((color, index) => (
            <div
              key={color}
              className='w-9 h-9 rounded-full border-2 border-white'
              style={{ backgroundColor: color }}
            />
          ))}
          <div
            className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold'
            style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}
          >
            {overlayCard.userCount}
          </div>
        </div>
      )
    }

    if (overlayCard.stats) {
      return (
        <dl className='grid grid-cols-3 gap-2'>
          {overlayCard.stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className='rounded-xl border border-slate-200/60 bg-white/60 px-3 py-2 text-center'
            >
              <dt className='text-xs uppercase tracking-wide text-slate-500'>
                {stat.label}
              </dt>
              <dd className='text-base font-semibold text-slate-900'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )
    }

    if (overlayCard.benefits) {
      return (
        <div className='grid grid-cols-2 gap-3 text-left'>
          {overlayCard.benefits.map((benefit, index) => (
            <div key={`${benefit.label}-${index}`}>
              <p className='text-sm font-semibold text-slate-900'>
                {benefit.label}
              </p>
              <p className='text-xs text-slate-500'>{benefit.desc}</p>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={`hidden lg:flex flex-col items-center justify-between lg:col-span-1 ${
        isSignup ? 'h-full' : ''
      }`}
    >
      <div className='relative w-full max-w-lg'>
        <div
          className='absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-blue-900/10 blur-3xl opacity-60'
          aria-hidden='true'
        />

        <div
          className={`relative w-full rounded-[32px] shadow-2xl ${
            isSignup ? 'min-h-[70vh]' : ''
          }`}
          style={{
            ...panelBaseStyle,
            borderTopLeftRadius: '3rem',
            borderBottomRightRadius: '3rem'
          }}
        >
          <div className='flex flex-col gap-10 p-8 lg:p-10'>
            <header className='space-y-3'>
              <span
                className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-sky-100/70'
                style={{ fontFamily: sansFont }}
              >
                Featured Story
                {testimonial?.role && (
                  <span className='text-white/60 normal-case tracking-normal'>
                    • {testimonial.role}
                  </span>
                )}
              </span>
              <h2
                className={`font-bold leading-tight text-white ${
                  isSignup ? 'text-3xl' : 'text-2xl'
                }`}
                style={{ fontFamily: displayFont }}
              >
                {testimonial.title}
              </h2>
            </header>

            <blockquote className='space-y-6' aria-live='polite'>
              <div
                className={`${isSignup ? 'text-6xl' : 'text-5xl'} text-sky-100`}
                aria-hidden='true'
              >
                &ldquo;
              </div>
              <p
                className={`leading-relaxed text-slate-100 ${
                  isSignup ? 'text-lg' : 'text-base'
                }`}z
                style={{ fontFamily: sansFont }}
              >
                {testimonial.quote}
              </p>
              {isSignup && testimonial.additionalText && (
                <p
                  className='text-base leading-relaxed text-slate-200'
                  style={{ fontFamily: sansFont }}
                >
                  {testimonial.additionalText}
                </p>
              )}
              <footer className='pt-4'>
                <p
                  className={`font-semibold text-white ${
                    isSignup ? 'text-lg' : 'text-base'
                  }`}
                  style={{ fontFamily: sansFont }}
                >
                  {testimonial.author}
                </p>
                {testimonial.role && (
                  <p
                    className={`${
                      isSignup ? 'text-sm' : 'text-xs'
                    } text-slate-200`}
                    style={{ fontFamily: sansFont }}
                  >
                    {testimonial.role}
                  </p>
                )}
              </footer>
            </blockquote>

            {hasHighlights && (
              <div className='grid grid-cols-2 gap-3 pt-2'>
                {testimonial.highlights.map((highlight, idx) => (
                  <div
                    key={`${highlight.label}-${idx}`}
                    className='rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15'
                    style={highlightCardStyle}
                  >
                    <div className='mb-2 text-2xl'>{highlight.icon}</div>
                    <p
                      className='text-sm font-semibold text-white'
                      style={{ fontFamily: sansFont }}
                    >
                      {highlight.label}
                    </p>
                    <p
                      className='text-xs text-slate-200'
                      style={{ fontFamily: sansFont }}
                    >
                      {highlight.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!isSignup && (
              <div className='flex gap-3'>
                {['previous', 'next'].map(direction => (
                  <button
                    key={direction}
                    className='w-11 h-11 rounded-full border border-slate-100/40 text-slate-100 transition-all hover:bg-white hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80'
                    aria-label={`${
                      direction === 'previous' ? 'Previous' : 'Next'
                    } testimonial`}
                    onClick={() => handleNavigate(direction)}
                    style={{ fontFamily: sansFont }}
                  >
                    <svg
                      className='mx-auto h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d={
                          authData.common.arrowIcons[
                            direction === 'previous' ? 'left' : 'right'
                          ]
                        }
                      />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          {showOverlayCard && (
            <div
              className='absolute -bottom-6 -left-6 w-[19rem] rounded-2xl p-6 shadow-2xl'
              style={overlayBaseStyle}
            >
              <h3
                className='text-lg font-semibold text-slate-900'
                style={{ fontFamily: sansFont }}
              >
                {overlayCard.title}
              </h3>
              <p
                className='mb-4 text-sm text-slate-500'
                style={{ fontFamily: sansFont }}
              >
                {overlayCard.subtitle}
              </p>
              {renderOverlayContent()}
            </div>
          )}
        </div>
      </div>

      <div className='w-full max-w-lg pt-12'>
        <div className='relative mb-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-white/30' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span
              className='px-4 font-semibold uppercase tracking-widest text-white'
              style={{ fontFamily: sansFont }}
            >
              Or continue with
            </span>
          </div>
        </div>
        <SocialLoginButtons />
      </div>
    </div>
  )
}
