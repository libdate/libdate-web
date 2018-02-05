import React, { Component } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import TextField from '../../components/TextField';
import SubscriptionStorageService from './../../services/SubscriptionStorageService';
import classNames from 'classnames';
import LibraryDataFetcher from './../../services/LibraryDataFetcher';
import {
  flattenLatestMetadata
} from '../../services/LibraryDataExtractors';
import AccountService from '../../services/AccountService';

class App extends Component {
  constructor(props) {
    super(props);
    this.subscriptionStorageService = new SubscriptionStorageService();
    this.libraryDataFetcher = new LibraryDataFetcher();
    this.accountService = new AccountService();

    this.state = {
      versions: [],
      libraries: this.subscriptionStorageService.getSubscriptions() || [],
      libraryInput: '',
      fetching: false,
    };

    this.renderLibraryItem = this.renderLibraryItem.bind(this);
    this.setLibraryInput = this.setLibraryInput.bind(this);
    this.addLibrary = this.addLibrary.bind(this);
    this.updateVersionData = this.updateVersionData.bind(this);
  }

  componentDidMount() {
    if (!_.isEmpty(this.state.libraries)) {
      this.accountService.init(() => {
        this.updateVersionData(this.state.libraries);
      });
    }

    this.setIntervalUpdating();
  }

  async componentWillUpdate(nextProps, nextState) {
    if (nextState.libraries !== this.state.libraries) {
      await this.updateVersionData(nextState.libraries);
    }
  }

  setIntervalUpdating() {
    // window.setInterval(this.updateVersionData, 30000);
  }

  async updateVersionData(libraries = this.state.libraries) {
    this.setState({ fetching: true });
    let versions = await this.libraryDataFetcher.fetchLibraryVersions(libraries);
    this.setState({ versions, fetching: false });
  }

  setLibraryInput(event) {
    this.setState({ libraryInput: event.target.value });
  }

  addLibrary() {
    const { libraries, libraryInput } = this.state;
    const newLibraries = [...libraries, libraryInput.toLowerCase()];

    this.subscriptionStorageService.saveSubscriptions(newLibraries);
    this.setState({ libraries: newLibraries, libraryInput: ''});
  }

  componentDidCatch(error) {
    console.error(error);
  }

  renderLatestLibraryDataItem(field, data, ) {
    return (
      <div key={field} className={classNames('library-latest-field', `library-latest-field-${field}`)}>
        <span>{field}:</span> <span>{data}</span>
      </div>
    );
  }

  renderLibraryItem(library) {
    const { name, date, version, age_text, description } = flattenLatestMetadata(library);
    const compareDate = new Date().setDate(new Date().getDate() - 1);

    return (
      <Link to={`/${name}`} key={name}>
        <li className={classNames('library-latest-item',
          { 'hot-library-item': date > compareDate })}>
          <h3 className='library-latest-title'>{name} - v{version}</h3>
          <span className='library-latest-description'>{description}</span>
          <div className='library-latest-version-data'>
            {this.renderLatestLibraryDataItem('From', age_text)}
            {this.renderLatestLibraryDataItem('Date', date.toLocaleDateString())}
          </div>
        </li>
      </Link>
    );
  }

  render() {
    const { versions, libraryInput } = this.state;

    return (
      <div className='page latest-versions-page'>
        <section className='library-input'>
          <TextField className='library-input-field' value={libraryInput} onChange={this.setLibraryInput} />
          <button onClick={this.addLibrary}>Add</button>
        </section>
        <ul className='latest-libary-versions-list'>
          {versions.map(this.renderLibraryItem)}
        </ul>
      </div >
    );
  }
}

export default App;
