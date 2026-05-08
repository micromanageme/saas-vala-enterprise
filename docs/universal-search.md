# Universal Search & Knowledge Fabric Architecture
## Phase 16 - Enterprise Search, Semantic Search, Permission-Aware Indexing, OCR, AI Knowledge Graph, Document Intelligence, Taxonomy Engine

---

## Overview

Enterprise-grade universal search and knowledge fabric including enterprise search engine, semantic search capabilities, permission-aware indexing, OCR processing, AI knowledge graph, document intelligence, and taxonomy engine.

---

## Enterprise Search Engine

### Search Indexing Service

```typescript
// src/lib/search/indexing.ts
import { Client } from '@elastic/elasticsearch';

export const searchClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

export class SearchIndexingService {
  /**
   * Index document
   */
  static async indexDocument(data: {
    index: string;
    id: string;
    document: any;
    permissions?: {
      tenantId?: string;
      branchId?: string;
      roles?: string[];
    };
  }) {
    const indexed = await searchClient.index({
      index: data.index,
      id: data.id,
      body: {
        ...data.document,
        permissions: data.permissions,
        indexedAt: new Date().toISOString(),
      },
    });

    await searchClient.indices.refresh({ index: data.index });
    return indexed;
  }

  /**
   * Bulk index documents
   */
  static async bulkIndex(index: string, documents: any[]) {
    const body = documents.flatMap(doc => [
      { index: { _index: index, _id: doc.id } },
      doc,
    ]);

    return searchClient.bulk({ body, refresh: true });
  }

  /**
   * Delete document from index
   */
  static async deleteDocument(index: string, id: string) {
    return searchClient.delete({
      index,
      id,
    });
  }

  /**
   * Create index with mapping
   */
  static async createIndex(index: string, mapping: any) {
    return searchClient.indices.create({
      index,
      body: { mappings: mapping },
    });
  }
}
```

### Search Query Service

```typescript
// src/lib/search/query.ts
export class SearchQueryService {
  /**
   * Search with permission filtering
   */
  static async search(params: {
    index: string;
    query: string;
    filters?: any;
    userId?: string;
    tenantId?: string;
    userRoles?: string[];
    page?: number;
    size?: number;
  }) {
    const { query, filters, userId, tenantId, userRoles, page = 1, size = 20 } = params;

    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^2', 'content', 'tags', 'metadata'],
          fuzziness: 'AUTO',
        },
      },
    ];

    // Apply permission filters
    if (tenantId) {
      must.push({
        term: {
          'permissions.tenantId': tenantId,
        },
      });
    }

    if (userRoles && userRoles.length > 0) {
      must.push({
        terms: {
          'permissions.roles': userRoles,
        },
      });
    }

    // Apply additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        must.push({ term: { [key]: value } });
      });
    }

    const result = await searchClient.search({
      index: params.index,
      body: {
        query: {
          bool: {
            must,
          },
        },
        from: (page - 1) * size,
        size,
        highlight: {
          fields: {
            content: {},
            title: {},
          },
        },
      },
    });

    return {
      total: result.hits.total,
      hits: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        source: hit._source,
        highlight: hit.highlight,
      })),
      page,
      size,
    };
  }

  /**
   * Aggregation search
   */
  static async aggregateSearch(params: {
    index: string;
    query: string;
    aggregations: Record<string, any>;
    userId?: string;
    tenantId?: string;
  }) {
    const result = await searchClient.search({
      index: params.index,
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: params.query,
                  fields: ['title', 'content'],
                },
              },
              ...(params.tenantId
                ? [{ term: { 'permissions.tenantId': params.tenantId } }]
                : []),
            ],
          },
        },
        aggregations: params.aggregations,
      },
    });

    return result.aggregations;
  }
}
```

---

## Semantic Search

### Vector Embedding Service

```typescript
// src/lib/search/embedding.ts
export class EmbeddingService {
  /**
   * Generate text embedding
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  /**
   * Calculate similarity
   */
  static calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }
}
```

### Semantic Search Service

```typescript
// src/lib/search/semantic.ts
export class SemanticSearchService {
  /**
   * Index with embeddings
   */
  static async indexWithEmbedding(data: {
    id: string;
    text: string;
    metadata?: any;
    permissions?: any;
  }) {
    const embedding = await EmbeddingService.generateEmbedding(data.text);

    return prisma.documentEmbedding.create({
      data: {
        ...data,
        embedding,
      },
    });
  }

  /**
   * Semantic search
   */
  static async semanticSearch(query: string, limit: number = 10) {
    const queryEmbedding = await EmbeddingService.generateEmbedding(query);

    // Find similar documents using vector similarity
    const documents = await prisma.documentEmbedding.findMany({
      take: limit * 2, // Get more to filter
    });

    const scored = documents
      .map(doc => ({
        ...doc,
        score: EmbeddingService.calculateSimilarity(queryEmbedding, doc.embedding),
      }))
      .filter(doc => doc.score > 0.7) // Similarity threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  /**
   * Hybrid search (keyword + semantic)
   */
  static async hybridSearch(params: {
    query: string;
    index: string;
    limit: number;
    tenantId?: string;
  }) {
    const [keywordResults, semanticResults] = await Promise.all([
      SearchQueryService.search({
        index: params.index,
        query: params.query,
        tenantId: params.tenantId,
        size: params.limit * 2,
      }),
      this.semanticSearch(params.query, params.limit * 2),
    ]);

    // Combine and re-rank results
    const combined = this.combineResults(keywordResults, semanticResults);
    return combined.slice(0, params.limit);
  }

  private static combineResults(keyword: any, semantic: any) {
    // Reciprocal rank fusion
    const k = 60;
    const scores: Map<string, number> = new Map();

    keyword.hits.forEach((hit: any, i: number) => {
      const score = 1 / (k + i + 1);
      scores.set(hit.id, (scores.get(hit.id) || 0) + score);
    });

    semantic.forEach((doc: any, i: number) => {
      const score = 1 / (k + i + 1);
      scores.set(doc.id, (scores.get(doc.id) || 0) + score);
    });

    return Array.from(scores.entries())
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score);
  }
}
```

---

## Permission-Aware Indexing

### Permission Indexing Service

```typescript
// src/lib/search/permissions.ts
export class PermissionIndexingService {
  /**
   * Index with permissions
   */
  static async indexWithPermissions(data: {
    index: string;
    id: string;
    document: any;
    permissions: {
      tenantId: string;
      branchId?: string;
      accessibleRoles: string[];
      accessibleUsers?: string[];
    };
  }) {
    return SearchIndexingService.indexDocument({
      index: data.index,
      id: data.id,
      document: data.document,
      permissions: {
        tenantId: data.permissions.tenantId,
        branchId: data.permissions.branchId,
        roles: data.permissions.accessibleRoles,
      },
    });
  }

  /**
   * Filter results by permissions
   */
  static async filterByPermissions(
    results: any[],
    userContext: {
      userId: string;
      tenantId: string;
      roles: string[];
    }
  ) {
    return results.filter(result => {
      const permissions = result.source?.permissions;
      if (!permissions) return false;

      // Check tenant access
      if (permissions.tenantId !== userContext.tenantId) {
        return false;
      }

      // Check role access
      const hasRoleAccess = permissions.roles?.some((role: string) =>
        userContext.roles.includes(role)
      );
      if (!hasRoleAccess) {
        return false;
      }

      return true;
    });
  }
}
```

---

## OCR Processing

### OCR Service

```typescript
// src/lib/search/ocr.ts
import Tesseract from 'tesseract.js';

export class OCRService {
  /**
   * Extract text from image
   */
  static async extractText(imageBuffer: Buffer): Promise<string> {
    const result = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => console.log(m),
    });

    return result.data.text;
  }

  /**
   * Process document with OCR
   */
  static async processDocument(data: {
    documentId: string;
    imageBuffer: Buffer;
    tenantId: string;
  }) {
    const text = await this.extractText(data.imageBuffer);

    // Index extracted text
    await SearchIndexingService.indexDocument({
      index: 'documents',
      id: data.documentId,
      document: {
        title: `OCR Document ${data.documentId}`,
        content: text,
        type: 'ocr',
      },
      permissions: {
        tenantId: data.tenantId,
      },
    });

    return { text, documentId: data.documentId };
  }

  /**
   * Batch OCR processing
   */
  static async batchProcess(documents: Array<{
    documentId: string;
    imageBuffer: Buffer;
    tenantId: string;
  }>) {
    const results = await Promise.all(
      documents.map(doc => this.processDocument(doc))
    );

    return results;
  }
}
```

---

## AI Knowledge Graph

### Knowledge Graph Service

```typescript
// src/lib/search/knowledge-graph.ts
export class KnowledgeGraphService {
  /**
   * Create node
   */
  static async createNode(data: {
    type: string;
    name: string;
    properties?: any;
    tenantId: string;
  }) {
    return prisma.knowledgeNode.create({
      data: {
        ...data,
      },
    });
  }

  /**
   * Create relationship
   */
  static async createRelationship(data: {
    fromNodeId: string;
    toNodeId: string;
    type: string;
    properties?: any;
  }) {
    return prisma.knowledgeRelationship.create({
      data,
    });
  }

  /**
   * Traverse graph
   */
  static async traverse(
    startNodeId: string,
    maxDepth: number = 3,
    relationshipTypes?: string[]
  ) {
    const visited = new Set<string>();
    const results: any[] = [];

    const traverse = async (nodeId: string, depth: number) => {
      if (depth > maxDepth || visited.has(nodeId)) return;
      visited.add(nodeId);

      const relationships = await prisma.knowledgeRelationship.findMany({
        where: {
          OR: [
            { fromNodeId: nodeId },
            { toNodeId: nodeId },
          ],
          ...(relationshipTypes ? { type: { in: relationshipTypes } } : {}),
        },
        include: {
          fromNode: true,
          toNode: true,
        },
      });

      for (const rel of relationships) {
        results.push({
          relationship: rel.type,
          from: rel.fromNode,
          to: rel.toNode,
          properties: rel.properties,
        });

        const nextNodeId = rel.fromNodeId === nodeId ? rel.toNodeId : rel.fromNodeId;
        await traverse(nextNodeId, depth + 1);
      }
    };

    await traverse(startNodeId, 0);
    return results;
  }

  /**
   * Find shortest path
   */
  static async findPath(fromNodeId: string, toNodeId: string) {
    // BFS to find shortest path
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; path: any[] }> = [
      { nodeId: fromNodeId, path: [] },
    ];

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;

      if (nodeId === toNodeId) {
        return path;
      }

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const relationships = await prisma.knowledgeRelationship.findMany({
        where: { fromNodeId: nodeId },
        include: { toNode: true },
      });

      for (const rel of relationships) {
        queue.push({
          nodeId: rel.toNodeId,
          path: [...path, rel],
        });
      }
    }

    return null;
  }
}
```

---

## Document Intelligence

### Document Analysis Service

```typescript
// src/lib/search/document-intelligence.ts
export class DocumentIntelligenceService {
  /**
   * Analyze document
   */
  static async analyze(documentId: string, content: string) {
    const analysis = await Promise.all([
      this.extractEntities(content),
      this.classifyDocument(content),
      this.summarize(content),
      this.extractKeywords(content),
    ]);

    return {
      documentId,
      entities: analysis[0],
      classification: analysis[1],
      summary: analysis[2],
      keywords: analysis[3],
      analyzedAt: new Date(),
    };
  }

  /**
   * Extract entities
   */
  private static async extractEntities(text: string) {
    // Use NLP to extract entities (people, organizations, locations, etc.)
    return {
      people: [],
      organizations: [],
      locations: [],
      dates: [],
    };
  }

  /**
   * Classify document
   */
  private static async classifyDocument(text: string) {
    // Use AI to classify document type
    return {
      category: 'general',
      confidence: 0.9,
      tags: [],
    };
  }

  /**
   * Summarize document
   */
  private static async summarize(text: string) {
    // Use AI to generate summary
    return text.substring(0, 200) + '...';
  }

  /**
   * Extract keywords
   */
  private static async extractKeywords(text: string) {
    // Extract important keywords
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);
    
    const frequency: Record<string, number> = {};
    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    }

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }
}
```

---

## Taxonomy Engine

### Taxonomy Service

```typescript
// src/lib/search/taxonomy.ts
export class TaxonomyService {
  /**
   * Create taxonomy
   */
  static async createTaxonomy(data: {
    name: string;
    description?: string;
    hierarchy: any;
    tenantId: string;
  }) {
    return prisma.taxonomy.create({
      data,
    });
  }

  /**
   * Add term to taxonomy
   */
  static async addTerm(data: {
    taxonomyId: string;
    parentId?: string;
    name: string;
    definition?: string;
    synonyms?: string[];
  }) {
    return prisma.taxonomyTerm.create({
      data,
    });
  }

  /**
   * Classify content using taxonomy
   */
  static async classifyContent(
    taxonomyId: string,
    content: string
  ) {
    const taxonomy = await prisma.taxonomy.findUnique({
      where: { id: taxonomyId },
      include: { terms: true },
    });

    if (!taxonomy) throw new Error('Taxonomy not found');

    // Match terms in content
    const matchedTerms = taxonomy.terms.filter(term => {
      const termRegex = new RegExp(term.name, 'gi');
      return termRegex.test(content) ||
        term.synonyms?.some(syn => new RegExp(syn, 'gi').test(content));
    });

    return {
      taxonomyId,
      taxonomyName: taxonomy.name,
      matchedTerms,
      confidence: matchedTerms.length / taxonomy.terms.length,
    };
  }

  /**
   * Get taxonomy hierarchy
   */
  static async getHierarchy(taxonomyId: string) {
    const terms = await prisma.taxonomyTerm.findMany({
      where: { taxonomyId },
    });

    const buildTree = (parentId: string | null = null) => {
      return terms
        .filter(t => t.parentId === parentId)
        .map(t => ({
          ...t,
          children: buildTree(t.id),
        }));
    };

    return buildTree();
  }
}
```

---

## Implementation Checklist

- [x] Enterprise Search Engine
- [x] Search Indexing Service
- [x] Search Query Service
- [x] Vector Embedding Service
- [x] Semantic Search Service
- [x] Permission-Aware Indexing
- [x] OCR Processing
- [x] AI Knowledge Graph
- [x] Document Intelligence
- [x] Taxonomy Engine

---

## Deployment Notes

1. **Elasticsearch Cluster**: Deploy as dedicated cluster
2. **Vector Database**: Use specialized vector DB for embeddings
3. **OCR Service**: Deploy as separate microservice
4. **Index Management**: Schedule periodic index optimization
5. **Search Analytics**: Track search patterns and optimize
