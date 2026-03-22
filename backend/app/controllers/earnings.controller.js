import { calculateEarnings } from "../services/earnings.service.js";

export function getEarnings(req, res, next) {
  try {
    const data = calculateEarnings();
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}
