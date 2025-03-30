import ApiService from '../services/apiService';
import Exercise from './Exercise';

/**
 * ExerciseSession class for managing a set of exercises for practice
 */
class ExerciseSession {
  /**
   * Create a new ExerciseSession
   * @param {Array<object>} exercises - Array of exercise data objects
   * @param {string} grammarPoint - The grammar point content for this session
   */
  constructor(exercises, grammarPoint) {
    this.exercises = exercises.map(exerciseData => new Exercise(exerciseData));
    this.currentIndex = 0;
    this.grammarPoint = grammarPoint;
    this.completed = false;
    this.results = {
      correct: 0,
      total: this.exercises.length,
      incorrectExercises: []
    };
  }

  /**
   * Get the current exercise
   * @returns {Exercise} The current exercise
   */
  getCurrentExercise() {
    return this.exercises[this.currentIndex];
  }

  /**
   * Move to the next exercise
   * @returns {boolean} True if there is a next exercise, false otherwise
   */
  goToNextExercise() {
    if (this.currentIndex < this.exercises.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  /**
   * Move to the previous exercise
   * @returns {boolean} True if there is a previous exercise, false otherwise
   */
  goToPrevExercise() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  /**
   * Submit all answers for correction
   * @returns {Promise<object>} A promise resolving to the session results
   */
  async submitAnswers() {
    for (const exercise of this.exercises) {
      // Skip exercises that have already been corrected
      if (exercise.isCorrect !== null) {
        continue;
      }

      // For objective exercises (multiple choice, fill in the blank)
      if (exercise.type === '选择题' || exercise.type === '填空题') {
        exercise.checkAnswer();
      }
      // For application exercises, use the API to validate
      else if (exercise.type === '应用题') {
        try {
          const result = await ApiService.correctExercise({
            grammarPoint: this.grammarPoint,
            content: exercise.content,
            standardAnswer: exercise.answer,
            userAnswer: exercise.userAnswer || ''
          });
          
          exercise.isCorrect = result.correctness === 'Y';
          exercise.explanation = result.explanation || '';
        } catch (error) {
          console.error('Error validating application exercise:', error);
          exercise.isCorrect = false;
          exercise.explanation = '评分失败，请重试';
        }
      }
    }

    // Calculate results
    this.results.correct = this.exercises.filter(ex => ex.isCorrect).length;
    this.results.incorrectExercises = this.exercises.filter(ex => !ex.isCorrect);
    this.completed = true;

    // Get explanations for incorrect exercises
    await this.explainIncorrectExercises();

    return this.results;
  }

  /**
   * Get explanations for incorrect exercises
   * @returns {Promise<void>}
   */
  async explainIncorrectExercises() {
    const incorrectExercises = this.exercises.filter(ex => !ex.isCorrect);
    
    for (const exercise of incorrectExercises) {
      // Skip if we already have an explanation
      if (exercise.explanation) {
        continue;
      }

      try {
        exercise.explanation = await ApiService.explainExercise({
          grammarPoint: this.grammarPoint,
          exercise: {
            type: exercise.type,
            content: exercise.content,
            answer: exercise.answer,
            options: exercise.options
          },
          userAnswer: exercise.userAnswer || ''
        });
      } catch (error) {
        console.error('Error getting explanation:', error);
        exercise.explanation = '无法获取解析，请重试';
      }
    }
  }

  /**
   * Set the answer for the current exercise
   * @param {string} answer - The user's answer
   */
  setCurrentAnswer(answer) {
    const currentExercise = this.getCurrentExercise();
    if (currentExercise) {
      currentExercise.userAnswer = answer;
    }
  }

  /**
   * Check if all exercises have answers
   * @returns {boolean} True if all exercises have answers, false otherwise
   */
  areAllAnswered() {
    return this.exercises.every(exercise => 
      exercise.userAnswer !== null && exercise.userAnswer !== ''
    );
  }
}

export default ExerciseSession;