import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DefaultAPIResponseResponse,
  DefaultData,
} from 'src/common/interceptors/api-response.interceptor';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

class findBuilderPattern {
  private repository: Repository<any>;
  private page: number;
  private limit: number;

  setRepository(repository: Repository<any>): findBuilderPattern {
    this.repository = repository;
    return this;
  }

  setPage(page: number): findBuilderPattern {
    this.page = page;
    return this;
  }

  setLimit(limit: number): findBuilderPattern {
    this.limit = limit;
    return this;
  }

  async find(): Promise<DefaultAPIResponseResponse<DefaultData>> {
    return this.repository
      .find({
        skip: (this.page - 1) * this.limit,
        take: this.limit,
      })
      .then((data) => {
        return {
          data: data,
        };
      });
  }
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    req: CreateProductDto,
  ): Promise<DefaultAPIResponseResponse<DefaultData>> {
    const product = this.productRepository.create(req);

    await this.productRepository.save(product);

    return {
      data: product,
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<DefaultAPIResponseResponse<DefaultData>> {
    // const products = await this.productRepository.find({
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    const products = await new findBuilderPattern()
      .setPage(page)
      .setLimit(limit)
      .setRepository(this.productRepository)
      .find();

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
