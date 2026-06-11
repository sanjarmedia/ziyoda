import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  users as initialUsers, 
  animals as initialAnimals, 
  vetRecords as initialVetRecords, 
  feedStock as initialFeedStock,
  feedPlans as initialFeedPlans
} from '../src/data/mockData.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Neon PostgreSQL connection pool
const connectionString = "postgresql://neondb_owner:npg_S9NHQl3ZgbxG@ep-solitary-firefly-aoneg0yb-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- Database Table Initialization and Seeding ---
async function initDb() {
  try {
    // 1. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        "fullName" VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        avatar VARCHAR(10) DEFAULT '👤'
      )
    `);

    // 2. Animals Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        tag VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        breed VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        weight NUMERIC(8, 2) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(100) NOT NULL,
        notes TEXT,
        image VARCHAR(10),
        "dailyMilk" NUMERIC(6, 2) DEFAULT 0,
        vaccinated BOOLEAN DEFAULT FALSE,
        "entryDate" DATE NOT NULL,
        "lastCheckup" DATE NOT NULL
      )
    `);

    // 3. Vet Records Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vet_records (
        id SERIAL PRIMARY KEY,
        "animalId" INTEGER REFERENCES animals(id) ON DELETE CASCADE,
        "animalName" VARCHAR(100) NOT NULL,
        "animalTag" VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        type VARCHAR(50) NOT NULL,
        diagnosis VARCHAR(250) NOT NULL,
        treatment VARCHAR(250) NOT NULL,
        doctor VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        cost NUMERIC(12, 2) DEFAULT 0,
        notes TEXT
      )
    `);

    // 4. Feed Stock Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feed_stock (
        name VARCHAR(100) PRIMARY KEY,
        amount NUMERIC(10, 2) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL
      )
    `);

    // 5. Feed Plans Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feed_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        "animalType" VARCHAR(50) NOT NULL,
        description TEXT,
        items JSONB NOT NULL,
        "totalCost" NUMERIC(12, 2) DEFAULT 0,
        calories INTEGER DEFAULT 0,
        season VARCHAR(50)
      )
    `);

    console.log("PostgreSQL Tables verified/created successfully.");

    // --- Seeding if tables are empty ---
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(usersCount.rows[0].count) === 0) {
      console.log("Seeding users...");
      for (const u of initialUsers) {
        await pool.query(
          'INSERT INTO users (username, password, "fullName", role, avatar) VALUES ($1, $2, $3, $4, $5)',
          [u.username, u.password, u.fullName, u.role, u.avatar]
        );
      }
    }

    const animalsCount = await pool.query('SELECT COUNT(*) FROM animals');
    if (parseInt(animalsCount.rows[0].count) === 0) {
      console.log("Seeding animals...");
      for (const a of initialAnimals) {
        await pool.query(
          'INSERT INTO animals (id, tag, name, type, breed, age, weight, gender, status, location, notes, image, "dailyMilk", vaccinated, "entryDate", "lastCheckup") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
          [a.id, a.tag, a.name, a.type, a.breed, a.age, a.weight, a.gender, a.status, a.location, a.notes, a.image, a.dailyMilk, a.vaccinated, a.entryDate, a.lastCheckup]
        );
      }
      // Reset serial sequence for animals to prevent conflicts on insertion
      await pool.query("SELECT setval('animals_id_seq', COALESCE((SELECT MAX(id)+1 FROM animals), 1), false)");
    }

    const recordsCount = await pool.query('SELECT COUNT(*) FROM vet_records');
    if (parseInt(recordsCount.rows[0].count) === 0) {
      console.log("Seeding vet records...");
      for (const r of initialVetRecords) {
        await pool.query(
          'INSERT INTO vet_records (id, "animalId", "animalName", "animalTag", date, type, diagnosis, treatment, doctor, status, cost, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
          [r.id, r.animalId, r.animalName, r.animalTag, r.date, r.type, r.diagnosis, r.treatment, r.doctor, r.status, r.cost, r.notes]
        );
      }
      // Reset sequence
      await pool.query("SELECT setval('vet_records_id_seq', COALESCE((SELECT MAX(id)+1 FROM vet_records), 1), false)");
    }

    const stockCount = await pool.query('SELECT COUNT(*) FROM feed_stock');
    if (parseInt(stockCount.rows[0].count) === 0) {
      console.log("Seeding feed stock...");
      for (const s of initialFeedStock) {
        await pool.query(
          'INSERT INTO feed_stock (name, amount, unit, status) VALUES ($1, $2, $3, $4)',
          [s.name, s.amount, s.unit, s.status]
        );
      }
    }

    const plansCount = await pool.query('SELECT COUNT(*) FROM feed_plans');
    if (parseInt(plansCount.rows[0].count) === 0) {
      console.log("Seeding feed plans...");
      for (const p of initialFeedPlans) {
        await pool.query(
          'INSERT INTO feed_plans (id, name, "animalType", description, items, "totalCost", calories, season) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [p.id, p.name, p.animalType, p.description, JSON.stringify(p.items), p.totalCost, p.calories, p.season]
        );
      }
      // Reset sequence
      await pool.query("SELECT setval('feed_plans_id_seq', COALESCE((SELECT MAX(id)+1 FROM feed_plans), 1), false)");
    }

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Error initializing Database tables:", err);
  }
}

// --- API Routing & Handlers ---

// 1. Authentication
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Foydalanuvchi nomi yoki parol notoʻgʻri!' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Users CRUD
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, fullName, role, avatar } = req.body;
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'Foydalanuvchi nomi band!' });
    }
    const result = await pool.query(
      'INSERT INTO users (username, password, "fullName", role, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, password, fullName, role, avatar]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, fullName, role, avatar } = req.body;
  try {
    if (username) {
      const checkUser = await pool.query('SELECT * FROM users WHERE username = $1 AND id <> $2', [username, id]);
      if (checkUser.rows.length > 0) {
        return res.status(400).json({ message: 'Foydalanuvchi nomi band!' });
      }
    }
    const result = await pool.query(
      'UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), "fullName" = COALESCE($3, "fullName"), role = COALESCE($4, role), avatar = COALESCE($5, avatar) WHERE id = $6 RETURNING *',
      [username, password, fullName, role, avatar, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Foydalanuvchi oʻchirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Animals CRUD
app.get('/api/animals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals ORDER BY id ASC');
    // Map date fields to string 'YYYY-MM-DD'
    const formatted = result.rows.map(a => ({
      ...a,
      age: parseInt(a.age),
      weight: parseFloat(a.weight),
      dailyMilk: parseFloat(a.dailyMilk),
      entryDate: a.entryDate.toISOString().split('T')[0],
      lastCheckup: a.lastCheckup.toISOString().split('T')[0]
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/animals', async (req, res) => {
  const { name, type, breed, age, weight, gender, status, location, notes, image, dailyMilk } = req.body;
  try {
    // Generate Tag
    let prefix = 'QM';
    if (type === "qo'y") prefix = 'QY';
    if (type === 'echki') prefix = 'EC';
    
    const countRes = await pool.query('SELECT COUNT(*) FROM animals WHERE type = $1', [type]);
    const sameTypeCount = parseInt(countRes.rows[0].count);
    const tagNum = String(sameTypeCount + 1).padStart(3, '0');
    const tag = `${prefix}-${tagNum}`;

    const entryDate = new Date().toISOString().split('T')[0];
    const lastCheckup = entryDate;

    const result = await pool.query(
      'INSERT INTO animals (tag, name, type, breed, age, weight, gender, status, location, notes, image, "dailyMilk", vaccinated, "entryDate", "lastCheckup") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false, $13, $14) RETURNING *',
      [tag, name, type, breed, age, weight, gender, status, location, notes, image, dailyMilk, entryDate, lastCheckup]
    );

    const created = result.rows[0];
    created.entryDate = created.entryDate.toISOString().split('T')[0];
    created.lastCheckup = created.lastCheckup.toISOString().split('T')[0];
    created.weight = parseFloat(created.weight);
    created.dailyMilk = parseFloat(created.dailyMilk);

    res.json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  const { name, breed, age, weight, gender, status, location, notes, dailyMilk, vaccinated, lastCheckup } = req.body;
  try {
    const result = await pool.query(
      `UPDATE animals SET 
        name = COALESCE($1, name), 
        breed = COALESCE($2, breed), 
        age = COALESCE($3, age), 
        weight = COALESCE($4, weight), 
        gender = COALESCE($5, gender), 
        status = COALESCE($6, status), 
        location = COALESCE($7, location), 
        notes = COALESCE($8, notes), 
        "dailyMilk" = COALESCE($9, "dailyMilk"),
        vaccinated = COALESCE($10, vaccinated),
        "lastCheckup" = COALESCE($11, "lastCheckup")
      WHERE id = $12 RETURNING *`,
      [name, breed, age, weight, gender, status, location, notes, dailyMilk, vaccinated, lastCheckup, id]
    );
    if (result.rows.length > 0) {
      const updated = result.rows[0];
      updated.entryDate = updated.entryDate.toISOString().split('T')[0];
      updated.lastCheckup = updated.lastCheckup.toISOString().split('T')[0];
      updated.weight = parseFloat(updated.weight);
      updated.dailyMilk = parseFloat(updated.dailyMilk);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Hayvon topilmadi' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM animals WHERE id = $1', [id]);
    res.json({ message: 'Hayvon oʻchirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Vet Records CRUD
app.get('/api/vet-records', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vet_records ORDER BY date DESC, id DESC');
    const formatted = result.rows.map(r => ({
      ...r,
      cost: parseFloat(r.cost),
      date: r.date.toISOString().split('T')[0]
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/vet-records', async (req, res) => {
  const { animalId, animalName, animalTag, type, diagnosis, treatment, doctor, status, cost, notes } = req.body;
  const date = new Date().toISOString().split('T')[0];
  try {
    const result = await pool.query(
      'INSERT INTO vet_records ("animalId", "animalName", "animalTag", date, type, diagnosis, treatment, doctor, status, cost, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [animalId, animalName, animalTag, date, type, diagnosis, treatment, doctor, status, cost, notes]
    );

    // Reactive automation rules
    if (status === 'davom etmoqda' && type === 'Davolash') {
      await pool.query('UPDATE animals SET status = \'davolanmoqda\', "lastCheckup" = $1 WHERE id = $2', [date, animalId]);
    }
    if (type === 'Emlash') {
      await pool.query('UPDATE animals SET vaccinated = true, "lastCheckup" = $1 WHERE id = $2', [date, animalId]);
    }
    await pool.query('UPDATE animals SET "lastCheckup" = $1 WHERE id = $2', [date, animalId]);

    const created = result.rows[0];
    created.date = created.date.toISOString().split('T')[0];
    created.cost = parseFloat(created.cost);

    res.json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/vet-records/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE vet_records SET status = COALESCE($1, status) WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length > 0) {
      const updated = result.rows[0];
      updated.date = updated.date.toISOString().split('T')[0];
      updated.cost = parseFloat(updated.cost);

      // If resolved, check if we should resolve animal health status to healthy
      if (status === 'yakunlangan') {
        const record = updated;
        const otherActive = await pool.query(
          'SELECT COUNT(*) FROM vet_records WHERE "animalId" = $1 AND id <> $2 AND status = \'davom etmoqda\'',
          [record.animalId, id]
        );
        if (parseInt(otherActive.rows[0].count) === 0) {
          await pool.query('UPDATE animals SET status = \'sog\'lom\' WHERE id = $1', [record.animalId]);
        }
      }

      res.json(updated);
    } else {
      res.status(404).json({ message: 'Yozuv topilmadi' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/vet-records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM vet_records WHERE id = $1', [id]);
    res.json({ message: 'Yozuv oʻchirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Feed Stock Refill
app.get('/api/feed-stock', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feed_stock ORDER BY name ASC');
    const formatted = result.rows.map(item => ({
      ...item,
      amount: parseFloat(item.amount)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/feed-stock/refill', async (req, res) => {
  const { name, amount } = req.body;
  try {
    const current = await pool.query('SELECT * FROM feed_stock WHERE name = $1', [name]);
    if (current.rows.length > 0) {
      const newAmount = parseFloat(current.rows[0].amount) + parseFloat(amount);
      let newStatus = 'yetarli';
      if (newAmount < 50) {
        newStatus = 'juda kam';
      } else if (newAmount < 200) {
        newStatus = 'kam';
      }

      const result = await pool.query(
        'UPDATE feed_stock SET amount = $1, status = $2 WHERE name = $3 RETURNING *',
        [newAmount, newStatus, name]
      );
      const updated = result.rows[0];
      updated.amount = parseFloat(updated.amount);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Ozuqa turi topilmadi' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Feed Plans CRUD
app.get('/api/feed-plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feed_plans ORDER BY id ASC');
    const formatted = result.rows.map(p => ({
      ...p,
      totalCost: parseFloat(p.totalCost),
      calories: parseInt(p.calories)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/feed-plans', async (req, res) => {
  const { name, animalType, description, items, totalCost, calories, season } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO feed_plans (name, "animalType", description, items, "totalCost", calories, season) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, animalType, description, JSON.stringify(items), totalCost, calories, season]
    );
    const created = result.rows[0];
    created.totalCost = parseFloat(created.totalCost);
    created.calories = parseInt(created.calories);
    res.json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/feed-plans/:id', async (req, res) => {
  const { id } = req.params;
  const { name, animalType, description, items, totalCost, calories, season } = req.body;
  try {
    const result = await pool.query(
      `UPDATE feed_plans SET 
        name = COALESCE($1, name), 
        "animalType" = COALESCE($2, "animalType"), 
        description = COALESCE($3, description), 
        items = COALESCE($4, items), 
        "totalCost" = COALESCE($5, "totalCost"), 
        calories = COALESCE($6, calories), 
        season = COALESCE($7, season) 
      WHERE id = $8 RETURNING *`,
      [name, animalType, description, items ? JSON.stringify(items) : null, totalCost, calories, season, id]
    );
    if (result.rows.length > 0) {
      const updated = result.rows[0];
      updated.totalCost = parseFloat(updated.totalCost);
      updated.calories = parseInt(updated.calories);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Ratsion topilmadi' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/feed-plans/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM feed_plans WHERE id = $1', [id]);
    res.json({ message: 'Ratsion oʻchirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. Feed Stock Consumption
app.post('/api/feed-stock/consume', async (req, res) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Sarf qilinadigan ozuqalar topilmadi!' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify sufficient stock for all requested items
    for (const item of items) {
      const stockRes = await client.query('SELECT amount, unit FROM feed_stock WHERE name = $1', [item.name]);
      if (stockRes.rows.length === 0) {
        throw new Error(`Omborda '${item.name}' nomli ozuqa turi topilmadi!`);
      }
      
      const currentAmount = parseFloat(stockRes.rows[0].amount);
      const consumeAmount = parseFloat(item.amount);
      
      if (currentAmount < consumeAmount) {
        throw new Error(`Omborda '${item.name}' ozuqasidan yetarli miqdor mavjud emas! (Talab etiladi: ${consumeAmount} ${stockRes.rows[0].unit}, mavjud: ${currentAmount} ${stockRes.rows[0].unit})`);
      }
    }

    // 2. Perform updates
    const updatedStock = [];
    for (const item of items) {
      const stockRes = await client.query('SELECT amount, unit FROM feed_stock WHERE name = $1', [item.name]);
      const currentAmount = parseFloat(stockRes.rows[0].amount);
      const consumeAmount = parseFloat(item.amount);
      
      const newAmount = currentAmount - consumeAmount;
      let newStatus = 'yetarli';
      if (newAmount < 50) {
        newStatus = 'juda kam';
      } else if (newAmount < 200) {
        newStatus = 'kam';
      }

      const updateRes = await client.query(
        'UPDATE feed_stock SET amount = $1, status = $2 WHERE name = $3 RETURNING *',
        [newAmount, newStatus, item.name]
      );
      
      const updatedItem = updateRes.rows[0];
      updatedItem.amount = parseFloat(updatedItem.amount);
      updatedStock.push(updatedItem);
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Ozuqa ombordan chegirildi', updatedStock });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});

// Start Express server locally or on render/Vercel
if (!process.env.VERCEL) {
  app.listen(port, async () => {
    console.log(`Ziyoda backend server running on http://localhost:${port}`);
    await initDb();
  });
} else {
  // Trigger DB table check/seeding immediately on cold start
  initDb();
}

export default app;
