const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestOptions = {
  token?: string;
  body?: unknown;
};

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {};

  if (options.body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body:
      options.body !== undefined
        ? isFormData
          ? (options.body as FormData)
          : JSON.stringify(options.body)
        : undefined,
  });

  return response.json();
}

export function get<T>(path: string, token?: string): Promise<T> {
  return request<T>("GET", path, { token });
}

export function post<T>(path: string, body?: unknown, token?: string): Promise<T> {
  return request<T>("POST", path, { body, token });
}

export function put<T>(path: string, body?: unknown, token?: string): Promise<T> {
  return request<T>("PUT", path, { body, token });
}

export function del<T>(path: string, token?: string): Promise<T> {
  return request<T>("DELETE", path, { token });
}
