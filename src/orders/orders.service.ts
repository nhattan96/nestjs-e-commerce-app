import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import {
  DefaultData,
  DefaultResponse,
} from 'src/common/interceptors/transform.interceptor';

@Injectable()
export class OrdersService {
  constructor(
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
  ): Promise<DefaultResponse<DefaultData>> {
    const orders = await this.orderRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        product: true,
      },
    });
    return {
      data: orders,
    };
  }

  async findOne(id: string): Promise<DefaultResponse<DefaultData>> {
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
        message: 'Order not found',
        messageCode: '404',
        statusCode: 404,
      };
    }

    return {
      data: order,
    };
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<DefaultResponse<DefaultData>> {
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

  async remove(id: string): Promise<DefaultResponse<DefaultData>> {
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
