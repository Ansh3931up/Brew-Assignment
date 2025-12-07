export function TaskSkeleton() {
  return (
    <div className="space-y-0 w-full">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 animate-pulse"
        >
          <div className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-muted-foreground/20 dark:bg-text-mutedDark/20" />
          <div className="flex-1 space-y-1">
            <div className="h-3 sm:h-4 bg-muted-foreground/20 dark:bg-text-mutedDark/20 rounded w-3/4" />
            <div className="h-2 bg-muted-foreground/10 dark:bg-text-mutedDark/10 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
