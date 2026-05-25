import { getBackendOrigin } from "./getPublicApiBase.server";

export { getBackendOrigin };

export function getBackendWeatherUrl(type = "current"): string {
  return `${getBackendOrigin()}/api/weather?type=${type}`;
}
