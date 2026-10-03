declare module "*?example-source" {
  const source: string;
  export default source;
}

declare module "*?example-loaders" {
  export const EXAMPLE_LOADERS: Readonly<Record<string, () => Promise<{
    EXAMPLE_REGISTRY: Readonly<Record<string, readonly import("./examples/registry").ExampleRecord[]>>;
  }>>>;
}
