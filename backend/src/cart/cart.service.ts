import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<CartItem> {
    // Verificar se o item já existe no carrinho
    const existingItem = await this.cartItemsRepository.findOne({
      where: {
        userId,
        productId: addToCartDto.productId,
      },
    });

    if (existingItem) {
      existingItem.quantity += addToCartDto.quantity;
      return this.cartItemsRepository.save(existingItem);
    }

    const cartItem = this.cartItemsRepository.create({
      userId,
      ...addToCartDto,
    });

    return this.cartItemsRepository.save(cartItem);
  }

  async getCart(userId: string): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async updateItem(
    id: string,
    userId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Item do carrinho #${id} não encontrado`);
    }

    cartItem.quantity = updateCartItemDto.quantity;
    return this.cartItemsRepository.save(cartItem);
  }

  async removeItem(id: string, userId: string): Promise<void> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Item do carrinho #${id} não encontrado`);
    }

    await this.cartItemsRepository.remove(cartItem);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemsRepository.delete({ userId });
  }
}
