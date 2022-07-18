import {
  IsDateString,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateDrivelogDTO {
  @IsDateString()
  dateString: string;

  @IsNumber()
  @IsPositive()
  mileage: number;

  @IsNumber()
  @IsPositive()
  previousMileage: number;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  comment?: string;

  @IsString()
  @Matches(/[A-ZÖÜÄ]{1,3}[ -][A-ZÖÜÄ]{1,2}[ -][1-9]{1}[0-9]{0,3}/)
  plate: string;
}
