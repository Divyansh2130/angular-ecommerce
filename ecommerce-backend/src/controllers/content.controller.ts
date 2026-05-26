import { getMainContent } from '../services/content.service.js';

export const fetchContent = async (req, res) => {
  try {
    const data = await getMainContent();

    if (!data) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    return res.status(200).json({
      success: true,
      content: data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch content' });
  }
};
