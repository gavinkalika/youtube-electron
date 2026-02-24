import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVideo } from './useVideo';

describe('useVideo', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useVideo());

    expect(result.current.loading).toBe(false);
    expect(result.current.video).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should have error state when api call fails', () => {
    const { result } = renderHook(() => useVideo());

  });
});
