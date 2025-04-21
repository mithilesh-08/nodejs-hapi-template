import { models } from '@models';

const ratingAttributes = ['id', 'rating', 'comment'];

export const createRating = async (ratingProps, options = {}) => {
  const rating = await models.ratings.create(ratingProps, options);
  return rating;
};

export const updateRating = async (ratingProps, options = {}) => {
  const rating = await models.ratings.update(ratingProps, {
    where: { id: ratingProps.id },
    ...options,
  });
  return rating;
};

export const findAllRatings = async (options = {}) => {
  const ratings = await models.ratings.findAll(options, {
    attributes: ratingAttributes,
  });
  return ratings;
};

export const deleteRating = async (id) => {
  const rating = await models.ratings.destroy({ where: { id } });
  return rating;
};

export const getRatingsByUserId = async (userId) => {
  const ratings = await models.ratings.findAll({
    where: { userId },
    attributes: ratingAttributes,
  });
  let totalRating = 0;
  ratings.forEach((rating) => {
    totalRating += rating.rating;
  });
  return { ratings, avgRating: totalRating / ratings.length };
};
