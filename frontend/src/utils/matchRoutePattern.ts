// route patterns carry ":id" segments, so a pattern never equals the path it describes
export const matchRoutePattern = (
    pattern: string,
    pathname: string,
): boolean => {
    const patternSegments = pattern.split("/");
    const pathSegments = pathname.split("/");

    if (patternSegments.length !== pathSegments.length) {
        return false;
    }

    return patternSegments.every(
        (segment, index) =>
            segment.startsWith(":") || segment === pathSegments[index],
    );
};
