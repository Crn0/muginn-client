export default async function tryCatch(promise, onFinally = () => {}) {
  const thing = typeof promise === "function" ? promise() : promise;

  try {
    const data = await thing;
    return { data, error: null };
  } catch (error) {
    return { error, data: null };
  } finally {
    await Promise.resolve(onFinally()).catch(console.error);
  }
}
