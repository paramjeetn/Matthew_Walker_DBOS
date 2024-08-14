import { HandlerContext, GetApi, PostApi } from '@dbos-inc/dbos-sdk';
import weaviate, { WeaviateClient } from "weaviate-ts-client";
import 'dotenv/config';

// Initialize Weaviate client
const client: WeaviateClient = weaviate.client({
  scheme: "https",
  host: process.env.WEAVIATE_HOST as string, // Cast as string
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_KEY as string), // Cast as string
  headers: {
    "X-Google-Vertex-Api-Key": process.env.GEMINI_KEY as string, // Cast as string
    "X-HuggingFace-Api-Key": process.env.HUGGING_KEY as string, // Cast as string
  },
});

export class SearchHandler {
  
  @GetApi('/') // Serve the base page with input and buttons
  static async basePage(_ctxt: HandlerContext) {
    const pageHtml = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 50px auto;
            max-width: 600px;
            padding: 20px;
            background-color: #f9f9f9;
          }
          input, button {
            padding: 10px;
            margin: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 16px;
          }
          button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          button:hover {
            background-color: #45a049;
          }
          #output {
            margin-top: 20px;
            padding: 15px;
            background-color: #eee;
            border-radius: 5px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <h1>Search Matt Walker's Sleep Data</h1>
        <input type="text" id="query" placeholder="Enter your query" />
        <br/>
        <button onclick="search('keyword')">Keyword Search</button>
        <button onclick="search('hybrid')">Hybrid Search</button>
        <button onclick="search('generative')">Generative Search</button>
        <div id="output"></div>

        <script>
          async function search(type) {
            const query = document.getElementById('query').value;
            const response = await fetch('/process-query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ type, query })
            });
            const result = await response.json();
            document.getElementById('output').innerText = JSON.stringify(result, null, 2);
          }
        </script>
      </body>
      </html>
    `;
    return Promise.resolve(pageHtml);
  }

  @PostApi('/process-query') // Process the query based on the type
  static async processQuery(ctxt: HandlerContext, body: { type: string, query: string }) {
    const { type, query } = body;
    let result;

    if (type === 'keyword') {
      result = await client.graphql
        .get()
        .withClassName("Matt_sleep_Col")
        .withBm25({ query })
        .withLimit(1)
        .withFields("content title start duration _additional { score } ")
        .do();
    } else if (type === 'hybrid') {
      result = await client.graphql
        .get()
        .withClassName("Matt_sleep_Col")
        .withFields("content title start duration _additional { score } ")
        .withHybrid({ query, alpha: 0.7 })
        .withLimit(1)
        .do();
    } else if (type === 'generative') {
      result = await client.graphql
        .get()
        .withClassName("Matt_sleep_Col")
        .withNearText({ concepts: [query] })
        .withGenerate({
          singlePrompt: `${query} reply to this query as if you are Matt Walker his view is given below`,
        })
        .withLimit(1)
        .withFields("content title start duration _additional { score } ")
        .do();
    }

    return Promise.resolve(result);
  }
}
