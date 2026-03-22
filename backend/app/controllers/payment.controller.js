import {
  processPayment,
  fetchApiKey,
} from "../services/payment.service.js";

export async function verifyPayment(req, res, next) {
  try {
    const result = await processPayment(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function getApiKey(req, res, next) {
  try {
    const result = fetchApiKey(req.query.address);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
