import { Data } from "./itnerface";
export const getData = async (ipAddress: string): Promise<Data> => {
  return await (await fetch(`/api/locate?ipAddress=${ipAddress}`)).json();
};
