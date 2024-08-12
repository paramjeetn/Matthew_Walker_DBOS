import React, { useState } from 'react';

interface InputBoxProps {
  onSend: (query: string) => void;
  value: string;  // Add this line to ensure value prop is recognized
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, value }) => {
  const [inputValue, setInputValue] = useState<string>(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(inputValue);
    setInputValue(''); // Clear input after sending
  };

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className="input-box">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask Dr. Matthew Walker..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default InputBox;
