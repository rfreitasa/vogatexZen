/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import PropTypes from "prop-types";

import "./styles.css";

export default function AutocompleteCustom({
  suggestions = [],
  onClickItem,
  defaultValue
}) {
  const [activeSuggestion, setactiveSuggestion] = useState(0);
  const [filteredSuggestions, setfilteredSuggestions] = useState([]);
  const [showSuggestions, setshowSuggestions] = useState(false);
  const [userInput, setuserInput] = useState("");

  const onChange = e => {
    const userInput = e.currentTarget.value;
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setactiveSuggestion(0);
    setfilteredSuggestions(filteredSuggestions);
    setshowSuggestions(true);
    setuserInput(e.target.value);
  };

  const onClick = e => {
    const item = filteredSuggestions.find(
      i => i.name === e.currentTarget.innerText
    );
    onClickItem(item);
    setactiveSuggestion(0);
    setfilteredSuggestions([]);
    setshowSuggestions(false);
    setuserInput(e.currentTarget.innerText);
  };
/*
  const onFocus = e => {
    setactiveSuggestion(0);
    setfilteredSuggestions([]);
    setshowSuggestions(false);
  };
*/
  const onKeyDown = e => {
    if (e.keyCode === 13) {
      setactiveSuggestion(0);
      setshowSuggestions(false);
      setuserInput(filteredSuggestions[activeSuggestion]);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setactiveSuggestion(activeSuggestion - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setactiveSuggestion(activeSuggestion + 1);
    }
  };

  let suggestionsListComponent;
  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul id="ul" className="suggestions">
          {filteredSuggestions.map((suggestion, index) => {
            return (
              <li key={suggestion.id} onClick={onClick}>
                {suggestion.name}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = (
        <div className="no-suggestions">
          <em>Nenhum registro encontrado</em>
        </div>
      );
    }
  }

  return (
    <>
      <input
        type="search"
        onChange={onChange}
        onKeyDown={onKeyDown}
   //     onFocus={onFocus}
        value={userInput}
        style={{ width: 120 }}
      />
      {suggestionsListComponent}
    </>
  );
}

AutocompleteCustom.propTypes = {
  suggestions: PropTypes.instanceOf(Array),
  onClickItem: PropTypes.func,
  defaultValue: PropTypes.string
};
