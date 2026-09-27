const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeIssue = async (title, description) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

  const prompt = `You are a senior software engineer helping a developer break down a bug report or feature request into actionable investigation steps.

Issue title: "${title}"
Issue description: "${description || 'No description provided.'}"

Respond with ONLY valid JSON, no markdown formatting, no code fences, no extra text — just the raw JSON object, matching exactly this shape:

{
  "investigationAreas": ["area 1", "area 2", "area 3"],
  "suggestedTasks": ["sub-task 1", "sub-task 2", "sub-task 3", "sub-task 4"]
}

Rules:
- investigationAreas: 3-4 short phrases (a few words each) naming likely root-cause areas to look into, specific to this exact issue, not generic advice.
- suggestedTasks: 3-5 short, concrete, actionable sub-tasks a developer could create and check off, specific to this exact issue.
- Do not include any text outside the JSON object.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Gemini sometimes wraps JSON in markdown code fences despite instructions —
  // strip them defensively before parsing
  const cleaned = responseText.replace(/```json\n?|```\n?/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI returned an unexpected response format');
  }
};

module.exports = { analyzeIssue };