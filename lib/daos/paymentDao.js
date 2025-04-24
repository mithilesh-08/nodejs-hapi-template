import { models } from '@models';

const paymentAttributes = [
  'id',
  'tripId',
  'driverId',
  'riderId',
  'vehicleId',
  'amount',
  'status',
  'transactionId',
  'paidAt',
  'createdAt',
  'updatedAt',
];

export const createPayment = async (paymentProps, options = {}) => {
  const payment = await models.payments.create({ ...paymentProps }, options);
  return payment;
};

export const findPayments = async (where = {}, options = {}) => {
  const payments = await models.payments.findAll({
    attributes: paymentAttributes,
    where,
    ...options,
  });
  return payments;
};

export const getPaymentById = async (id, options = {}) => {
  const payment = await models.payments.findByPk(id, {
    attributes: paymentAttributes,
    ...options,
  });
  return payment;
};

export const updatePayment = async (id, paymentProps, options = {}) => {
  const payment = await models.payments.update(
    { ...paymentProps },
    { where: { id }, ...options },
  );
  return payment;
};

export const deletePayment = async (id, options = {}) => {
  const payment = await models.payments.destroy({
    where: { id },
    ...options,
  });
  return payment;
};

export const getPaymentsByTripId = async (tripId, options = {}) =>
  findPayments({ tripId }, options);
