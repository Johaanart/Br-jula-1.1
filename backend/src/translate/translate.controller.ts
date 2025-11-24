import { Controller, Post, Body } from '@nestjs/common';

interface TranslateRequest {
  text: string;
  targetLang: string;
  isHTML?: boolean;
}

@Controller('translate')
export class TranslateController {
  
  @Post()
  async translate(@Body() body: TranslateRequest) {
    const { text, targetLang, isHTML } = body;

    // Si el idioma es español, retornar el texto original
    if (targetLang === 'es' || !text) {
      return { translatedText: text };
    }

    try {
      // Usar traducción básica basada en diccionario
      // En producción, aquí podrías integrar Google Cloud Translation API
      // o cualquier otro servicio de traducción profesional
      
      return {
        translatedText: text, // Por ahora retorna el original
        note: 'Para traducción automática completa, integra Google Cloud Translation API'
      };
    } catch (error) {
      console.error('Error translating:', error);
      return { translatedText: text, error: 'Translation failed' };
    }
  }

  @Post('batch')
  async translateBatch(@Body() body: { texts: string[]; targetLang: string }) {
    const { texts, targetLang } = body;

    if (targetLang === 'es') {
      return { translatedTexts: texts };
    }

    try {
      // Traducir múltiples textos en una sola llamada
      const translatedTexts = texts.map(text => text); // Por ahora retorna originales

      return { translatedTexts };
    } catch (error) {
      console.error('Error in batch translation:', error);
      return { translatedTexts: texts, error: 'Batch translation failed' };
    }
  }
}
