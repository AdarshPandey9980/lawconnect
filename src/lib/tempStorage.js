// lib/tempStorage.js
const tempStorage = new Map();

export const storeTempData = (data) => {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
  tempStorage.set(id, {
    data,
    timestamp: Date.now()
  });
  
  // Clean up old data (older than 1 hour)
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, value] of tempStorage.entries()) {
    if (value.timestamp < oneHourAgo) {
      tempStorage.delete(key);
    }
  }
  
  return id;
};

export const getTempData = (id) => {
  const data = tempStorage.get(id);
  if (data) {
    tempStorage.delete(id); // Remove after retrieval
    return data.data;
  }
  return null;
};