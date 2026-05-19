export const logActivity = (actionText) => {
  try {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
      text: actionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString()
    });
    // Keep last 8 activities
    localStorage.setItem('activities', JSON.stringify(activities.slice(0, 8)));
    
    // Dispatch custom event to let Dashboard know it needs to refresh
    window.dispatchEvent(new Event('activityUpdated'));
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const toggleBookmark = (post) => {
  try {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isBookmarked = bookmarks.some(b => b._id === post._id);
    
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(b => b._id !== post._id);
      logActivity(`Unsaved opportunity: "${post.title}"`);
    } else {
      updated = [...bookmarks, post];
      logActivity(`Saved opportunity: "${post.title}"`);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarksUpdated'));
    return !isBookmarked;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return false;
  }
};
