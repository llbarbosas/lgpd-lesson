export interface HTTPError {
  name: string;
  status: number;
  message: string;
  errorCode?: number;
}

export class NotFoundError implements HTTPError {
  name = "NotFoundError";
  status = 404;
  constructor(
    public message: string = "Data not found",
    public errorCode?: number
  ) {}
}

export class InternalServerError implements HTTPError {
  name = "InternalServerError";
  status = 500;

  constructor(
    public message: string = "Internal server",
    public errorCode?: number
  ) {}
}
