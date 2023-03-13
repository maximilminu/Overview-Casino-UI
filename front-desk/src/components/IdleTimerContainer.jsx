import React from "react";
import { useIdleTimer } from "react-idle-timer";

// Idle functionality
function IdleTimerContainer() {
  const onPrompt = () => {
    // Fire a Modal Prompt
  };

  const onIdle = () => {
    
  };

  const onActive = (event) => {
    // Close Modal Prompt
    // Do some active action
  };

  const onAction = (event) => {
    // Do something when a user triggers a watched event
  };

  const {
    start,
    reset,
    activate,
    pause,
    resume,
    isIdle,
    isPrompted,
    isLeader,
    getTabId,
    getRemainingTime,
    getElapsedTime,
    getLastIdleTime,
    getLastActiveTime,
    getTotalIdleTime,
    getTotalActiveTime,
  } = useIdleTimer({
    onPrompt,
    onIdle,
    onActive,
    onAction,
    timeout: 7000,
    promptTimeout: 0,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: true,
    name: "idle-timer",
    syncTimers: 0,
    leaderElection: false,
  });

  return <div></div>;
}

export default IdleTimerContainer;
