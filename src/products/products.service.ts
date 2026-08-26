import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import {
  DefaultData,
  DefaultResponse,
} from 'src/common/interceptors/transform.interceptor';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(req: CreateProductDto): Promise<DefaultResponse<DefaultData>> {
    const product = this.productRepository.create(req);

    await this.productRepository.save(product);

    return {
      data: product,
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<DefaultResponse<DefaultData>> {
    const products = await this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
    };
  }

  findOne(id: string) {
    return this.productRepository.findOneBy({ id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.productRepository.delete(id);
  }
}
