import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE } from "./api";

class ApiError extends Error {
  constructor(response, data) {
    const msg =
      data?.error ||
      data?.message ||
      `HTTP ${response.status} ${response.statusText}`;
    super(msg);
    this.name = "ApiError";
    this.status = response.status;
    this.data = data;
    this.error = data;
  }
}

async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `${API_BASE}${path}`;
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new ApiError(response, data);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } finally {
    clearTimeout(timeout);
  }
}

export function useListApis(options) {
  const query = useQuery({
    queryKey: ["/apis"],
    queryFn: ({ signal }) => apiFetch("/marketplace/apis", { signal }),
    ...options?.query,
  });
  return { ...query, queryKey: ["apis"] };
}

export function useVerifyPayment(options) {
  return useMutation({
    mutationKey: ["verifyPayment"],
    mutationFn: (data) =>
      apiFetch("/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}
