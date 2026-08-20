import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Comparison Engine Service
 * Analyzes regulatory requirements against product documents and generates evidence
 */
export class ComparisonEngineService {
  static async classifyRequirement(requirement, productPages) {
    // 1. Try Ollama if accessible
    try {
      if (config.ai.ollamaUrl) {
        const ollamaResult = await this.classifyWithOllama(requirement, productPages);
        if (ollamaResult) return ollamaResult;
      }
    } catch (err) {
      logger.debug('Ollama connection skipped, using intelligent comparison heuristics:', err.message);
    }

    // 2. Intelligent Regulatory Matching Heuristic
    return this.heuristicClassification(requirement, productPages);
  }

  static async classifyWithOllama(requirement, productPages) {
    const productText = productPages
      .slice(0, 5)
      .map(p => `[Page ${p.page}]\n${p.paragraphs.join('\n')}`)
      .join('\n\n');

    const prompt = `You are auditing a product document against a regulatory requirement.
Requirement: "${requirement.text}" (Clause: ${requirement.clauseId})

Product Document (paginated):
${productText}

Analyze if the product document fulfills the requirement. Return ONLY JSON with this format:
{
  "status": "verified" | "flagged" | "pending",
  "page": number or null,
  "paragraph": number or null,
  "excerpt": string or null,
  "confidence": number between 0 and 1
}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${config.ai.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ai.ollamaModel || 'llama3',
        prompt,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) return null;
    const data = await response.json();
    if (data.response) {
      const parsed = JSON.parse(data.response);
      return {
        status: parsed.status || 'pending',
        page: parsed.page || 1,
        paragraph: parsed.paragraph || 1,
        excerpt: parsed.excerpt || null,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85
      };
    }
    return null;
  }

  static heuristicClassification(requirement, productPages) {
    const reqText = requirement.text.toLowerCase();
    const keywords = reqText
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['shall', 'determine', 'ensure', 'requirements', 'products', 'organization'].includes(w));

    let bestMatch = null;
    let highestScore = 0;

    for (const page of productPages) {
      page.paragraphs.forEach((paragraph, pIndex) => {
        const pLower = paragraph.toLowerCase();
        let matchCount = 0;

        keywords.forEach(kw => {
          if (pLower.includes(kw)) matchCount++;
        });

        const score = keywords.length ? matchCount / keywords.length : 0;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            page: page.page,
            paragraph: pIndex + 1,
            excerpt: paragraph,
            score
          };
        }
      });
    }

    // Determine status & confidence based on match score
    if (highestScore >= 0.35 && bestMatch) {
      return {
        status: 'verified',
        page: bestMatch.page,
        paragraph: bestMatch.paragraph,
        excerpt: bestMatch.excerpt.length > 280 ? `${bestMatch.excerpt.slice(0, 280)}...` : bestMatch.excerpt,
        confidence: Math.min(0.98, Math.round((0.80 + highestScore * 0.18) * 100) / 100)
      };
    } else if (highestScore >= 0.15 && bestMatch) {
      return {
        status: 'pending',
        page: bestMatch.page,
        paragraph: bestMatch.paragraph,
        excerpt: `Partial match detected in specification: "${bestMatch.excerpt.slice(0, 180)}..." Review recommended.`,
        confidence: Math.round((0.55 + highestScore * 0.15) * 100) / 100
      };
    } else {
      return {
        status: 'flagged',
        page: null,
        paragraph: null,
        excerpt: `No supporting specification or operational procedure found in product documentation for requirement ${requirement.clauseId}.`,
        confidence: 0.92
      };
    }
  }
}

export default ComparisonEngineService;
