/// <reference types="date-fns-v1" />

// v1 declares its original module name globally. Re-export those exact types for
// the package alias, keeping date behavior separate from Base UI's optional v4 peer.
declare module 'date-fns-v1' {
  export * from 'date-fns'
}
