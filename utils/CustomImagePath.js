export const getImagePath = (path) => {
  const prefix = process.env.NEXT_PUBLIC_API_ENDPOINT || ""; // Replace with your desired prefix
  // const prefix = ''; // Replace with your desired prefix

  return `${prefix}${path}`;
};
