import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

expect.extend(matchers);

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

export { beforeEach, describe, expect, it, vi };
