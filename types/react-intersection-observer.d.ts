// Type declarations for react-intersection-observer
declare module 'react-intersection-observer' {
  export interface IntersectionOptions {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    triggerOnce?: boolean;
  }

  export function useInView(options?: IntersectionOptions): [React.RefObject<any>, boolean, IntersectionObserverEntry | undefined];
}
