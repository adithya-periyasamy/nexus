import Image from "next/image";
import Link from "next/link";

export default function AuthHeader() {
    return (
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={35} height={35} />
                <span className="text-xl font-semibold">Nexus</span>
            </Link>
        </header>
    );
}
