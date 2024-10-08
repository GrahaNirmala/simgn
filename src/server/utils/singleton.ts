export function singleton<T>(name: string, valueFactory: () => T) {
  const g = global as any
  g.__singletons ??= {}
  g.__singletons[name] ??= valueFactory()
  return g.__singletons[name] as T
}
