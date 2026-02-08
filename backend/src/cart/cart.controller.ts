import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addItem(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItem(req.user.userId, addToCartDto);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Patch(':id')
  updateItem(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(id, req.user.userId, updateCartItemDto);
  }

  @Delete(':id')
  removeItem(@Param('id') id: string, @Request() req) {
    return this.cartService.removeItem(id, req.user.userId);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
