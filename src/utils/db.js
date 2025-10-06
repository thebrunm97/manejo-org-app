// src/utils/db.js

import { openDB } from 'idb';

const DB_NAME = 'pmo-digital-db';
const STORE_NAME = 'pending-pmos';
const DB_VERSION = 1;

// Inicializa o banco de dados e a object store
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Cria uma "tabela" (object store) chamada 'pending-pmos'
    // O 'keyPath' define a propriedade que será a chave primária de cada objeto.
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  },
});

/**
 * Um wrapper para interagir com o IndexedDB de forma simples.
 */
export const localDb = {
  /**
   * Obtém um valor pela chave.
   * @param {string} key A chave do objeto a ser recuperado.
   */
  async get(key) {
    return (await dbPromise).get(STORE_NAME, key);
  },
  
  /**
   * Adiciona ou atualiza um valor. O método 'put' faz um "upsert".
   * @param {object} value O objeto a ser salvo. Precisa ter uma propriedade 'id'.
   */
  async set(value) {
    return (await dbPromise).put(STORE_NAME, value);
  },
  
  /**
   * Deleta um valor pela chave.
   * @param {string} key A chave do objeto a ser deletado.
   */
  async delete(key) {
    return (await dbPromise).delete(STORE_NAME, key);
  },
  
  /**
   * Obtém todos os valores da store.
   * @returns {Promise<Array<object>>} Uma promessa que resolve com um array de todos os objetos.
   */
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },

  /**
   * Limpa todos os valores da store.
   */
  async clear() {
    return (await dbPromise).clear(STORE_NAME);
  }
};