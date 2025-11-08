import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './services/user.js';
import { db } from './db.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// 🔹 Verificar conexión
db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL correctamente.');
  }
});

// 🔹 Ruta principal
app.get('/', (req, res) => {
  res.send('🚀 Backend funcionando correctamente con MySQL y Express');
});

// 🔹 Rutas de usuarios
app.use('/api/users', userRoutes);

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor ejecutándose en http://localhost:${PORT}`));
