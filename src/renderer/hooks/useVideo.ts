import { useReducer, useCallback } from 'react';
import type { Video } from '@shared/types/video';

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
export function useVideo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Executor - does actual work, dispatches actions
  const fetchVideo = useCallback(async (videoId: string) => {
    dispatch({ type: 'FETCH_START' });

    try {
      const result = await window.electronAPI.getVideo(videoId);

      if (result.ok) {
        dispatch({ type: 'FETCH_SUCCESS', video: result.value });
      } else {
        dispatch({ type: 'FETCH_ERROR', error: result.error });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: 'FETCH_ERROR', error: message });
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    fetchVideo,
    reset,
  };
}
