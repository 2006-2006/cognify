'use client';

export function GridBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-black">
            <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* Ambient Glows */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl opacity-30 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-pink-600/20 blur-3xl opacity-30 animate-pulse" />
        </div>
    );
}
