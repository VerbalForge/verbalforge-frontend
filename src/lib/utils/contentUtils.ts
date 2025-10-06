/**
 * Checks if content was created/published within the last 24 hours
 * All timestamps are handled in UTC to avoid timezone issues
 * @param timestamp - ISO date string or timestamp in UTC format
 * @returns true if content is less than 24 hours old
 */
export const isNewContent = (timestamp: string): boolean => {
  if (!timestamp) {
    return false;
  }
  
  const contentDate = new Date(timestamp);
  const now = new Date();
  
  // Use getTime() which returns milliseconds since epoch in UTC
  // This ensures consistent comparison regardless of local timezone
  const diffInHours = (now.getTime() - contentDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
};
