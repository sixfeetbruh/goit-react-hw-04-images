import PropTypes from 'prop-types';
import { useState } from 'react';
import { MdImageSearch } from 'react-icons/md';
import { toast } from 'react-toastify';
import {
  Header,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = event => {
    const value = event.currentTarget.value.toLowerCase();

    setInputValue(value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      toast.error(`Введіть текст для пошуку зображення`);
      return;
    }

    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <Header>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <MdImageSearch size="30px" fill="red" />
        </SearchFormButton>

        <SearchFormInput
          onChange={handleInputChange}
          value={inputValue}
          name="inputValue"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </Header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};