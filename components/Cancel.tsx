import Link from "next/link";

export default function Cancel() {
  return (
    <Link
      href="/"
      className="bg-gray-700 w-52 rounded-md font-bold text-center py-2 transition-colors hover:bg-gray-800"
    >
      Cancel
    </Link>
  );
}
