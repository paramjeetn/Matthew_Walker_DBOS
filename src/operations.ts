import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import InputBox from './components/InputBox';
import SearchButtons from './components/SearchButtons';
import ResponseBox from './components/ResponseBox';

import { TransactionContext, HandlerContext, Transaction, GetApi, ArgSource, ArgSources } from '@dbos-inc/dbos-sdk';

interface RootProps {}

export class Root {
  @GetApi('/')
  static async Greeting(ctxt: HandlerContext, friend: string) {
    return `you are root`;
  }
}

const App: React.FC<RootProps> = () => {
    const [chats, setChats] = useState<{ message: string }[]>([]);
    const [response, setResponse] = useState<string>('');

    const handleSend = (query: string) => {
        setChats([...chats, { message: query }]);
        // Send query to the backend API
    };

    const handleSelect = async (searchType: string) => {
        const apiResponse = await fetch(`/api/${searchType}`, { method: 'POST', body: JSON.stringify({ query: chats[chats.length - 1].message }) });
        const data = await apiResponse.json();
        setResponse(data.response);
    };

    return (
        <div className="app-container">
            <ChatBox chats={chats} />
            <ResponseBox response={response} />
            <SearchButtons onSelect={handleSelect} />
            <InputBox onSend={handleSend} />
        </div>
    );
};

export default App;
