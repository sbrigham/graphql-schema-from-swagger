export function getResponseSchemaFromPath(swaggerJson: Object, path: string) {
  const currentPath = swaggerJson.paths[path];
  if (
    currentPath.get &&
    currentPath.get.responses &&
    currentPath.get.responses['200'] &&
    currentPath.get.responses['200']['schema']
  ) {
    return currentPath.get.responses['200']['schema'];
  }
  return null;
}
