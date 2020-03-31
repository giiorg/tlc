import searchClient from '../../core/elasticsearch';
import { Indexable } from './indexable.interface';

export class SearchService {
  async index(namespace: string, data: Indexable) {
    const { id, ...body } = data;
    return searchClient.index({
      index: namespace,
      id,
      body,
    });
  }
}
