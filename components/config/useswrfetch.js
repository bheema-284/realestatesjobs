import useSWR, { useSWRConfig } from "swr";
import { getServiceHeader } from "./sitesettings";

const fetcher = async (url) => {
    try {
        const res = await fetch(url, { headers: await getServiceHeader() });
        if (res.ok) {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                console.log("Unauthorized access");
                return;
            } else {
                let error = true
                console.log(error);
                throw error;
            }
        } else {
            return []
        }
    } catch (error) {
        if (error.message !== "Unauthorized access") {
            console.log(true);
        }
        throw error;
    }
};

export function useSWRFetch(url) {
    const { data, error, isLoading, isValidating } = useSWR(url && url, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        focusThrottleInterval: 5000, // Throttle revalidation on focus
    });

    return {
        data: data,
        error: error,
        isLoading: isLoading,
        isValidating: isValidating
    }
}

export function useSWRFetchLazy(url) {
    const { data, error, isLoading, isValidating, mutate } = useSWR(url && url, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        revalidateIfStale: false, // Don't revalidate automatically
        revalidateOnReconnect: false, // Don't revalidate on reconnect
        dedupingInterval: 0, // No deduping for lazy loading
    });

    const revalidate = () => mutate();

    return {
        data: data,
        error: error,
        isLoading: isLoading,
        isValidating: isValidating,
        revalidate: revalidate
    }
}

export function useSWRFetchOptimized(url, options = {}) {
    const defaultOptions = {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        focusThrottleInterval: 5000,
        ...options
    };

    const { data, error, isLoading, isValidating, mutate } = useSWR(url && url, fetcher, defaultOptions);

    const revalidate = (shouldRevalidate = true) => mutate(undefined, { revalidate: shouldRevalidate });

    return {
        data: data,
        error: error,
        isLoading: isLoading,
        isValidating: isValidating,
        revalidate: revalidate
    }
}

export function Mutated(url) {
    const { mutate } = useSWRConfig();
    const mutated = () => { mutate(url) };
    return mutated;
}

export function MutateWithRevalidate(url) {
    const { mutate } = useSWRConfig();
    const mutated = (shouldRevalidate = true) => {
        mutate(url, undefined, { revalidate: shouldRevalidate });
    };
    return mutated;
}

// Custom hook for paginated data with lazy loading
export function useSWRPaginated(url, page, pageSize) {
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        url && page ? `${url}?page=${page}&limit=${pageSize}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    );

    const revalidate = () => mutate();

    return {
        data: data,
        error: error,
        isLoading: isLoading,
        isValidating: isValidating,
        revalidate: revalidate
    }
}

// Hook for conditional fetching (lazy loading)
export function useSWRConditional(url, condition) {
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        condition ? url : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    );

    const revalidate = () => mutate();

    return {
        data: data,
        error: error,
        isLoading: isLoading,
        isValidating: isValidating,
        revalidate: revalidate
    }
}