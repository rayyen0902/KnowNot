declare const defineAppConfig: (config: Record<string, unknown>) => Record<string, unknown>;
declare const definePageConfig: (config: Record<string, unknown>) => Record<string, unknown>;
declare const process: {
  env: Record<string, string | undefined>;
};

declare module '*.scss';
declare module '*.png' {
  const src: string;
  export default src;
}
