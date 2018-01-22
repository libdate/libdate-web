import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import LibraryDataFetcher from '../../services/LibraryDataFetcher';
import ReactMarkdown from 'react-markdown';
import Collapsible from 'react-collapsible';

export default class LibraryInfoPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            libraryData: undefined,
        };
        this.libraryDataFetcher = new LibraryDataFetcher();
    }

    async componentWillMount() {
        const { match: { params: { libraryName } } } = this.props;
        let libraryData = await this.libraryDataFetcher.fetchFullLibraryMetadata(libraryName);

        this.setState({ libraryData });
    }

    renderReleaseItem(release) {
        const { version, age_text, date, description } = release;

        return (
            <Collapsible
                className='library-release-item'
                openedClassName='library-release-item library-release-item-open'
                contentOuterClassName='library-release-outer'
                trigger={<h4>{version} - {age_text}</h4>}
                lazyRender={true}
                easing='cubic-bezier(0.65, 0.05, 0.36, 1)'
                key={version}
            >
                <div className='library-release-content'>
                    <div>Released {age_text} on {date.toString()}</div>
                    <div className='library-release-description'>
                        <ReactMarkdown source={description} className='release-description-markdown' />
                    </div>
                </div>
            </Collapsible>
        );
    }

    render() {
        const { libraryData } = this.state;

        if (!libraryData) {
            return null;
        }

        const { name, description, current_version, releases, githubUrl } = libraryData;

        return (
            <div className='library-info-page'>
                <h3 className='breadcrumbs'><Link to='/'>Libraries</Link> > </h3>
                <div className='library-header'>
                    <h1 className='library-title'>
                        {name} - {current_version}
                    </h1>
                    <ul className='library-links'>
                        <li className='library-link library-github-link-item'>
                            <a
                                className='library-github-link'
                                href={githubUrl}
                                title={`${name}'s GitHub Repository`}>&nbsp;</a>
                        </li>
                    </ul>
                </div>
                <div className='library-desription'>{description}</div>
                <section id='library-releases'>
                    <h3 className='library-section-header library-releases-header'>Releases</h3>
                    <ul className='library-releases-container'>
                        {releases.map(this.renderReleaseItem)}
                    </ul>
                </section>
            </div>
        );
    }
}