import { resetAndMockDB } from '@utils/testUtils';
import { Op } from 'sequelize';

describe('Payment DAO', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('createPayment', () => {
    it('should create a payment with correct properties', async () => {
      await resetAndMockDB();
      const { createPayment } = require('@daos/paymentDao');

      const paymentProps = {
        tripId: 1,
        driverId: 3,
        riderId: 2,
        vehicleId: 4,
        amount: 50.75,
        status: 'completed',
      };

      const payment = await createPayment(paymentProps);

      // Verify the returned data structure
      expect(payment).toBeDefined();
      expect(payment).toHaveProperty('id');
      expect(payment).toHaveProperty('tripId', paymentProps.tripId);
      expect(payment).toHaveProperty('driverId', paymentProps.driverId);
      expect(payment).toHaveProperty('riderId', paymentProps.riderId);
      expect(payment).toHaveProperty('vehicleId', paymentProps.vehicleId);
      expect(payment).toHaveProperty('amount', paymentProps.amount);
      expect(payment).toHaveProperty('status', paymentProps.status);
    });
  });

  describe('findPayments', () => {
    it('should find payments by tripId', async () => {
      await resetAndMockDB();
      const { findPayments } = require('@daos/paymentDao');

      const tripId = 1;
      const result = await findPayments({ tripId });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('id');
      expect(result.rows[0]).toHaveProperty('tripId', tripId);
    });

    it('should accept options parameter', async () => {
      await resetAndMockDB();
      const { findPayments } = require('@daos/paymentDao');

      const where = {
        status: 'completed',
      };
      const options = {
        order: [['createdAt', 'DESC']],
        limit: 5,
      };

      const result = await findPayments(where, 1, 10, options);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('status', where.status);
    });

    it('should find payments by multiple criteria', async () => {
      await resetAndMockDB();
      const { findPayments } = require('@daos/paymentDao');

      const where = {
        driverId: 3,
        riderId: 2,
        amount: {
          [Op.gte]: 30,
        },
      };

      const result = await findPayments(where);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('driverId', where.driverId);
      expect(result.rows[0]).toHaveProperty('riderId', where.riderId);
      expect(result.rows[0]).toHaveProperty('amount');
    });
  });

  describe('getPaymentById', () => {
    it('should get a payment by id', async () => {
      await resetAndMockDB();
      const { getPaymentById } = require('@daos/paymentDao');

      const id = 1;
      const payment = await getPaymentById(id);

      expect(payment).toBeDefined();
      expect(payment).toHaveProperty('id', id);
      expect(payment).toHaveProperty('tripId');
      expect(payment).toHaveProperty('amount');
      expect(payment).toHaveProperty('status');
    });

    it('should accept options parameter', async () => {
      await resetAndMockDB();
      const { getPaymentById } = require('@daos/paymentDao');

      const id = 1;
      const options = {
        attributes: ['id', 'status', 'amount'],
      };

      const payment = await getPaymentById(id, options);

      expect(payment).toBeDefined();
      expect(payment).toHaveProperty('id', id);
    });
  });

  describe('updatePayment', () => {
    it('should update a payment', async () => {
      await resetAndMockDB();
      const { updatePayment } = require('@daos/paymentDao');

      const id = 1;
      const paymentProps = {
        status: 'refunded',
        transactionId: 'txn_refund_123',
      };

      const result = await updatePayment(id, paymentProps);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe(1); // rows affected
    });
  });

  describe('deletePayment', () => {
    it('should delete a payment', async () => {
      await resetAndMockDB();
      const { deletePayment } = require('@daos/paymentDao');

      const id = 1;
      const result = await deletePayment(id);

      expect(result).toBe(1); // rows deleted
    });
  });

  describe('getPaymentsByTripId', () => {
    it('should get payments by trip id', async () => {
      await resetAndMockDB();
      const { getPaymentsByTripId } = require('@daos/paymentDao');

      const tripId = 1;
      const result = await getPaymentsByTripId(tripId);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('tripId', tripId);
    });

    it('should accept options parameter', async () => {
      await resetAndMockDB();
      const { getPaymentsByTripId } = require('@daos/paymentDao');

      const tripId = 1;
      const options = {
        order: [['createdAt', 'DESC']],
        limit: 1,
      };

      const result = await getPaymentsByTripId(tripId, 1, 10, options);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('rows');
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('tripId', tripId);
    });
  });
});
