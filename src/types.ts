export type Container = {
  resolve: (name: string) => any
}

export type PluginOptions = {
  container: Container
}
