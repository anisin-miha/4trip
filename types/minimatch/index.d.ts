declare module "minimatch" {
  export type IOptions = Record<string, unknown>;

  export function minimatch(
    path: string,
    pattern: string,
    options?: IOptions,
  ): boolean;

  export class Minimatch {
    constructor(pattern: string, options?: IOptions);
    match(path: string): boolean;
  }

  export default minimatch;
}
