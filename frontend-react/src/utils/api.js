const localApiUrl = "http://localhost:5000";
const productionApiUrl = "https://api-minatin.prvtech.site";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = (configuredApiUrl || (import.meta.env.PROD ? productionApiUrl : localApiUrl))
  .replace(/\/+$/, "");

export const apiUrl = (path) => `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
