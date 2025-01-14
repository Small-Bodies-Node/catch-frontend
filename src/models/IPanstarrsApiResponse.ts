import { panstarrsRequestedColumns } from '../utils/panstarrsRequestedColumns';

/**
 * ps1:frame_id
 */
export interface IPanstarrsApiResponse {
  info: {
    name: string;
    type: string;
    db_type: string;
    column_name: string;
    description: string;
    unit: string;
    ucd: string;
    utype: string;
    datatype: string;
    size: string;
    principal: string;
    indexed: string;
    std: string;
    column_index: string;
    arraysize: string;
    search_priority: string;
    default_value: string;
  }[];
  data: IPanstarrsApiResponseData[];
}

type PanstarrsColumnKeys = (typeof panstarrsRequestedColumns)[number];

type IPanstarrsApiResponseData = {
  [K in PanstarrsColumnKeys]: number | string;
};
