import {
  BadRequestException,
  Body,
  createHandler,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  ValidationPipe,
} from '@storyofams/next-api-decorators';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../lib/authentication/session';
import { CreateDrivelogDTO } from '../../../lib/dto/create/create-drivelog.dto';
import { UpdateDrivelogDTO } from '../../../lib/dto/update/update-drivelog.dto';
import AuthGuard from '../../../lib/middleware/auth.middleware';
import { prisma } from '../../../lib/prisma';
import dayjs from 'dayjs';

class DrivelogHandler {
  @Get()
  @AuthGuard()
  async findMany() {
    return await prisma.drivelog.findMany();
  }

  @Get('/:id')
  @AuthGuard()
  async findUnique(@Param('id') id: string) {
    return await prisma.drivelog.findUnique({
      where: {
        id,
      },
    });
  }

  @Get('/:from/:to')
  @AuthGuard()
  async findByDate(@Param('from') fromStr: string, @Param('to') toStr: string) {
    let from: Date;
    let to: Date;
    try {
      from = new Date(fromStr);
      to = new Date(toStr);
    } catch (e) {
      throw new BadRequestException('Invalid date format!');
    }
    return await prisma.drivelog.findMany({
      where: {
        date: {
          lte: to,
          gte: from,
        },
      },
    });
  }

  @Post('')
  @AuthGuard()
  async create(
    @Body(ValidationPipe) body: CreateDrivelogDTO,
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse
  ) {
    const { user } = await getIronSession(req, res, sessionOptions);
    if (user) {
      let vehicle = await prisma.vehicle.findUnique({
        where: {
          plate: body.plate.replace(' ', '-').replace(' ', '-'),
        },
        select: {
          created_at: true,
          drivelogs: {
            orderBy: {
              date: 'desc',
            },
          },
          mileage: true,
          name: true,
          updated_at: true,
          plate: true,
        },
      });

      if (!vehicle) {
        throw new BadRequestException('Vehicle not found!');
      }

      if (
        (vehicle.drivelogs.length &&
          dayjs(body.dateString).isBefore(vehicle.drivelogs[0]?.date)) ||
        body.previousMileage < vehicle.mileage
      ) {
        const drivelogError = await prisma.drivelogError.findFirst({
          where: {
            expectedMileage: body.previousMileage,
            AND: {
              vehicle_plate: body.plate.replace(' ', '-').replace(' ', '-'),
              AND: {
                triplength: body.mileage - body.previousMileage,
              },
            },
          },
        });
        if (!drivelogError) {
          throw new BadRequestException(
            'Mileage is lower than last mileage! And no drivelog error found!'
          );
        } else {
          await prisma.drivelogError.delete({
            where: {
              id: drivelogError.id,
            },
          });
          const drivelog = await prisma.drivelog.create({
            data: {
              comment: body.comment ?? '',
              date: new Date(body.dateString),
              triplength: drivelogError.triplength,
              uid: user.id,
              vehicle_plate: vehicle.plate,
            },
          });
          return drivelog;
        }
      }

      if (body.mileage <= body.previousMileage) {
        throw new BadRequestException(
          'Mileage is lower or equal than last mileage!'
        );
      }

      if (vehicle.mileage != body.previousMileage) {
        await prisma.drivelogError.create({
          data: {
            expectedMileage: vehicle.mileage,
            actualMileage: body.previousMileage,
            triplength: body.previousMileage - vehicle.mileage,
            date: new Date(),
            vehicle_plate: vehicle.plate,
          },
        });
      }

      await prisma.vehicle.update({
        where: {
          plate: vehicle.plate,
        },
        data: {
          mileage: body.previousMileage + (body.mileage - body.previousMileage),
        },
      });

      const drivelog = await prisma.drivelog.create({
        data: {
          date: new Date(body.dateString),
          comment: body.comment ? body.comment : '',
          triplength: body.mileage - body.previousMileage,
          vehicle_plate: body.plate.replace(' ', '-').replace(' ', '-'),
          uid: user.id,
        },
      });

      if (vehicle.mileage != body.previousMileage) {
        return {
          ...drivelog,
          warning: 'Mileage error detected! But drivelog created!',
        };
      }
      return drivelog;
    }
    return res.status(401).json({});
  }

  @Put('/:id')
  @AuthGuard()
  async update(
    @Body(ValidationPipe) body: UpdateDrivelogDTO,
    @Param('id') id: string
  ) {
    return await prisma.drivelog.update({
      where: {
        id: id,
      },
      data: {
        triplength: body.tripLength,
        vehicle_plate: body.plate?.replace(' ', '-').replace(' ', '-'),
        comment: body.comment,
        date: body.dateString ? new Date(body.dateString) : undefined,
      },
    });
  }
}

export default createHandler(DrivelogHandler);
