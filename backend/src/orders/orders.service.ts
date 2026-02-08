import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${product.name}`,
        );
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      const orderItem = this.orderItemsRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      orderItems.push(orderItem);

      // Atualizar estoque
      await this.productsService.update(product.id, {
        stock: product.stock - item.quantity,
      });
    }

    const order = this.ordersRepository.create({
      userId,
      items: orderItems,
      total,
      shippingAddress: createOrderDto.shippingAddress,
    });

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
}
