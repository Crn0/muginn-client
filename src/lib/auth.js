import { useMutation, useQuery, queryOptions, useQueryClient } from "@tanstack/react-query";

import client from "./api-client";
import { queryConfig } from "./react-query";
import generateHeader from "./generate-header";
import errorHandler from "./error-handler";
import tryCatch from "./try-catch";

export const getUser = async () => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    client.callApi("users/me", {
      headers,
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) {
    throw error;
  }

  return res.json();
};

export const register = async (data) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const res = await client.callApi("auth/register", {
    headers,
    authenticatedRequest: false,
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();

    errorHandler(res, errorData);
  }

  return null;
};

export const login = async (data) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const res = await client.callApi("auth/login", {
    headers,
    authenticatedRequest: false,
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();

    errorHandler(res, errorData);
  }

  return res.json();
};

export const logout = async () => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const res = await client.callApi("auth/logout", {
    headers,
    authenticatedRequest: true,
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();

    errorHandler(res, errorData);
  }
};

export const getAuthUserQueryOptions = (options = {}) =>
  queryOptions({
    ...queryConfig,
    ...options,
    queryKey: ["authenticated-user"],
    queryFn: getUser,
  });

export const useGetUser = (options = {}) => {
  const query = useQuery({
    ...getAuthUserQueryOptions(options),
  });

  return query;
};

export const useRegister = (options) => {
  const mutation = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => options?.onSuccess?.(),
    onError: (e) => {
      options?.onError?.(e);
    },
  });

  return mutation;
};

export const useLogin = (options) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (token) => {
      queryClient.removeQueries({ queryKey: getAuthUserQueryOptions().queryKey });
      options?.onSuccess?.(token);
    },
    onError: (e) => {
      options?.onError?.(e);
    },
  });

  return mutation;
};

export const useLogout = (options) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => logout(data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: getAuthUserQueryOptions().queryKey });
      options?.onSuccess?.();
    },
    onError: (e) => {
      options?.onError?.(e);
    },
  });

  return mutation;
};
