// src/services/api.ts
import {
  LanguageCodes,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import axios from 'axios';
import { environment } from '../../environments/environment';

const api = axios.create({
  baseURL: environment.game.apiUrl,
});

api.interceptors.request.use((config) => {
  const languageCode =
    localStorage.getItem('languageCode') ??
    LanguageCodes[StringLanguages.EnglishUS];
  config.headers['Accept-Language'] = languageCode;
  return config;
});

export default api;
