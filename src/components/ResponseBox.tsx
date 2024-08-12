import React from 'react';

interface ResponseBoxProps {
    response: string;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ response }) => {
    return (
        <div className="response-box">
            <h3>Response from Vector DB:</h3>
            <p>{response}</p>
        </div>
    );
};

export default ResponseBox;
