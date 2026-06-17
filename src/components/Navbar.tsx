import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

const Navbar = async () => {
  const locale = await getLocale();
  const t = getDictionary(locale);

  const links = [
    { href: "/posts", label: t.nav.posts },
    { href: "/projects", label: t.nav.projects },
    { href: "/photos", label: t.nav.photos },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <nav className="max-w-screen-md mx-auto px-4 py-4">
      <div className="flex justify-between items-center gap-4">
        <Link href="/">{t.nav.home}</Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <ul className="flex space-x-4 sm:space-x-6 text-neutral-400">
            {links.map((link) => (
              <li
                key={link.href}
                className="hover:text-neutral-300 duration-200"
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher current={locale} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
