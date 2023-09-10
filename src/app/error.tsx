"use client"; // Error components must be Client Components

// import { useEffect } from "react";

// TODO: Implement error reporting service such as Sentry

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  //   useEffect(() => {
  //     // Log the error to an error reporting service
  //     console.error(error);
  //   }, [error]);

  return (
    <main className="prose prose-lg prose-invert max-w-screen-md mx-auto px-4 my-20">
      <h2>Something went wrong!</h2>
      <p>
        This error occurred while rendering the page. We suggest you try again.
        If you continue to encounter this error, please open an issue on GitHub.
        <br />
        <br />
        {error.message && `Error message: "${error.message}"`}
      </p>
      <button
        className="underline"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
