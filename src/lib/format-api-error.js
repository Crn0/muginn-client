export default function formatApiError(res, data) {
  const error = new Error(data?.message || "Something went wrong", {});

  error.fields = data?.errors || {};
  error.code = data?.code || res.status;
  error.response = res;
  error.apiData = data;

  return error;
}
