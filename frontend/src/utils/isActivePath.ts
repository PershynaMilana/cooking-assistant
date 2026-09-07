// a nav item stays highlighted on its own subpages, not just on its exact path
export const isActivePath = (href: string, pathname: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);
