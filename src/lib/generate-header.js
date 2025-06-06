export default function generateHeader(...headers) {
  const header = new Headers();

  headers.forEach(([key, value]) => {
    header.append(key, value);
  });

  return header;
}
