// Tipos para a API da IA (ex: requisição e resposta)

export interface AIEnhancementRequest {
  text: string;
  context: 'summary' | 'experience';
}

export interface AIEnhancementResponse {
  improvedText: string;
}
