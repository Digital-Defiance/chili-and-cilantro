// src/services/api.ts
import axios from 'axios';
import { environment } from '../../environments/environment';

const api = axios.create({
  baseURL: environment.game.apiUrl,
});

export default api;
