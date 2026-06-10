declare module "class-variance-authority" {
  export type VariantProps<T = any> = any
  // cva returns a function which when called with variant props returns a string
  export function cva(...args: any[]): (...props: any[]) => string
}
