/**
 * WeaknessManager class for tracking and managing user's weak grammar points
 */
class WeaknessManager {
  /**
   * Create a new WeaknessManager
   */
  constructor() {
    this.weakPoints = [];
    this.loadFromLocalStorage();
  }

  /**
   * Add a grammar point to the weak points list
   * @param {string} grammarPoint - The grammar point content to add
   */
  addWeakPoint(grammarPoint) {
    // Check if this grammar point is already a weak point
    const existingIndex = this.weakPoints.findIndex(
      wp => wp.grammarPoint === grammarPoint
    );

    if (existingIndex >= 0) {
      // If it exists, increase the error count
      this.weakPoints[existingIndex].errorCount++;
      this.weakPoints[existingIndex].lastPracticeDate = new Date();
    } else {
      // If it doesn't exist, add it
      this.weakPoints.push({
        grammarPoint,
        errorCount: 1,
        lastPracticeDate: new Date()
      });
    }

    // Save to localStorage
    this.saveToLocalStorage();
  }

  /**
   * Remove a grammar point from the weak points list
   * @param {string} grammarPoint - The grammar point content to remove
   */
  removeWeakPoint(grammarPoint) {
    const initialLength = this.weakPoints.length;
    this.weakPoints = this.weakPoints.filter(wp => wp.grammarPoint !== grammarPoint);
    
    if (this.weakPoints.length !== initialLength) {
      this.saveToLocalStorage();
    }
  }

  /**
   * Remove multiple grammar points from the weak points list
   * @param {Array<string>} grammarPoints - Array of grammar point content to remove
   */
  removeMultipleWeakPoints(grammarPoints) {
    if (!grammarPoints || grammarPoints.length === 0) return;
    
    const initialLength = this.weakPoints.length;
    this.weakPoints = this.weakPoints.filter(wp => !grammarPoints.includes(wp.grammarPoint));
    
    if (this.weakPoints.length !== initialLength) {
      this.saveToLocalStorage();
    }
  }

  /**
   * Get all weak points
   * @returns {Array<object>} Array of weak point objects
   */
  getWeakPoints() {
    return [...this.weakPoints].sort((a, b) => b.errorCount - a.errorCount);
  }

  /**
   * Check if a grammar point is in the weak points list
   * @param {string} grammarPoint - The grammar point content to check
   * @returns {boolean} True if it's a weak point, false otherwise
   */
  isWeakPoint(grammarPoint) {
    return this.weakPoints.some(wp => wp.grammarPoint === grammarPoint);
  }

  /**
   * Save weak points to localStorage
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('grammar_weak_points', JSON.stringify(this.weakPoints));
    } catch (error) {
      console.error('Failed to save weak points to localStorage:', error);
    }
  }

  /**
   * Load weak points from localStorage
   */
  loadFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('grammar_weak_points');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Convert date strings back to Date objects
        this.weakPoints = parsedData.map(wp => ({
          ...wp,
          lastPracticeDate: new Date(wp.lastPracticeDate)
        }));
      }
    } catch (error) {
      console.error('Failed to load weak points from localStorage:', error);
      this.weakPoints = [];
    }
  }

  /**
   * Reset the error count for a specific grammar point
   * @param {string} grammarPoint - The grammar point to reset
   */
  resetErrorCount(grammarPoint) {
    const weakPoint = this.weakPoints.find(wp => wp.grammarPoint === grammarPoint);
    if (weakPoint) {
      weakPoint.errorCount = 0;
      weakPoint.lastPracticeDate = new Date();
      this.saveToLocalStorage();
    }
  }
}

export default WeaknessManager;