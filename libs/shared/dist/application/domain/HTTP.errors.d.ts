export interface HTTPError {
    name: string;
    status: number;
    message: string;
    errorCode?: number;
}
export declare class NotFoundError implements HTTPError {
    message: string;
    errorCode?: number | undefined;
    name: string;
    status: number;
    constructor(message?: string, errorCode?: number | undefined);
}
export declare class InternalServerError implements HTTPError {
    message: string;
    errorCode?: number | undefined;
    name: string;
    status: number;
    constructor(message?: string, errorCode?: number | undefined);
}
