import { cn } from '../../lib/cn'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular' | 'card'
    width?: string | number
    height?: string | number
    animation?: 'pulse' | 'shimmer' | 'none'
}

export function Skeleton({
    className,
    variant = 'text',
    width,
    height,
    animation = 'shimmer'
}: SkeletonProps) {
    const baseClasses = 'skeleton'

    const variantClasses = {
        text: 'skeleton-text',
        circular: 'skeleton-circular',
        rectangular: 'skeleton-rectangular',
        card: 'skeleton-card'
    }

    const animationClasses = {
        pulse: 'skeleton-pulse',
        shimmer: 'skeleton-shimmer',
        none: ''
    }

    const style: React.CSSProperties = {
        width: width,
        height: height
    }

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            style={style}
            aria-busy="true"
            aria-live="polite"
        />
    )
}

// Pre-built skeleton compositions
export function SkeletonCard() {
    return (
        <div className="skeleton-card-wrapper">
            <Skeleton variant="rectangular" height={180} />
            <div className="skeleton-card-body">
                <Skeleton variant="text" width="40%" height={12} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" width="60%" height={16} />
            </div>
        </div>
    )
}

export function SkeletonHero() {
    return (
        <div className="skeleton-hero">
            <Skeleton variant="text" width={120} height={32} />
            <Skeleton variant="text" width="80%" height={64} className="mt-4" />
            <Skeleton variant="text" height={20} className="mt-6" />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
            <div className="skeleton-tags mt-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="rectangular" width={80} height={32} />
                ))}
            </div>
        </div>
    )
}
