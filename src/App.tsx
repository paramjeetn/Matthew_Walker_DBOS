import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import InputBox from './components/InputBox';
import SearchButtons from './components/SearchButtons';
import ResponseBox from './components/ResponseBox';

// Assuming you have imported the Weaviate client and search functions here
import { getHybridResults, getKeywordResults, getGenerativeResults } from './weavaiteQuery';

const App: React.FC = () => {
  const [chats, setChats] = useState<{ message: string }[]>([]);
  const [response, setResponse] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  // Function to call the appropriate search function based on the selected search type
  const handleSelect = async (searchType: string, query: string) => {
    let result;

    if (searchType === 'keyword') {
      result = await getKeywordResults(query);
      // Send the result to LLM for summarization if not generative
      const summarizedResponse = await summarizeResponse(result);
      setResponse(summarizedResponse);
    } else if (searchType === 'hybrid') {
      result = await getHybridResults(query);
      const summarizedResponse = await summarizeResponse(result);
      setResponse(summarizedResponse);
    } else if (searchType === 'generative') {
      result = await getGenerativeResults(query);
      // Assuming the result has a 'data' field with a string that you want to display
      const generativeText = result.data as string;
      setResponse(generativeText); // Ensure it's a string
      setInputValue(generativeText); // Ensure it's a string
    }
  };

  const handleSend = (query: string) => {
    setChats([...chats, { message: query }]);
    // Set the response to empty until the search result is obtained
    setResponse('');
    setInputValue(''); // Clear input field after sending
  };

  return (
    <div className="app-container">
      <ChatBox chats={chats} />
      <ResponseBox response={response} />
      <SearchButtons
        onSelect={(searchType) => handleSelect(searchType, chats[chats.length - 1]?.message || '')}
      />
      <InputBox value={inputValue} onSend={handleSend} />
    </div>
  );
};

// Mock function for LLM summarization
async function summarizeResponse(response: any): Promise<string> {
  // Simulate sending the response to an LLM for summarization
  return `Summarized: ${JSON.stringify(response)}`;
}

export default App;
