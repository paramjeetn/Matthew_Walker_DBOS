import weaviate, { WeaviateClient } from "weaviate-ts-client";
import 'dotenv/config'

// Initialize Weaviate client
const client: WeaviateClient = weaviate.client({
  scheme: "https",
  host: process.env.WEAVIATE_HOST,
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_KEY),
  headers: {
    "X-Google-Vertex-Api-Key": process.env.GEMINI_KEY,
    "X-HuggingFace-Api-Key": process.env.HUGGING_KEY,
  },
});

// Function to get Hybrid search results
export async function getHybridResults(query: string) {
  const Hybrid_Result = await client.graphql
    .get()
    .withClassName("Matt_sleep_Col")
    .withFields("content title start duration _additional { score } ")
    .withHybrid({
      query: query,
      alpha: 0.5, // optional, defaults to 0.75
    })
    .withLimit(2)
    .do();

  return Hybrid_Result;
}

// Function to get Keyword search results
export async function getKeywordResults(query: string) {
  const Keyword_result = await client.graphql
    .get()
    .withClassName("Matt_sleep_Col")
    .withBm25({
      query: query,
    })
    .withLimit(2)
    .withFields("content title start duration _additional { score } ")
    .do();

  return Keyword_result;
}

// Function to get Generative search results
export async function getGenerativeResults(query: string) {
  const generative_result = await client.graphql
    .get()
    .withClassName("Matt_sleep_Col")
    .withNearText({
      concepts: [query],
    })
    .withGenerate({
      singlePrompt: `${query} reply to this query as if you are Matt Walker his view is given below`,
    })
    .withLimit(2)
    .withFields("content title start duration _additional { score } ")
    .do();

  return generative_result;
}
