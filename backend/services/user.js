import express from 'express';
import { db } from '../db.js'; // 👈 Usa la conexión global
const router = express.Router();

// =====================================================
// 🔹 OBTENER USUARIO POR ID
// =====================================================
router.get('/:id', (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuario:', err);
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(results[0]);
  });
});

// =====================================================
// 🔹 OBTENER USUARIO POR EMAIL
// =====================================================
router.get('/email/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuario por email:', err);
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }

    if (!results || results.length === 0) {
      return res.json(null);
    }

    return res.json(results[0]);
  });
});

// =====================================================
// 🔹 CREAR NUEVO USUARIO (verifica duplicado por email)
// =====================================================
router.post('/', (req, res) => {
  const user = req.body;

  if (!user.email) {
    return res.status(400).json({ error: 'El campo email es obligatorio.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [user.email], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar usuario existente:', err);
      return res.status(500).json({ error: 'Error al verificar usuario' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'El usuario ya está registrado' });
    }

    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error('❌ Error al crear usuario:', err);
        return res.status(500).json({ error: 'Error al crear usuario' });
      }

      return res.json({ id: result.insertId, ...user });
    });
  });
});

// =====================================================
// 🔹 ACTUALIZAR USUARIO POR EMAIL
// =====================================================
router.put('/email/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const userData = req.body;

  db.query('UPDATE users SET ? WHERE email = ?', [userData, email], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar usuario por email:', err);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    }

    return res.json({ message: '✅ Usuario actualizado correctamente' });
  });
});

export default router;
