declare module 'maath/random/dist/maath-random.esm' {
    export function inSphere(
        buffer: Float32Array,
        options?: { radius?: number; center?: [number, number, number] }
    ): Float32Array;
    export function inRect(
        buffer: Float32Array,
        options?: { sides?: [number, number]; center?: [number, number] }
    ): Float32Array;
    // Add more as needed, or use 'any' for the module
}
