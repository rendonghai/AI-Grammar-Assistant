/**
 * API Service for interacting with the AI grammar teaching assistant backend
 * Provides functions for generating exercises, correcting answers, and explaining mistakes
 */
class ApiService {
  /**
   * Base URL for the API endpoints
   * Note: In a production environment, these would be environment variables
   */
  static API_BASE_URL = 'https://agentapi.baidu.com/assistant';
  static EXERCISE_GEN_APP_ID = 'NA40PCgLFeMUrhekrMDVoKIG6V5xGSay';
  static EXERCISE_GEN_SECRET_KEY = 'k5Bk8FTaEkWHzjX2BGCzkZrSaPekyTsk';
  static EXERCISE_EXPLANATION_APP_ID = 'yfEFt44jJ9snY1eawuHTVpVwSmHFT3Z8';
  static EXERCISE_EXPLANATION_SECRET_KEY = 'k3zFP3epBFX1AU6PcfEBuxGaRB4McmI2';
  static EXERCISE_CORRECTION_APP_ID = 'IgBro6fUZMYxh7RDtOzWBz88RJb1uEOl';
  static EXERCISE_CORRECTION_SECRET_KEY = 'PYc94DtdxH0d3cOI9ceNKyGawacjDVJi';

  /**
   * Generate exercises based on a grammar point
   * @param {object} params - Parameters for generating exercises
   * @param {string} params.grammarPoint - The grammar point to generate exercises for
   * @param {number} params.count - The number of exercises to generate
   * @returns {Promise<object>} - A promise resolving to the generated exercises
   */
  static async generateExercises(params) {
    const { grammarPoint, count } = params;
    // Sanitize the grammar point to handle special characters
    const sanitizedGrammarPoint = grammarPoint.trim();
    
    const requestBody = {
      message: {
        content: {
          type: 'text',
          value: {
            showText: JSON.stringify({
              "语法点内容": sanitizedGrammarPoint,
              "出题数量": count
            })
          }
        }
      },
      source: 'web',
      from: 'openapi',
      openId: 'web_user'
    };

    try {
      const response = await fetch(`${this.API_BASE_URL}/getAnswer?appId=${this.EXERCISE_GEN_APP_ID}&secretKey=${this.EXERCISE_GEN_SECRET_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 0 || !data.data || !data.data.content || !data.data.content[0]) {
        throw new Error('Invalid response from exercise generation API');
      }

      try {
        // Parse the JSON string from the API response
        const jsonStr = data.data.content[0].data;
        // Extract JSON content from potential markdown code blocks or plain text
        const jsonMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/) || 
                         jsonStr.match(/```([\s\S]*?)```/) || 
                         jsonStr.match(/{[\s\S]*}/); 

        const jsonContent = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : jsonStr;
        
        // Clean the JSON string if needed (remove markdown artifacts)
        const cleanedJson = jsonContent.replace(/^```json\s*|\s*```$/g, '').trim();
        
        const result = JSON.parse(cleanedJson);
        console.log('Parsed exercise data:', result);
        
        // Validate the structure of the response
        if (!result.exercises || !Array.isArray(result.exercises)) {
          throw new Error('Invalid exercise data structure');
        }
        
        return result;
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        console.error('Raw response data:', data.data.content[0].data);
        throw new Error('Invalid response format from exercise generation API');
      }
    } catch (error) {
      console.error('Error generating exercises:', error);
      // Provide more specific error message based on the error type
      if (error.message.includes('JSON')) {
        throw new Error('Failed to process API response. Please try again.');
      } else {
        throw error;
      }
    }
  }

  /**
   * Correct an application exercise by calling the AI agent
   * @param {object} params - Parameters for correcting the exercise
   * @param {string} params.grammarPoint - The grammar point of the exercise
   * @param {string} params.content - The exercise content
   * @param {string} params.standardAnswer - The standard answer
   * @param {string} params.userAnswer - The user's answer
   * @returns {Promise<object>} - A promise resolving to the correction result
   */
  static async correctExercise(params) {
    const { grammarPoint, content, standardAnswer, userAnswer } = params;
    const requestBody = {
      message: {
        content: {
          type: 'text',
          value: {
            showText: JSON.stringify({
              "语法点内容": grammarPoint,
              "题目内容": content,
              "标准答案": standardAnswer,
              "用户答案": userAnswer
            })
          }
        }
      },
      source: 'web',
      from: 'openapi',
      openId: 'web_user'
    };

    try {
      const response = await fetch(`${this.API_BASE_URL}/getAnswer?appId=${this.EXERCISE_CORRECTION_APP_ID}&secretKey=${this.EXERCISE_CORRECTION_SECRET_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 0 || !data.data || !data.data.content || !data.data.content[0]) {
        throw new Error('Invalid response from exercise correction API');
      }

      // Parse the JSON string from the API response
      const correctionText = data.data.content[0].data;
      console.log('Raw correction response:', correctionText);
      
      // Extract JSON content from potential markdown code blocks
      const jsonMatch = correctionText.match(/```json\n([\s\S]*?)\n```/) || 
                      correctionText.match(/```([\s\S]*?)```/) || 
                      correctionText.match(/{[\s\S]*}/) ||
                      { 0: correctionText };
      
      let jsonText = jsonMatch[1] || jsonMatch[0];
      // Clean the JSON string if needed
      jsonText = jsonText.replace(/^```json\s*|\s*```$/g, '').trim();
      
      // Handle potential comma issues in JSON
      if (jsonText.endsWith(',}')) {
        jsonText = jsonText.replace(',}', '}');
      }
      
      try {
        const result = JSON.parse(jsonText);
        console.log('Parsed correction result:', result);
        return result;
      } catch (jsonError) {
        console.error('Failed to parse JSON from correction API:', jsonError);
        // Return a default result based on a simple match
        const isLikelyCorrect = userAnswer.toLowerCase().includes(standardAnswer.toLowerCase()) || 
                              standardAnswer.toLowerCase().includes(userAnswer.toLowerCase());
        return {
          correctness: isLikelyCorrect ? 'Y' : 'N',
          explanation: '无法获取详细解析，但系统已评估您的答案。'
        };
      }
    } catch (error) {
      console.error('Error correcting exercise:', error);
      // Return a default response rather than throwing the error
      // This ensures UI does not crash
      return {
        correctness: 'N',
        explanation: '评分过程中发生错误，请重试。'
      };
    }
  }

  /**
   * Get an explanation for an exercise the user got wrong
   * @param {object} params - Parameters for explaining the exercise
   * @param {string} params.grammarPoint - The grammar point of the exercise
   * @param {object} params.exercise - The exercise object
   * @param {string} params.userAnswer - The user's answer
   * @returns {Promise<string>} - A promise resolving to the explanation text
   */
  static async explainExercise(params) {
    const { grammarPoint, exercise, userAnswer } = params;
    const requestBody = {
      message: {
        content: {
          type: 'text',
          value: {
            showText: JSON.stringify({
              "语法点内容": grammarPoint,
              "错题题目": JSON.stringify(exercise),
              "标准答案": exercise.answer,
              "用户答案": userAnswer
            })
          }
        }
      },
      source: 'web',
      from: 'openapi',
      openId: 'web_user'
    };

    try {
      let explanation = '';
      const response = await fetch(`${this.API_BASE_URL}/conversation?appId=${this.EXERCISE_EXPLANATION_APP_ID}&secretKey=${this.EXERCISE_EXPLANATION_SECRET_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // The response is a stream of server-sent events
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);
        
        for (const event of events) {
          if (event.startsWith('event:message')) {
            const dataLine = event.split('\n').find(line => line.startsWith('data:'));
            if (dataLine) {
              try {
                const jsonData = JSON.parse(dataLine.substring(5));
                if (jsonData.data && 
                    jsonData.data.message && 
                    jsonData.data.message.content && 
                    jsonData.data.message.content[0] && 
                    jsonData.data.message.content[0].data && 
                    jsonData.data.message.content[0].data.text) {
                  explanation += jsonData.data.message.content[0].data.text;
                }
              } catch (e) {
                // Skip invalid JSON or missing data
              }
            }
          }
        }
      }
      
      return explanation || '暂无解析';
    } catch (error) {
      console.error('Error explaining exercise:', error);
      return '获取解析失败，请重试';
    }
  }

  /**
   * Helper method for making API requests
   * @param {string} endpoint - The API endpoint to call
   * @param {object} params - The parameters to send
   * @returns {Promise<object>} - A promise resolving to the API response
   */
  static async request(endpoint, params) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }
}

export default ApiService;
