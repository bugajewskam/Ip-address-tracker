import { Data } from "./itnerface";
export const getData = async (ipAddress: string): Promise<Data> => {
  const data = await (
    await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_HTEU8un968eQxoTRGqMcNzcEmfaSb&ipAddress=${ipAddress}`
    )
  ).json();
  return data;
};
