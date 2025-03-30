import Unit from './Unit';

/**
 * UnitManager class for loading and managing grammar units
 */
class UnitManager {
  /**
   * Create a new UnitManager
   */
  constructor() {
    this.units = [];
    this.loaded = false;
  }

  /**
   * Load units from the JSON data file
   * @returns {Promise<void>}
   */
  async loadUnits() {
    if (this.loaded) {
      return;
    }

    try {
      // Use relative path for GitHub Pages compatibility
      const response = await fetch('./data/grammarPoints.json');
      if (!response.ok) {
        throw new Error(`Failed to load grammar points: ${response.status}`);
      }

      const data = await response.json();
      this.units = (data.units || []).map(unitData => new Unit(unitData));
      this.loaded = true;
    } catch (error) {
      console.error('Error loading grammar units:', error);
      throw error;
    }
  }

  /**
   * Get a unit by its name
   * @param {string} unitName - The name of the unit to get (e.g., "Unit 1")
   * @returns {Unit|undefined} The unit with the given name, or undefined if not found
   */
  getUnitByName(unitName) {
    return this.units.find(unit => unit.unitName === unitName);
  }

  /**
   * Get all units
   * @returns {Array<Unit>} Array of all units
   */
  getAllUnits() {
    return [...this.units];
  }
}

export default UnitManager;