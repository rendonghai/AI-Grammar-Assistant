/**
 * Unit class representing a teaching unit with its grammar points
 */
class Unit {
  /**
   * Create a new Unit
   * @param {object} unitData - The unit data object
   * @param {string} unitData.unit - The unit identifier (e.g., "Unit 1")
   * @param {string} unitData.unit_title - The title of the unit
   * @param {Array<string>} unitData.grammar_points - Array of grammar point content strings
   */
  constructor(unitData) {
    this.unitName = unitData.unit || '';
    this.unitTitle = unitData.unit_title || '';
    this.grammarPoints = (unitData.grammar_points || []).map(content => {
      return {
        content,
        examples: this.extractExamplesFromContent(content)
      };
    });
  }

  /**
   * Extract examples from grammar point content
   * @param {string} content - The grammar point content
   * @returns {Array<string>} Array of example strings
   */
  extractExamplesFromContent(content) {
    const examples = [];
    // Look for patterns like "example: text" or "例如：text" or "例如:text"
    const exampleMatches = content.match(/例如[:：]([^.。]*[.。])|example:([^.。]*[.。])/gi);
    
    if (exampleMatches) {
      exampleMatches.forEach(match => {
        // Extract the example text after the "例如:" or "example:"
        const exampleText = match.replace(/例如[:：]|example:/i, '').trim();
        if (exampleText) {
          examples.push(exampleText);
        }
      });
    }
    
    return examples;
  }
}

export default Unit;