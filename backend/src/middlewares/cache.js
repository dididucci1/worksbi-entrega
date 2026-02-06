// Cache em memória otimizado
class MemoryCache {
  constructor(ttl = 300000) { // 5 minutos padrão
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Verifica se expirou
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Limpa cache expirado a cada 5 minutos
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, 300000);
  }
}

// Instância global do cache
const userCache = new MemoryCache(parseInt(process.env.CACHE_TTL) || 300000);
userCache.startCleanup();

module.exports = userCache;
