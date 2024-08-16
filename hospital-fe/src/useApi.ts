export function useApi() {
  const url = import.meta.env.VITE_API_URL;

  async function getPatients() {
    const response = await fetch(`${url}/patients`);
    return response.json();
  }

  async function getDrugs() {
    const response = await fetch(`${url}/drugs`);
    return response.json();
  }

  return {
    getPatients,
    getDrugs
  };
}
