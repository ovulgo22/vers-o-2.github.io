const events = {};

export const bus = {
    subscribe(eventName, callback) {
        if (!events[eventName]) {
            events[eventName] = [];
        }
        events[eventName].push(callback);
    },
    publish(eventName, data) {
        if (events[eventName]) {
            events[eventName].forEach(callback => callback(data));
        }
    },
};
