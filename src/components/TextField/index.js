/**
 * @name TextField
 * @module Common/Inputs
 * @description
 * Component for showing a text field
 *
 * @example
 * <TextField placeholder="nice!" onChange={() => console.log('very nice!')}/>
 *
 * @param {String} [id]
 * @param {String} [placeholder] - the placeholder of the text field
 * @param {Function} [onChange]
 * @param {String} [defaultValue] - default value of the text field
 * @param {String} [value] - Value of the Input box. Can be omitted, so component work as usual non-controlled input.
 * @param {Number} [maxLength] Max length for the input
 * @param {String} [className]
 * @param {Number} [debounceDelay] - debounce delay in ms
 * @param {string} [dataAutomations]
 * @param {function} [inputRef] ref
 * @param {string} [type] the type of the input
 */
import {PropTypes} from 'prop-types';
import React from 'react';
import './index.scss';
import classNames from "classnames";
import _ from 'lodash';

export default function TextField(props) {

    let {onChange, className, debounceDelay, dataAutomations, inputRef} = props,
        onTextFieldChange = onChange;

    // adding the debounce functionality
    if (debounceDelay && onChange) {
        onChange = _.debounce(onChange, debounceDelay);

        onTextFieldChange = event => {
            // we access the event properties in an asynchronous way
            event.persist();
            onChange(event);
        };
    }

    return <input className={classNames('text_field', {[className]: className})}
                  onChange={onTextFieldChange}
                  data-automations={dataAutomations}
                  ref={inputRef}
                  {..._.pick(props, ['id', 'placeholder', 'onFocus', 'onBlur', 'defaultValue', 'value', 'type', 'maxLength'])} />;
}

TextField.defaultValue = {
    type: 'text',
};

TextField.propTypes = {
    id: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    debounceDelay: PropTypes.number,
    type: PropTypes.oneOf(['text', 'number', 'tel', 'password']),
    maxLength: PropTypes.number,
    dataAutomations: PropTypes.string,
    inputRef: PropTypes.func,
};