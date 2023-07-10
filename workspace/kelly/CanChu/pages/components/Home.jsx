import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <Link href="/posts/demo">
        <a>Go to /posts/demo</a>
      </Link>
    </div>
  );
}
