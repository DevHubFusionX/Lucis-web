/**
 * Avatar and Image Helper Utilities
 * Provides consistent fallback images for professional profiles
 */

/**
 * Get profile image URL with smart fallback
 * @param {Object} professional - Professional data object
 * @returns {string} - Profile image URL
 */
export function getProfileImage(professional) {
    // Check for various profile picture fields
    if (professional?.profilePicture?.url) {
        return professional.profilePicture.url
    }

    if (professional?.avatar) {
        return professional.avatar
    }

    // Generate initial-based avatar using ui-avatars
    const firstName = professional?.firstName || 'User'
    const lastName = professional?.lastName || ''
    const name = `${firstName}+${lastName}`.trim()

    // Use a consistent color based on the name
    const colors = ['0D9488', '0891B2', '6366F1', 'EC4899', 'F59E0B', '10B981', '8B5CF6']
    const colorIndex = (firstName.charCodeAt(0) + (lastName.charCodeAt(0) || 0)) % colors.length
    const bgColor = colors[colorIndex]

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=${bgColor}&color=fff&bold=true`
}

/**
 * Get cover image URL with smart fallback
 * @param {Object} professional - Professional data object
 * @returns {string} - Cover image URL
 */
export function getCoverImage(professional) {
    // Check for cover image
    if (professional?.coverImage?.url) {
        return professional.coverImage.url
    }

    // Fallback to portfolio images if available
    if (professional?.portfolio?.length > 0 && professional.portfolio[0]?.url) {
        return professional.portfolio[0].url
    }

    // Generate a gradient-based placeholder based on specialty
    const specialty = professional?.specialty?.toLowerCase() || ''

    // Map specialties to relevant Unsplash images
    const specialtyImages = {
        'wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'portrait': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        'event': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        'fashion': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
        'product': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'landscape': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        'food': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80',
        'real estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        'sport': 'https://images.unsplash.com/photo-1461896836934- voices-team?auto=format&fit=crop&w=800&q=80',
    }

    // Find matching specialty image
    for (const [key, url] of Object.entries(specialtyImages)) {
        if (specialty.includes(key)) {
            return url
        }
    }

    // Default photography cover
    return 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80'
}

/**
 * Format display name
 * @param {Object} professional - Professional data object
 * @returns {string} - Formatted full name
 */
export function getDisplayName(professional) {
    const firstName = professional?.firstName || 'Unknown'
    const lastName = professional?.lastName || 'Professional'
    return `${firstName} ${lastName}`
}

/**
 * Get specialty display text
 * @param {Object} professional - Professional data object
 * @returns {string} - Specialty or default text
 */
export function getSpecialty(professional) {
    return professional?.specialty || professional?.category || 'Photographer'
}

/**
 * Get location display text
 * @param {Object} professional - Professional data object
 * @returns {string} - Location string
 */
export function getLocation(professional) {
    if (professional?.distance) {
        return `${professional.distance.toFixed(1)} mi away`
    }

    if (typeof professional?.location === 'string') {
        return professional.location
    }

    if (professional?.baseCity) {
        return professional.baseCity
    }

    return 'Nearby'
}
