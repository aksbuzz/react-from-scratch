export function objectsDiff(o, n) {
  const oKeys = Object.keys(o);
  const nKeys = Object.keys(n);

  return {
    added: nKeys.filter(key => !(key in o)),
    removed: oKeys.filter(key => !(key in n)),
    updated: nKeys.filter(key => key in o && o[key] !== n[key]),
  };
}
