import _ from 'lodash';

export default function processLibaryData(library) {
    let processedLibrary = _.clone(library);    

    if (library.version_data) {
        processedLibrary.version_data.date = processVersionDate(library.version_data.date);
    } else {
        // TODO: Fix non existing version data
        processedLibrary.version_data = {date: new Date()};
    }
    
    return processedLibrary;
}

export function processFullLibraryData(libraryData) {
    let processedLibrary = libraryData.library;

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
    return libraries.map(processLibaryData);
}