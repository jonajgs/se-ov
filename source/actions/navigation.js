export const PUSH = 'PUSH';
export function push(component) {
    return {
        type: PUSH,
        component,
    };
}
export const POP = 'POP';
export function pop() {
    return {
        type: POP,
    };
}
export const GO_TO_INDEX = 'GO_TO_INDEX';
export function goToIndex(index) {
    return {
        type: GO_TO_INDEX,
        index,
    };
}
