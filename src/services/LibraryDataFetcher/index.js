import GraphQLClient from 'graphql-client';
import latestVersions from './queries/latestVersions';
import { SERVER_GRAPHQL } from '../../constants/server.const';
import { processLibrariesData, processFullLibraryData } from '../LibraryDataProcessor';
import fullLibraryMetadata from './queries/fullLibraryMetadata';
import { trimQuery } from './queryProcessor';
import { GithubTokenService } from '../GithubTokenService';

export default class LibraryDataFetcher {
    constructor() {
        this.graphQL = new GraphQLClient({
            url: SERVER_GRAPHQL
        });
        this.tokenService = new GithubTokenService();
    }

    requestQuery(query) {
        let tokenedQuery = query.replace('$token', this.tokenService.getToken());
        return this.graphQL.query(tokenedQuery);
    }

    async fetchLibraryVersions(libraries) {
        const { data} = await this.requestQuery(trimQuery(latestVersions(libraries.join())));
    
        return processLibrariesData(data ? data.libraries : []);
    }

    async fetchFullLibraryMetadata(libraryName) {
        const { data } = await this.requestQuery(trimQuery(fullLibraryMetadata(libraryName)));

        return processFullLibraryData(data);
    }
}