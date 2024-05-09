import List from '../models/list.js';
import { errorHandler } from '../utils/error.js';

export const createList = async (req, res, next) => {
  try {
    const list = await List.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteList = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listagem não encontrada'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Você só pode deletar suas própriaslistagens!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listagem deletada!');
  } catch (error) {
    next(error);
  }
};

export const updateList = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listagem não encontrada'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Você só pode deletar suas próprias listagens'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};