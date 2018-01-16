import GraphQLClient from 'graphql-client';
import latestVersion from './queries/latestVersion';
import { SERVER_GRAPHQL } from '../../constants/server.const';
import { processLibrariesData } from '../LibraryDataProcessor';
import _ from 'lodash';
import fullLibraryMetadata from './queries/fullLibraryMetadata';
import { trimQuery } from './queryProcessor';

export default class LibraryDataFetcher {
    constructor() {
        this.graphQL = new GraphQLClient({
            url: SERVER_GRAPHQL
        });
    }

    async fetchLatestVersion(libraryName) {
        const { data } = await this.graphQL.query(latestVersion(libraryName));

        return data;
    }

    async fetchLibraryVersions(libraries) {
        let librariesQuery = `{
            ${libraries.map(currLibrary => `${_.camelCase(currLibrary)}: ${latestVersion(currLibrary)}`)}
        }`;
        
        const { data } = await this.graphQL.query(trimQuery(librariesQuery));
    
        return processLibrariesData(data);
    }

    async fetchFullLibraryMetadata(libraryName) {
        const { data } = await this.graphQL.query(trimQuery(fullLibraryMetadata(libraryName)));

        return data;
    }
}