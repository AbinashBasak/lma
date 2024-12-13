import { Skeleton } from 'components/ui/skeleton';

export default function Loading() {
    return (
        <div className="flex h-screen flex-col">
            <header className="border-b border-slate-600">
                <Skeleton className="h-8 w-full bg-slate-700" />
            </header>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-10 border-r bg-slate-900 border-slate-700">
                    <div className="flex h-full flex-col p-4">
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-6 w-full bg-slate-700" />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Content area */}
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-lg bg-slate-700" />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
