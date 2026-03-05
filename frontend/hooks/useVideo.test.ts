import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVideo } from './useVideo';
import type { GetVideoFn } from '../api/video';

describe('useVideo', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useVideo());

    expect(result.current.loading).toBe(false);
    expect(result.current.video).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should have error state when api call fails', async () => {
    const mockGetVideo: GetVideoFn = async () => ({
      ok: false,
      error: 'Video not found',
    });

    const { result } = renderHook(() => useVideo(mockGetVideo));

    await act(async () => {
      await result.current.fetchVideo('bad-id');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.video).toBeNull();
    expect(result.current.error).toBe('Video not found');
  });

  it('should have success state when api call succeeds', async () => {
    const mockGetVideo: GetVideoFn = async () => ({
      ok: true,
      value: { title: 'Test Video', url: 'https://youtube.com/watch?v=abc123' },
    });

    const { result } = renderHook(() => useVideo(mockGetVideo));

    await act(async () => {
      await result.current.fetchVideo('abc123');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.video).toEqual({
      title: 'Test Video',
      url: 'https://youtube.com/watch?v=abc123',
    });
    expect(result.current.error).toBeNull();
  });

  it('should set loading state during fetch', async () => {
    let resolve: (value: unknown) => void;
    const mockGetVideo: GetVideoFn = () =>
      new Promise((r) => { resolve = r; }) as ReturnType<GetVideoFn>;

    const { result } = renderHook(() => useVideo(mockGetVideo));

    act(() => {
      result.current.fetchVideo('abc123');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve!({ ok: true, value: { title: 'Test', url: 'https://youtube.com/watch?v=abc123' } });
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle thrown errors', async () => {
    const mockGetVideo: GetVideoFn = async () => {
      throw new Error('Network error');
    };

    const { result } = renderHook(() => useVideo(mockGetVideo));

    await act(async () => {
      await result.current.fetchVideo('abc123');
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.video).toBeNull();
  });

  it('should reset state', async () => {
    const mockGetVideo: GetVideoFn = async () => ({
      ok: true,
      value: { title: 'Test Video', url: 'https://youtube.com/watch?v=abc123' },
    });

    const { result } = renderHook(() => useVideo(mockGetVideo));

    await act(async () => {
      await result.current.fetchVideo('abc123');
    });

    expect(result.current.video).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.video).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
