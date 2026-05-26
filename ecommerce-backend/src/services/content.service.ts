import Content from '../models/content.model.js';

export const getMainContent = async () => {
  const record = await Content.findOne({ key: 'main' }).lean();
  return record?.data || null;
};
