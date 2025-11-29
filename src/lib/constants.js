export const USER_TYPES = {
  CLIENT: 'client',
  PHOTOGRAPHER: 'photographer',
  ADMIN: 'admin'
}

export const PHOTOGRAPHY_TYPES = {
  WEDDING: 'wedding',
  PORTRAIT: 'portrait',
  EVENT: 'event',
  COMMERCIAL: 'commercial',
  FAMILY: 'family',
  MATERNITY: 'maternity',
  NEWBORN: 'newborn'
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const PRICE_RANGES = [
  { label: 'Any Price', value: null },
  { label: '$0 - $500', value: [0, 500] },
  { label: '$500 - $1000', value: [500, 1000] },
  { label: '$1000 - $2000', value: [1000, 2000] },
  { label: '$2000+', value: [2000, null] }
]