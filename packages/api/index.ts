import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { check, validationResult } from 'express-validator';

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

let client: MongoClient;

// Utility functions
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(DATABASE_URL);
    await client.connect();
  }
  return client.db();
}

// Middleware

function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Controllers
async function searchController(req: Request, res: Response) {
  const { q } = req.query;
  if (!q) return res.status(400).send({ error: 'Query parameter is required' });

  try {
    const db = await connectToDatabase();
    const searchRegex = { $regex: q, $options: 'i' };

    const [hotels, countries, cities] = await Promise.all([
      db.collection('hotels').find(
        {
          $or: [
            { hotel_name: searchRegex },
            { city: searchRegex },
            { country: searchRegex },
          ],
        },
        { projection: { _id: 1, hotel_name: 1, city: 1, country: 1 } }
      ).toArray(),
      db.collection('countries').find(
        { country: searchRegex },
        { projection: { _id: 1, country: 1 } }
      ).toArray(),
      db.collection('cities').find(
        { name: searchRegex },
        { projection: { _id: 1, name: 1 } }
      ).toArray()
    ]);

    res.send({ hotels, cities, countries });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send({ error: 'Failed to fetch data' });
  }
}

async function hotelController(req: Request, res: Response) {
  const { name } = req.params;
  try {
    const db = await connectToDatabase();
    const hotel = await db.collection('hotels').findOne({ hotel_name: name });
    if (!hotel) return res.status(404).send({ error: 'Hotel not found' });
    res.send(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).send({ error: 'Failed to fetch hotel' });
  }
}

async function cityController(req: Request, res: Response) {
  const { name } = req.params;
  try {
    const db = await connectToDatabase();
    const city = await db.collection('cities').findOne({ name: name });
    if (!city) return res.status(404).send({ error: 'City not found' });
    res.send(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).send({ error: 'Failed to fetch city' });
  }
}

async function countryController(req: Request, res: Response) {
  const { name } = req.params;
  try {
    const db = await connectToDatabase();
    const country = await db.collection('countries').findOne({ country: name });
    if (!country) return res.status(404).send({ error: 'Country not found' });
    res.send(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).send({ error: 'Failed to fetch country' });
  }
}

// Routes
const searchRoutes = express.Router();
searchRoutes.get('/search', [check('q').notEmpty().withMessage('Query parameter is required')], validateRequest, searchController);

const hotelRoutes = express.Router();
hotelRoutes.get('/hotels/:name', hotelController);

const cityRoutes = express.Router();
cityRoutes.get('/cities/:name', cityController);

const countryRoutes = express.Router();
countryRoutes.get('/countries/:name', countryController);

// Use routes
app.use(searchRoutes);
app.use(hotelRoutes);
app.use(cityRoutes);
app.use(countryRoutes);


app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});
