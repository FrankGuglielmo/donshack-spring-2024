import { useEffect } from "react";

const useFetchEvents = (setEvents) => {
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Import the config to use environment-specific API URL
        import("../config").then(async (config) => {
          // using async & await in order to propery "wait" for data
          const response = await fetch(`${config.default.apiUrl}/events/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          // set events state with retrieved data
          setEvents(data);
        });
      } catch (error) {
        console.error("Fetching events failed: ", error);
      }
    };
    fetchEvents();
  }, [setEvents]);
};

export default useFetchEvents;