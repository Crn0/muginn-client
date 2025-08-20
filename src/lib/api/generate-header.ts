export const generateHeader = (...headers: [string, string][]) => {
  const header = new Headers();

  headers.forEach(([key, value]) => {
    header.append(key, value);
  });

  return header;
};
