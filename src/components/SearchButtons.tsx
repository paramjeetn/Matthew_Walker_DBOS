import React from 'react';

interface SearchButtonsProps {
    onSelect: (searchType: string) => void;
}

const SearchButtons: React.FC<SearchButtonsProps> = ({ onSelect }) => {
    return (
        <div className="search-buttons">
            <button onClick={() => onSelect('keyword')}>Keyword Search</button>
            <button onClick={() => onSelect('hybrid')}>Hybrid Search</button>
            <button onClick={() => onSelect('generative')}>Generative Search</button>
        </div>
    );
};

export default SearchButtons;
