export function extractLibraryName(library) {
    return library.name;
}

export function flattenLatestMetadata(library) {
    const {version_data, ...otherMetdata} = library;

    return {
        ...version_data,
        ...otherMetdata,
    };
}

export function extractLatestVersionDate(library) {
    return extractLatestVersionData(library).date;
}

export function extractLatestVersion(library) {
    return extractLatestVersionData(library).version;
}

export function extractLatestVersionData(library) {
    return library.version_data;
}