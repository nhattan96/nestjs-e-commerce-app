import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import {
  DefaultData,
  DefaultAPIResponseResponse,
} from 'src/common/interceptors/api-response.interceptor';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class OrdersService {
  constructor(
    private paginationService: PaginationService,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(req: CreateOrderDto) {
    const product = await this.productRepository.findOneBy({
      id: req.productId,
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < req.quantity) {
      throw new Error('Insufficient product stock');
    }

    const order = this.orderRepository.create({
      product,
      quantity: req.quantity,
      totalPrice: product.price * req.quantity,
    });

    await this.orderRepository.save(order);

    return {
      message: 'Order created successfully',
      order,
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<DefaultAPIResponseResponse<DefaultData>> {
    const orders = await this.orderRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        product: true,
      },
    });

    const totalItems = await this.orderRepository.count();

    const paginationMeta = this.paginationService.getPaginationMeta(
      page,
      limit,
      totalItems,
    );

    return {
      data: { orders, paginationMeta },
    };
  }

  async findOne(id: string): Promise<DefaultAPIResponseResponse<DefaultData>> {
    const order = await this.orderRepository.findOne({
      where: { id },
      select: {
        id: true,
        quantity: true,
        product: {
          name: true,
          price: true,
          image: true,
        },
      },
      relations: {
        product: true,
      },
    });

    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    return {
      data: order,
    };
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<DefaultAPIResponseResponse<DefaultData>> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    Object.assign(order, updateOrderDto);

    await this.orderRepository.save(order);

    return {
      data: order,
    };
  }

  async remove(id: string): Promise<DefaultAPIResponseResponse<DefaultData>> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    await this.orderRepository.remove(order);
    return {
      data: order,
    };
  }
}
