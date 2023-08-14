export function flattenRoutes(routes, level = 0, parent = {}) {
  if (!Array.isArray(routes)) {
    return
  }

  return routes.reduce((flatRoutes, route) => {
  const { name, path, children, ...restRoute } = route;
  const isRoot = level === 0;
  const nested = !isRoot;

  flatRoutes.push({
    ...restRoute,
    name,
    path,
    level,
    isRoot,
    nested,
    parent: {
      ...parent,
      name: isRoot ? undefined : parent.name,
    },
  });

  if (Array.isArray(children) && children.length) {
    flatRoutes = flatRoutes.concat(
      flattenRoutes(children, level + 1, route)
    );
  }

  return flatRoutes;
}, []);
}
