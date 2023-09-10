import Link from "next/link";

/*
The not-found file is used to render UI when the notFound 
function is thrown within a route segment. 
Along with serving a custom UI, Next.js will 
also return a 404 HTTP status code.
*/

export default function NotFound(): JSX.Element {
  return (
    <main className="prose prose-lg prose-invert max-w-screen-md mx-auto px-4 my-20">
      <h2>Not Found</h2>
      <p>
        Could not find requested resource.
        <br />
        <br />
        <Link href="/posts">View all posts</Link>
      </p>
    </main>
  );
}
