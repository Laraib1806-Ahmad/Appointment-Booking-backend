import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import { ChromaClient } from 'chromadb';
@Injectable()
export class AiService {
  constructor(private configService: ConfigService) {}
  private chromaClient = new ChromaClient({ host: 'localhost', port: 8000 });

  async ingestKnowledgeBase(): Promise<{ chunksStored: number }> {
    const pdfPath = path.join(
      process.cwd(),
      'src/modules/ai/knowledge/Hospital_FAQs.pdf',
    );
    const buffer = fs.readFileSync(pdfPath);
    const data = await pdf(buffer);
    const text = data.text;

    const chunkSize = 500;
    const overlap = 50;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    const collection = await this.chromaClient.getOrCreateCollection({
      name: 'hospital-faqs',
    });

    for (let i = 0; i < chunks.length; i++) {
      const response = await axios.post(
        'http://localhost:11434/api/embeddings',
        {
          model: 'nomic-embed-text',
          prompt: chunks[i],
        },
      );

      await collection.add({
        ids: [`chunk-${i}`],
        documents: [chunks[i]],
        embeddings: [response.data.embedding],
      });
    }

    return { chunksStored: chunks.length };
  }
  private async retrieveRelevantChunks(
    query: string,
    topK = 3,
  ): Promise<string[]> {
    const collection = await this.chromaClient.getOrCreateCollection({
      name: 'hospital-faqs',
    });

    const queryEmbedding = await axios.post(
      'http://localhost:11434/api/embeddings',
      {
        model: 'nomic-embed-text',
        prompt: query,
      },
    );

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding.data.embedding],
      nResults: topK,
    });

    return results.documents[0] as string[];
  }

  async askFaq(question: string): Promise<string> {
    const model = this.configService.get('OLLAMA_MODEL') || 'llama3.2';

    const relevantChunks = await this.retrieveRelevantChunks(question);
    const contextText = relevantChunks.join('\n------\n');

    const prompt = `You are a helpful assistant for a hospital appointment booking system.
Answer the patient's question using ONLY the information below.
If the answer isn't in the information given, say you don't have that information.

Hospital information:
${contextText}

Patient's question: "${question}"

Answer:`;
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model,
        prompt,
        stream: false,
      });
      return response.data.response.trim();
    } catch (error) {
      throw new InternalServerErrorException('FAQ answer failed');
    }
  }

  async recommendSpecialty(
    symptoms: string,
    availableSpecialties: string[],
  ): Promise<string> {
    const model = this.configService.get('OLLAMA_MODEL') || 'llama3.2';

    const prompt = `A patient describes these symptoms: "${symptoms}".
From this exact list of available specialties: ${availableSpecialties.join(
      ', ',
    )},
reply with ONLY the single best-matching specialty name, nothing else.`;

    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model,
        prompt,
        stream: false,
      });
      return response.data.response.trim();
    } catch (error) {
      throw new InternalServerErrorException('AI recommendation failed');
    }
  }
}
