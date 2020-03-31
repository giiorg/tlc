import { Client } from '@elastic/elasticsearch';

const elasticsearchClient = new Client({
  node: process.env.ELASTIC_SEARCH_URL,
});

export default elasticsearchClient;
