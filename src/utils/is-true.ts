export function isTrue (value: string | undefined): boolean {
  // return if Boolean
  if (typeof value === 'boolean') { return value }

  // return false if null or undefined
  if (value === undefined || value === null) { return false }

  // if the String is 'true' or 'false'
  if (value.toLowerCase() === 'true') { return true }
  if (value.toLowerCase() === 'false') { return false }

  // now check if it's a number
  const number = parseInt(value, 10)
  if (isNaN(number)) { return false }
  if (number > 0) { return true }

  // default to false
  return false
}
