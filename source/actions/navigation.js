export const PUSH = 'PUSH';
export function push(component) {
    return {
        type: PUSH,
        component,
    };
};
