export default function AboutSection({ config, professional, theme }) {
  const content = config.content || professional?.bio || 'Passionate photographer with years of experience capturing life\'s most precious moments.'

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200">
              {professional?.profilePicture?.url ? (
                <img
                  src={professional.profilePicture.url}
                  alt={professional.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className={`text-6xl ${theme.text} opacity-50`}>📷</span>
                </div>
              )}
            </div>
            
            {/* Decorative Elements */}
            <div className={`absolute -top-4 -right-4 w-24 h-24 ${theme.accent} opacity-20 rounded-full`}></div>
            <div className={`absolute -bottom-4 -left-4 w-16 h-16 ${theme.accent} opacity-30 rounded-full`}></div>
          </div>

          {/* Content */}
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-8`}>
              About Me
            </h2>
            
            <div className={`text-lg ${theme.text} opacity-80 leading-relaxed mb-8 space-y-4`}>
              {content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className={`text-3xl font-bold ${theme.accent} mb-2`}>500+</div>
                <div className={`text-sm ${theme.text} opacity-70`}>Projects</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${theme.accent} mb-2`}>5+</div>
                <div className={`text-sm ${theme.text} opacity-70`}>Years</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${theme.accent} mb-2`}>100%</div>
                <div className={`text-sm ${theme.text} opacity-70`}>Satisfaction</div>
              </div>
            </div>

            {/* Skills */}
            {professional?.skills?.length > 0 && (
              <div>
                <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>Specializations</h3>
                <div className="flex flex-wrap gap-3">
                  {professional.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-4 py-2 ${theme.accent} bg-current/10 rounded-full text-sm font-medium`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8">
              <button className={`px-8 py-4 ${theme.accent} bg-current text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                Let's Work Together
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}