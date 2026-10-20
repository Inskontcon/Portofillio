/**
 * Retries an async operation that returns a Supabase-style
 * { data, error } result. Retries on transient errors with
 * exponential backoff before giving up.
 */
export async function fetchWithRetry<T>(
  operation: () => PromiseLike<{ data: T | null; error: unknown }>,
  maxRetries = 4,
  baseDelayMs = 500,
  shouldRetryResult: (result: { data: T | null; error: unknown }) => boolean = (result) => Boolean(result.error),
): Promise<{ data: T | null; error: unknown }> {
  let lastResult: { data: T | null; error: unknown } = {
    data: null,
    error: new Error("No attempt made"),
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation()
      if (!shouldRetryResult(result)) {
        return result
      }
      lastResult = result
    } catch (error) {
      lastResult = { data: null, error }
    }

    // Wait before the next retry (exponential backoff), but not after the last attempt
    if (attempt < maxRetries - 1) {
      const delay = baseDelayMs * Math.pow(2, attempt)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return lastResult
}
