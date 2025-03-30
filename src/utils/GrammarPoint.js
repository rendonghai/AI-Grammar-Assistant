import ApiService from '../services/apiService';

/**
 * GrammarPoint class representing a grammar point with its content and examples
 */
class GrammarPoint {
  /**
   * Create a new GrammarPoint
   * @param {string} content - The content describing the grammar point
   * @param {Array<string>} [examples=[]] - Example sentences demonstrating the grammar point
   */
  constructor(content, examples = []) {
    this.content = content;
    this.examples = examples;
  }

  /**
   * Generate exercises based on this grammar point
   * @param {number} count - The number of exercises to generate
   * @returns {Promise<Array<object>>} A promise resolving to an array of exercise objects
   */
  async generateExercises(count) {
    try {
      const result = await ApiService.generateExercises({
        grammarPoint: this.content,
        count
      });
      
      // Ensure all exercises have the correct properties before returning
      const validatedExercises = (result.exercises || []).map(exercise => {
        // Sanitize exercise data
        const sanitizedExercise = {
          type: exercise.type || '填空题',
          content: exercise.content || '',
          answer: exercise.answer || ''
        };
        
        // Add options if it's a multiple choice question
        if (exercise.type === '选择题' && Array.isArray(exercise.options)) {
          sanitizedExercise.options = exercise.options;
        }
        
        // Special handling for application questions
        if (exercise.type === '应用题') {
          // Ensure content includes clear instructions
          if (!sanitizedExercise.content.includes('根据语法点')) {
            sanitizedExercise.content = `根据语法点要求，完成以下题目：\n${sanitizedExercise.content}`;
          }
        }
        
        return sanitizedExercise;
      });
      
      return validatedExercises;
    } catch (error) {
      console.error('Error generating exercises:', error);
      throw error;
    }
  }
}

export default GrammarPoint;