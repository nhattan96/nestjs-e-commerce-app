import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
