/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      // Jest standard matchers
      toBe(expected: any): R;
      toBeCloseTo(expected: number, precision?: number): R;
      toBeDefined(): R;
      toBeFalsy(): R;
      toBeGreaterThan(expected: number): R;
      toBeGreaterThanOrEqual(expected: number): R;
      toBeLessThan(expected: number): R;
      toBeLessThanOrEqual(expected: number): R;
      toBeInstanceOf(expected: any): R;
      toBeNull(): R;
      toBeTruthy(): R;
      toBeUndefined(): R;
      toBeNaN(): R;
      toContain(expected: any): R;
      toContainEqual(expected: any): R;
      toEqual(expected: any): R;
      toHaveLength(expected: number): R;
      toHaveProperty(property: string, value?: any): R;
      toMatch(expected: string | RegExp): R;
      toMatchObject(expected: any): R;
      toStrictEqual(expected: any): R;
      toThrow(expected?: string | RegExp | jest.Constructable | Error | any): R;
      toThrowError(expected?: string | RegExp | jest.Constructable | Error | any): R;
      toThrowErrorMatchingSnapshot(hint?: string): R;
      toThrowErrorMatchingInlineSnapshot(snapshot?: string): R;
      toMatchSnapshot(hint?: string): R;
      toMatchInlineSnapshot(snapshot?: string): R;
      
      // Jest-DOM matchers
      toBeInTheDocument(): R;
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeVisible(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp): R;
      toHaveAccessibleName(expectedAccessibleName?: string | RegExp): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveTextContent(text: string | RegExp | null): R;
      toHaveValue(value: string | string[] | number): R;
      toHaveDisplayValue(value: string | RegExp | string[] | RegExp[]): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveErrorMessage(text?: string | RegExp): R;
      
      // Mock function matchers
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...expected: any[]): R;
      toHaveBeenLastCalledWith(...expected: any[]): R;
      toHaveBeenNthCalledWith(nthCall: number, ...expected: any[]): R;
      toHaveReturned(): R;
      toHaveReturnedTimes(expected: number): R;
      toHaveReturnedWith(expected: any): R;
      toHaveLastReturnedWith(expected: any): R;
      toHaveNthReturnedWith(nthCall: number, expected: any): R;
      
      // Additional testing library matchers
      toHaveNoViolations(): R;
    }
  }
  
  // Override expect interface to use Jest matchers
  interface Global {
    expect: jest.Expect;
    describe: jest.Describe;
    it: jest.It;
    test: jest.It;
    beforeAll: jest.Lifecycle;
    beforeEach: jest.Lifecycle;
    afterAll: jest.Lifecycle;
    afterEach: jest.Lifecycle;
  }
}

// Re-export types to ensure they're available
export = jest;
export as namespace jest;
