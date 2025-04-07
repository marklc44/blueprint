export const toSnakeCaseLight = (str: string) => {
  return str.toLowerCase().replaceAll(' ', '_')
}