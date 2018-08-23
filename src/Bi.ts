export interface Bi<T> {
    left: T;
    right: T;
}

export function *bii<T>(bi: Bi<T>): IterableIterator<T> {
    yield bi.left;
    yield bi.right;
}
