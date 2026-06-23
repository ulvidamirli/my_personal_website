import SiteNav from "@/components/SiteNav";
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
    <SiteNav
      home={{ href: "/", label: t.nav.home }}
      links={links}
      locale={locale}
      labels={{ openMenu: t.nav.openMenu, closeMenu: t.nav.closeMenu }}
    />
  );
};

export default Navbar;
