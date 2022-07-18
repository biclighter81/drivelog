import {
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateVehicleDTO {
  @IsString()
  @Matches(/[A-ZÖÜÄ]{1,3}[ -][A-ZÖÜÄ]{1,2}[ -][1-9]{1}[0-9]{0,3}/)
  plate: string;
  @IsNumber()
  @IsPositive()
  mileage: number;
  @IsString()
  @Length(3, 16)
  name: string;
}
