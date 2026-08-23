import { IsNumber, IsObject, IsString, IsUrl, Validate } from 'class-validator';
import { CvProductSpecs } from '../custom-validators/CvProductSpects';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString({
    message: 'Name must be a string',
  })
  @ApiProperty({
    description: 'The name of the product',
    example: 'iPhone 13',
  })
  name: string;

  @IsString({
    message: 'Description must be a string',
  })
  @ApiProperty({
    description: 'The description of the product',
    example: 'Latest iPhone model with advanced features',
  })
  description: string;

  @IsNumber()
  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
  })
  price: number;

  @IsObject({
    message: 'Specs must be an object',
  })
  @Validate(CvProductSpecs, {
    message: 'Specs must be an object with valid keys and values',
  })
  @ApiProperty({
    description: 'The specifications of the product',
    example: { color: 'black', brand: 'Apple' },
  })
  specs: Record<string, string>;

  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'Image must be a valid URL',
    },
  )
  @ApiProperty({
    description: 'The image URL of the product',
    example:
      'https://images.pexels.com/photos/12741170/pexels-photo-12741170.jpeg',
  })
  image: string;
}
