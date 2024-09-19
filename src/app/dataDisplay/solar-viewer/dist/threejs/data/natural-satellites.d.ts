interface INaturalSatellites {
    Planet: string;
    'Epoch String': string;
    'Epoch JD': number;
    'Element Type': 'Ecliptic' | 'Laplace' | 'Equatorial';
    'Sat.': string;
    tags: string;
    a: number;
    e: string;
    w: string;
    M: string;
    i: string;
    node: string;
    n: string;
    P: string;
    Pw: string;
    Pnode: null | number;
    RA: null | number;
    Dec: null | number;
    Tilt: null | number;
    Ref: string;
}
export declare const naturalSatellites: INaturalSatellites[];
export {};
