import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  IsIn,
} from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsNotEmpty()
  public searchQuery: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['username', 'first_name', 'last_name'])
  public orderBy: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ASC', 'DESC'])
  public order: string;
}
