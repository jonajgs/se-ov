export const START = 'START';
export function start(navigator) {
    return {
        type: START,
        navigator,
    };
};

export const INIT = 'INIT';
export function init() {
    return {
        type: INIT,
    };
};

export const NEXT = 'NEXT';
export function next(answer, nav) {
    return {
        type: NEXT,
        answer,
        navigator: nav,
    };
};
