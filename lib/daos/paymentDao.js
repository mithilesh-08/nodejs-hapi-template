import { models } from '@models';

export const createPayment = async (paymentProps, options = {}) => {
  const payment = await models.payments.create({ ...paymentProps }, options);
  return payment;
};

export const findPayments = async (
  where = {},
  page = 1,
  limit = 10,
  options = {},
) => {
  const offset = (page - 1) * limit;

  const result = await models.payments.findAndCountAll({
    where,
    limit,
    offset,
    ...options,
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    total: Math.ceil(result.count / limit),
  };
};

export const getPaymentById = async (id, options = {}) => {
  const payment = await models.payments.findByPk(id, {
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

export const getPaymentsByTripId = async (
  tripId,
  page = 1,
  limit = 10,
  options = {},
) => findPayments({ tripId }, page, limit, options);
