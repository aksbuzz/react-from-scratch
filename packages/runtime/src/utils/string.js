export function isNoEmptyString(str) {
  return str !== '';
}

export function isNotBlankOrEmptyString(str) {
  return isNoEmptyString(str.trim());
}
