import { generateResponse } from '../services/assistantService.js';

export const queryAssistant = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a query' });
    }

    const response = await generateResponse(query);

    res.json({
      query,
      response
    });
  } catch (error) {
    next(error);
  }
};
