declare module '*.css';

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
