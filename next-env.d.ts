/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "next-env" {
    export const config: {
      readonly serverRuntimeConfig: {
        readonly [key: string]: string;
      };
      readonly publicRuntimeConfig: {
        readonly [key: string]: string;
      };
    };
  }
  