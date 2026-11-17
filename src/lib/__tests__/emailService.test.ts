import { beforeEach, describe, expect, it, vi } from '@/setupTests';

// global.fetch = vi.fn();


vi.stubEnv('VITE_WORKER_URL', 'https://test-worker.dev');

describe('emailService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  it('posts only feedback fields', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response);

    const { sendFeedbackEmail } = await import('../emailService');

    await sendFeedbackEmail({
      email: 'test@example.com',
      content: 'Test feedback content',
    });

    expect(fetch).toHaveBeenCalledWith('https://test-worker.dev/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com', content: 'Test feedback content' })
    });
  });

  it('should include tune data when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response);

    const { sendFeedbackEmail } = await import('../emailService');

    const mockTune = {
      weight: 1500,
      distribution: { front: 50, rear: 50 },
      springs: { front: 100, rear: 110 },
      damping: {
        bump: { front: 5, rear: 6 },
        rebound: { front: 8, rear: 9 }
      },
      alignment: {
        camber: { front: -2.0, rear: -1.5 },
        toe: { front: 0.0, rear: 0.0 },
        caster: 6.0
      },
      diff: {
        drivetrain: 'RWD' as const,
        front: { acceleration: 0, deceleration: 0 },
        rear: { acceleration: 40, deceleration: 30 },
        center: 50
      },
      antiRoll: { front: 15, rear: 18 },
      limits: {
        springRate: { min: 100, max: 2000 },
        caster: { min: 1, max: 7 },
        camber: { min: -5, max: 5 },
        toe: { min: -5, max: 5 },
        tirePressure: { min: 15, max: 55 },
        antiRoll: { min: 1, max: 140 },
        bump: { min: 1, max: 13 },
        rebound: { min: 1, max: 13 },
        rollCenterOffset: { min: -9.8, max: 9.8 },
        antiDiveSquat: { min: -50, max: 150 },
        rideHeight: { min: 0, max: 10 }
      }
    };

    await sendFeedbackEmail({
      content: 'Test with tune',
      tune: mockTune,
    });

    const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(callArgs.body as string);

    expect(body.tune).toEqual(mockTune);
  });
});