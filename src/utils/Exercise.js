/**
 * Exercise class representing a grammar exercise
 */
class Exercise {
  /**
   * Create a new Exercise
   * @param {object} exerciseData - The exercise data
   * @param {string} exerciseData.type - The type of exercise (e.g., "选择题", "填空题", "应用题")
   * @param {string} exerciseData.content - The content/question of the exercise
   * @param {string} exerciseData.answer - The correct answer
   * @param {Array<string>} [exerciseData.options] - Optional array of options for multiple choice questions
   */
  constructor(exerciseData) {
    this.type = exerciseData.type || '';
    this.content = exerciseData.content || '';
    this.answer = exerciseData.answer || '';
    this.options = exerciseData.options || null;
    this.userAnswer = null;
    this.isCorrect = null;
    this.explanation = null;
  }

  /**
   * Check if the user's answer is correct
   * @returns {boolean} True if the answer is correct, false otherwise
   */
  checkAnswer() {
    if (!this.userAnswer) {
      return false;
    }

    switch (this.type) {
      case '选择题':
        this.isCorrect = this.userAnswer.trim().toUpperCase() === this.answer.trim().toUpperCase();
        break;
      case '填空题':
        // Handle multiple blanks separated by semicolons
        const correctAnswers = this.answer.split(';').map(ans => ans.trim());
        const userAnswers = this.userAnswer.split(';').map(ans => ans.trim());
        
        // If the number of answers doesn't match, it's wrong
        if (correctAnswers.length !== userAnswers.length) {
          this.isCorrect = false;
        } else {
          // Check each answer
          this.isCorrect = correctAnswers.every((correctAns, index) => 
            correctAns.toLowerCase() === userAnswers[index].toLowerCase());
        }
        break;
      case '应用题':
        // For application exercises, validation is done through the API
        // So we'll just return null here, and it will be updated after API validation
        this.isCorrect = null;
        break;
      default:
        this.isCorrect = false;
    }

    return this.isCorrect;
  }
}

export default Exercise;