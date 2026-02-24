import { useReducer, useCallback } from 'react';
import type { Video } from '../types/video';
import { getVideo as defaultGetVideo } from '../api/video';
import type { GetVideoFn } from '../api/video';

// State
interface State {
  loading: boolean;
  video: Video | null;
  error: string | null;
}

// Actions
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; video: Video }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'RESET' };

// Initial state
const initialState: State = {
  loading: false,
  video: null,
  error: null,
};

// Reducer - pure function, just updates state
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, video: null, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, video: action.video, error: null };
    case 'FETCH_ERROR':
      return { loading: false, video: null, error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Hook with reducer + executor
// Accepts an optional API function for dependency injection.
// This allows tests to pass in a mock function instead of hitting the real API.
export function useVideo(getVideo: GetVideoFn = defaultGetVideo) {
  // useReducer manages complex state with actions.
  // - state: current values (loading, video, error)
  // - dispatch: function to send actions like { type: 'FETCH_START' }
  // When dispatch is called, the reducer function runs and returns new state.
  // React then re-renders the component with the updated state.
  //
  // We use useReducer instead of useState because it's less verbose when
  // managing multiple related values that change together. With useState,
  // you'd need separate setLoading/setVideo/setError calls scattered
  // throughout the code. With useReducer, state transitions are defined
  // once in the reducer function.
  const [state, dispatch] = useReducer(reducer, initialState);

  // Executor - does actual work via HTTP, dispatches actions
  const fetchVideo = useCallback(async (videoId: string) => {
    dispatch({ type: 'FETCH_START' });

    try {
      const result = await getVideo(videoId);

      if (result.ok && result.value) {
        dispatch({ type: 'FETCH_SUCCESS', video: result.value });
      } else {
        dispatch({ type: 'FETCH_ERROR', error: result.error ?? 'Unknown error' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: 'FETCH_ERROR', error: message });
    }
  }, [getVideo]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    fetchVideo,
    reset,
  };
}
