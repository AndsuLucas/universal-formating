
export const useEventBus = () => {
    let listeners= new Map();

    const subscribe = (event, callback)  => {
        if (!listeners.has(event)) {
            listeners.set(event, [callback]);
            return;
        }

        listeners.get(event)
            .push(callback);
    }

    const notify = (event, data) => {
        if (listeners.has(event)) {
            listeners.get(event)
                .forEach(callback => callback(data));
        }
    }


    return {
        eventBus: {
            subscribe,
            notify
        },
    }
}