import {
  Body,
  createHandler,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@storyofams/next-api-decorators';
import { CreateVehicleDTO } from '../../../lib/dto/create/create-vehicle.dto';

import AuthGuard from '../../../lib/middleware/auth.middleware';
import { prisma } from '../../../lib/prisma';

/* 
Example with user info:
@Get()
  @AuthGuard()
  public async vehicles(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse
  ) {
    const { user } = await getIronSession(req, res, sessionOptions);
    return await prisma.vehicle.findMany();
  }
*/

class VehicleHandler {
  @Get()
  public async findMany() {
    return await prisma.vehicle.findMany();
  }

  @Get('/:plate/mileage')
  public async mileage(@Param('plate') plate: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        plate: plate.replace(' ', '-').replace(' ', '-'),
      },
    });
    return vehicle ? vehicle.mileage : 0;
  }

  @Get('/:plate')
  @AuthGuard()
  public async findUnique(@Param('plate') plate: string) {
    return await prisma.vehicle.findUnique({
      where: {
        plate,
      },
    });
  }

  @Post('')
  @AuthGuard()
  public async create(@Body(ValidationPipe) body: CreateVehicleDTO) {
    const vehicle = await prisma.vehicle.create({
      data: {
        name: body.name,
        plate: body.plate.replace(' ', '-').replace(' ', '-'),
        mileage: body.mileage,
      },
    });
    return vehicle;
  }
}

export default createHandler(VehicleHandler);
