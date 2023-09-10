import { memo } from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="max-w-screen-md mx-auto px-4 py-4">
      <div className="flex justify-between">
        <Link href="/">Home</Link>
        <ul className="flex space-x-8 text-neutral-400">
          <li className="hover:text-neutral-300 duration-200">
            <Link href="/posts">Posts</Link>
          </li>
          <li className="hover:text-neutral-300 duration-200">
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default memo(Navbar);
