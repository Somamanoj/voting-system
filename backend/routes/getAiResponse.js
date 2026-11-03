const express = require("express");
const router = express.Router();
const Election = require("../models/election");
const Candidate = require("../models/candidate");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

router.post("/getAiResponse", async (req, res) => {
  try {
    const { userInput } = req.body;

    // Fetch all elections
    const elections = await Election.find({})
      .populate('candidates')
      .select('title description candidates');

    // Fetch all candidates
    const candidates = await Candidate.find({})
      .select('name partyName manifesto');

    // Prepare addOnPrompt
    const addOnPrompt = `
You are a helpful AI assistant designed to match voters with the most suitable election candidates based on their specific needs and interests.

Your task is to:
1. Carefully analyze the user's input
2. Identify their key priorities and concerns
3. Recommend the most appropriate candidate(s) 
4. Provide clear, concise reasoning for your recommendation
5. Don't ask any questions to user, direcly answer
6. If user ask questions out of box, then answer it properly by using your own brain

Guidelines:
- Be direct and specific
- Focus on matching the user's needs with candidate strengths
- Provide practical, actionable advice
- Explain why a particular candidate is the best fit

Available Elections and Candidates Context:
${elections.map(election => `
Election: ${election.title}
Description: ${election.description}
Candidates: ${election.candidates.map(c => `
- Name: ${c.name}
- Party: ${c.partyName}
- Manifesto Key Points: ${c.manifesto}
`).join('')}
`).join('\n\n')}

User Input: ${userInput}

Your Response Should:
- Directly answer which candidate is best
- Explain why they match the user's needs
- Be clear, concise, and helpful
`;

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate response
    const result = await model.generateContent(addOnPrompt);
    const responseText = await result.response.text();

    res.status(200).json({ response: responseText });

  } catch {
    console.error('AI response generation failed');
    res.status(500).json({
      error: 'An error occurred while processing your request'
    });
  }
});

module.exports = router;