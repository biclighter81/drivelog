import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateDrivelogDTO {
  @IsDateString()
  @IsOptional()
  dateString: string;

  @IsNumber()
  @IsPositive()
  tripLength: number;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  comment?: string;

  @IsString()
  @IsOptional()
  @Matches(/[A-ZÖÜÄ]{1,3}[ -][A-ZÖÜÄ]{1,2}[ -][1-9]{1}[0-9]{0,3}/)
  plate: string;
}
