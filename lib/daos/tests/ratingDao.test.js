import { resetAndMockDB } from '@utils/testUtils';

const ratingAttributes = ['id', 'rating', 'comment'];
const mockRating = { id: 1, rating: 5, comment: 'test' };

describe('rating dao', () => {
  describe('createRating', () => {
    it('should create a rating', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.ratings, 'create')
          .mockImplementation(() => Promise.resolve(mockRating));
      });

      const { createRating } = require('@daos/ratingDao');
      const rating = await createRating({ rating: 5, comment: 'test' });

      expect(spy).toHaveBeenCalledWith({ rating: 5, comment: 'test' }, {});
      expect(rating).toEqual(mockRating);
    });
  });

  describe('updateRating', () => {
    it('should update a rating', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.ratings, 'update')
          .mockImplementation(() => Promise.resolve(mockRating));
      });

      const { updateRating } = require('@daos/ratingDao');
      const ratingProps = { id: 1, rating: 5, comment: 'test' };
      const rating = await updateRating(ratingProps);

      expect(spy).toHaveBeenCalledWith(ratingProps, {
        where: { id: ratingProps.id },
      });
      expect(rating).toEqual(mockRating);
    });
  });

  describe('findAllRatings', () => {
    it('should find all ratings', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.ratings, 'findAll')
          .mockImplementation(() => Promise.resolve([mockRating]));
      });

      const { findAllRatings } = require('@daos/ratingDao');
      const ratings = await findAllRatings({});

      expect(spy).toHaveBeenCalledWith({}, { attributes: ratingAttributes });
      expect(ratings).toEqual([mockRating]);
      expect(Object.keys(ratings[0])).toEqual(ratingAttributes);
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.ratings, 'destroy')
          .mockImplementation(() => Promise.resolve({ id: 1 }));
      });

      const { deleteRating } = require('@daos/ratingDao');
      const rating = await deleteRating(1);

      expect(spy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(rating).toEqual({ id: 1 });
    });
  });

  describe('getRatingsByUserId', () => {
    it('should get ratings by user id', async () => {
      let spy;
      await resetAndMockDB((db) => {
        spy = jest
          .spyOn(db.models.ratings, 'findAll')
          .mockImplementation(() => Promise.resolve([mockRating]));
      });

      const { getRatingsByUserId } = require('@daos/ratingDao');
      const result = await getRatingsByUserId(1);

      expect(spy).toHaveBeenCalledWith({
        where: { userId: 1 },
        attributes: ratingAttributes,
      });
      expect(result).toEqual({
        ratings: [mockRating],
        avgRating: 5,
      });
    });
  });
});
