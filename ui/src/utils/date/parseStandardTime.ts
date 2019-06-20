// We just want to make it an alias for documentation purposes.
// Turns out, new Date(<arbitrary string>) is an issue for iOS Chrome.
// @see https://stackoverflow.com/a/7610920/2698227
export { parse as default } from 'date-fns'