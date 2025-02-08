import { useEffect, useCallback } from 'react';
import { BlockerFunction, useBeforeUnload, useBlocker } from 'react-router-dom'

const PreventNavigation = ({
                             when = false,
                             message = "Are you sure you want to leave? You may have unsaved changes."
                           }) => {
  // Handle browser back/forward buttons and tab closing
  useBeforeUnload(
    useCallback(
      (event) => {
        if (when) {
          event.preventDefault();
          return message;
        }
      },
      [when, message]
    )
  );

  // Handle in-app navigation via React Router
  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) => {
        return when && currentLocation.pathname !== nextLocation.pathname;
      },
      [when]
    )
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const proceed = window.confirm(message);
      if (proceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  return null;
};

export default PreventNavigation;