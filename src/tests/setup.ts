import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn();
IntersectionObserverMock.prototype.disconnect = vi.fn();
IntersectionObserverMock.prototype.observe = vi.fn();
IntersectionObserverMock.prototype.takeRecords = vi.fn();
IntersectionObserverMock.prototype.unobserve = vi.fn();

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
