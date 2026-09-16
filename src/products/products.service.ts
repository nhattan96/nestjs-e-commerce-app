import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DefaultAPIResponseResponse,
  DefaultData,
} from 'src/common/interceptors/api-response.interceptor';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

class findBuilderPattern<T extends ObjectLiteral> {
  private repository: Repository<T>;
  private page?: number;
  private limit?: number;
  private query: FindManyOptions<T> = {};

  setRepository(repository: Repository<T>): findBuilderPattern<T> {
    this.repository = repository;
    return this;
  }

  setPagination(page: number, limit: number): this {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1) {
      throw new Error('Limit must be greater than 0');
    }

    this.page = page;
    this.limit = limit;
    return this;
  }

  setQuery(query: FindManyOptions<T>): this {
    if (!this.repository) {
      throw new Error('Repository is not set');
    }

    this.query = {
      ...this.query,
      ...query,
    };

    return this;
  }

  async find(): Promise<DefaultAPIResponseResponse<DefaultData>> {
    if (!this.repository) {
      throw new Error('Repository is not set');
    }

    const options: FindManyOptions<T> = {};

    if (this.page !== undefined && this.limit !== undefined) {
      options.skip = (this.page - 1) * this.limit;
      options.take = this.limit;
    }

    if (this.query) {
      options.where = this.query.where;
      options.relations = this.query.relations;
      options.order = this.query.order;
      options.select = this.query.select;
    }

    return this.repository.find(options).then((data) => {
      return {
        data,
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

    const products = await new findBuilderPattern<Product>()
      .setRepository(this.productRepository)
      .setPagination(page, limit)
      .setQuery({
        where: {
          name: 'iPhone 14',
        },
      })
      .find();

    return products;
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
