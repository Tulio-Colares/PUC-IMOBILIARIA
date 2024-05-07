import List from '../models/list.js';

export const createList = async (req, res, next) => {
  try {
    const list = await List.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};