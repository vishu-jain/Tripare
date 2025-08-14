// SpaceX Launch Patch Images
export interface LaunchPatch {
  small: string | null;
  large: string | null;
}

// SpaceX Launch Links
export interface LaunchLinks {
  patch: LaunchPatch;
  webcast: string | null;
  article: string | null;
  wikipedia: string | null;
}

// SpaceX Launch API Response
export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  launchpad: string;
  links: LaunchLinks;
}

// SpaceX Launches Query Response
export interface LaunchesQueryResponse {
  docs: Launch[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// SpaceX Launchpad API Response
export interface Launchpad {
  id: string;
  name: string;
  locality: string;
  region: string;
  latitude: number;
  longitude: number;
  details: string;
}
