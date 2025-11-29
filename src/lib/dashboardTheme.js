import { theme } from './theme'

export const dashboardTheme = {
  colors: {
    // Primary Brand - Violet
    primary: {
      900: '#3D2E7A',
      800: '#4A3A8A',
      700: '#5A4A9A',
      600: '#6C63FF',
      500: '#7D74FF',
      400: '#8E85FF',
      300: '#AFA8FF',
      200: '#D4CEFF',
      100: '#E8E5FF',
      50: '#F5F3FF',
    },
    
    // Accent - Gold
    accent: {
      900: '#8B6F00',
      800: '#A68200',
      700: '#C49500',
      600: '#FFB800',
      500: '#FFC933',
      400: '#FFD966',
      300: '#FFE699',
      200: '#FFF0CC',
      100: '#FFF8E6',
      50: '#FFFBF0',
    },
    
    // Neutral - Dashboard foundation
    neutral: {
      white: '#FFFFFF',
      black: '#1A1A1A',
      border: '#E4E4E7',
      gray: {
        50: '#F7F7F9',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },
    
    // Sidebar
    sidebar: {
      bg: '#101015',
      text: '#FFFFFF',
      textSecondary: '#A0A0A0',
      border: '#2A2A2F',
    },
    
    // Navigation
    nav: {
      activeBg: '#6C63FF',
      activeText: '#FFFFFF',
      inactiveText: '#A0A0A0',
      inactiveBg: 'transparent',
      activeIndicator: '#FFB800',
    },
    
    // Main Content
    main: {
      bg: '#F7F7F9',
      text: '#1A1A1A',
    },
    
    // Cards
    card: {
      bg: '#FFFFFF',
      border: '#E4E4E7',
    },
    
    // Text
    text: {
      primary: '#1A1A1A',
      secondary: '#6A6A6A',
    },
    
    // Status
    status: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  spacing: theme.spacing,
  
  typography: theme.typography,
  
  borderRadius: theme.borderRadius,
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
}
