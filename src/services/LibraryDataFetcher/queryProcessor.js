export function trimQuery(query) {
    return query.replace(/\s+/g, ' ')
    .replace(/\n/g, '')
    .trim();
}