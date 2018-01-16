import _ from 'lodash';
export default function processLibaryData(library) {
    let processedLibrary = library;    

    library.version_data.date = processVersionDate(library.version_data.date);

    return processedLibrary;
}

export function processFullLibraryData(libraryData) {
    let processedLibrary = libraryData;

    processedLibrary.releases = processedLibrary.releases.map(currRelease => {
        currRelease.date = processVersionDate(currRelease.date);
        return currRelease;
    });

    return processedLibrary;
}

export function processVersionDate(date) {
    return new Date(date);
}

export function processLibrariesData(libraries) {
    return _.mapValues(libraries, processLibaryData);
}