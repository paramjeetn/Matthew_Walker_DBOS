import { HandlerContext, GetApi } from '@dbos-inc/dbos-sdk';
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
            max-width: 800px;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
          }
          input[type="text"] {
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 18px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            box-sizing: border-box;
          }
          button {
            width: 30%;
            padding: 15px;
            margin: 10px 5px;
            border-radius: 8px;
            border: none;
            background-color: #4CAF50;
            color: white;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          button:hover {
            background-color: #45a049;
          }
          #output {
            margin-top: 30px;
            padding: 20px;
            background-color: #eef2f3;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        <h1>Search Matt Walker's Sleep Data</h1>
        <input type="text" id="query" placeholder="Enter your query" />
        <div style="text-align: center;">
          <button onclick="search('keyword')">Keyword Search</button>
          <button onclick="search('hybrid')">Hybrid Search</button>
          <button onclick="search('generative')">Generative Search</button>
        </div>
        <div id="output"></div>

        <script>
          async function search(type) {
            const query = document.getElementById('query').value;
            const response = await fetch(\`/\${type}/\${encodeURIComponent(query)}\`);
            const result = await response.json();
            document.getElementById('output').innerText = result.content;
          }
        </script>
      </body>
      </html>
    `;
    return Promise.resolve(pageHtml);
  }

  @GetApi('/keyword/:query')
  static async getKeywordResults(ctxt: HandlerContext, query: string) {
    const result = await client.graphql
      .get()
      .withClassName("Matt_sleep_Col")
      .withBm25({ query })
      .withLimit(10)
      .withFields("content title start duration _additional { score } ")
      .do();

    // Return the content as part of a JSON object
    const content = result.data.Get.Matt_sleep_Col[0].content;
    return Promise.resolve({ content });
  }

  @GetApi('/hybrid/:query')
  static async getHybridResults(ctxt: HandlerContext, query: string) {
    const result = await client.graphql
      .get()
      .withClassName("Matt_sleep_Col")
      .withFields("content title start duration _additional { score } ")
      .withHybrid({ query, alpha: 0.7 })
      .withLimit(10)
      .do();

    // Return the content as part of a JSON object
    const content = result.data.Get.Matt_sleep_Col[0].content;
    return Promise.resolve({ content });
  }

  @GetApi('/generative/:query')
  static async getGenerativeResults(ctxt: HandlerContext, query: string) {
    const result = await client.graphql
      .get()
      .withClassName("Matt_sleep_Col")
      .withNearText({ concepts: [query] })
      .withGenerate({
        singlePrompt: `Matthew Walker received the following question: "${query}". Please provide a clear and detailed response as if Matthew Walker is directly answering the question, ensuring the explanation is easy to understand and addresses the key points.`,
      })
      .withLimit(10)
      .withFields("content title start duration _additional { score } ")
      .do();

    // Extract the content from the result
    const content = result.data.Get.Matt_sleep_Col[0].content;

    // Return the content wrapped in a JSON object
    return Promise.resolve({ content });
  }
}
