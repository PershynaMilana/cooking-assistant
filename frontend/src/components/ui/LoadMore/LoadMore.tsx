import React from "react";

interface LoadMoreProps {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    loadMoreLabel: string;
    loadingLabel: string;
    countLabel?: string;
    errorMessage?: string;
}

// manual "show more" pagination footer: an optional live counter line, a button
// that fetches the next page on click only (no auto-scroll/observer), and an
// optional retry-friendly error line. Domain-agnostic - labels come from the consumer.
export const LoadMore: React.FC<LoadMoreProps> = ({
    hasMore,
    isLoading,
    onLoadMore,
    loadMoreLabel,
    loadingLabel,
    countLabel,
    errorMessage,
}) => (
    <div className="text-center mt-4 mb-8">
        <div className="flex items-center justify-center gap-3">
            {countLabel && (
                <p aria-live="polite" className="text-sm text-gray-600">
                    {countLabel}
                </p>
            )}
            {hasMore && (
                <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="bg-dark-purple text-white py-2 px-4 rounded-full disabled:opacity-50"
                >
                    {isLoading && (
                        <span
                            role="status"
                            aria-label={loadingLabel}
                            className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin align-middle"
                        />
                    )}
                    {loadMoreLabel}
                </button>
            )}
        </div>
        {errorMessage && (
            <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
        )}
    </div>
);
