import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

expect.extend(matchers);

export { beforeEach, describe, expect, it, vi };
