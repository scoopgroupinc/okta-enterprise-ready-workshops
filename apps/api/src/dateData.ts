import { Router } from 'express';
export const dateData = Router();
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();

interface IUserDateDataSchema {
  id?: number;
  date: string;
  timezone: string;
  userId: number;
  water?: number;
  mood?: number;
}

const defaultDateDataSchema: IUserDateDataSchema = {
  date: moment().format('YYYYMMDD'),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  userId: null,
  water: -1,
  mood: -1,
};

// Create or Update Date Data Function
// POST /datedata/
// RFC Notes on Creating Users: https://www.rfc-editor.org/rfc/rfc7644#section-3.3
dateData.post('/', async (req, res) => {
  const newDate: IUserDateDataSchema = req.body;
  console.log(req.body);
  const { date, timezone, water, mood } = newDate;

  const duplicateUserDate = await prisma.userDateData.findFirst({
    select: {
      id: true,
      water: true,
      mood: true,
    },
    where: {
      date,
      timezone,
      userId: req.user['id'],
    },
  });
  console.log('duplicateUserDate: ', duplicateUserDate);
  let dateResponse: IUserDateDataSchema;
  const httpStatus = 201;

  // If there is any records returned, then we have a duplicate
  if (duplicateUserDate) {
    dateResponse = await prisma.userDateData.update({
      where: {
        id: duplicateUserDate.id,
      },
      data: {
        water: water !== undefined ? water : duplicateUserDate.water,
        mood: mood !== undefined ? mood : duplicateUserDate.mood,
      },
    });

    console.log('Date Data Updated: ', dateResponse.id);
  } else {
    // If we don't find one Create...
    // Create the User in the database
    const createDateData = await prisma.userDateData.create({
      data: {
        date,
        timezone,
        userId: req.user['id'],
        water: water || 0,
        mood: mood || 0,
      },
    });

    console.log('Date Data Created ID: ', createDateData.id);

    dateResponse = {
      ...defaultDateDataSchema,
      id: createDateData.id,
      date: createDateData.date,
      timezone: createDateData.timezone,
      userId: createDateData.userId,
      water: createDateData.water,
      mood: createDateData.mood,
    };
  }

  res.status(httpStatus).json(dateResponse);
});

// Read UserDateData Function
// GET /datedata/:userId
dateData.get('/', async (req, res) => {
  // Use req.query to access query parameters instead of req.body
  const { date, timezone } = req.query;
  console.log(req.query);
  try {
    const dateData = await prisma.userDateData.findFirst({
      select: {
        id: true,
        date: true,
        timezone: true,
        userId: true,
        water: true,
        mood: true,
      },
      where: {
        date: date as string,
        timezone: timezone as string,
        userId: req.user['id'],
      },
    });

    if (dateData) {
      res.json(dateData);
    } else {
      res
        .status(404)
        .json({ message: `No data found for user ${req.user['id']}` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});
