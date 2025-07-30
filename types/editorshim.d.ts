// types/editorshim.d.ts
// Example shim for an editor package that ships no types
declare module 'react-quill' {
  const ReactQuill: any
  export default ReactQuill
}