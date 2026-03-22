const API_BASE = (() => {
  const explicit = import.meta.env.VITE_API_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return import.meta.env.BASE_URL.replace(/\/$/, "").replace(
    /\/bitgate$/,
    "/api-server"
  );
})();
export {
  API_BASE
};
