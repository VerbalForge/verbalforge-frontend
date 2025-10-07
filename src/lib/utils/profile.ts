/**
 * Shared utility functions for the application
 */

/**
 * Get user initials from full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get rank name based on rank number
 */
export function getRankName(rank: number): string {
  if (rank >= 2000) return 'Legend';
  if (rank >= 1500) return 'Master';
  if (rank >= 1000) return 'Expert';
  if (rank >= 500) return 'Advanced';
  if (rank >= 100) return 'Intermediate';
  return 'Beginner';
}

/**
 * Get rank color class based on rank number
 */
export function getRankColor(rank: number): string {
  const rankName = getRankName(rank);
  switch (rankName) {
    case 'Legend': return 'bg-purple-500 text-white';
    case 'Master': return 'bg-red-500 text-white';
    case 'Expert': return 'bg-orange-500 text-white';
    case 'Advanced': return 'bg-blue-500 text-white';
    case 'Intermediate': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

/**
 * Format time ago from a date string
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
  switch (difficulty) {
    case 'Easy': return 'bg-green-500';
    case 'Medium': return 'bg-yellow-500';
    case 'Hard': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}
