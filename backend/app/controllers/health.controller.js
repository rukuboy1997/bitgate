export function healthCheck(req, res) {
  res.json({
    status: "ok",
    service: "BitGate API",
    timestamp: Date.now(),
  });
}
