export interface Telemetry {
    id?: String;
    timestamp: number;
    robot: { x: Number; y: Number; z?: Number; pitch?: Number; roll?: Number; heading?: Number; battery?: number; };
    controller?: { battery?: Number; };
    targets?: { x: Number; y: Number; z?: Number; relativeTo?: "robot" | "field"; }[];
    other?: any;
}