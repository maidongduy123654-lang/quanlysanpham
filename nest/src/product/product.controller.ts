import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  // ✅ AN TOÀN
  @Get('stats')
  getStats() {
    return this.productService.getStats();
  }

  

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: Partial<CreateProductDto>) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  // ✅ AN TOÀN: Tăng/giảm kho nhanh
  @Patch(':id/stock')
  updateStock(@Param('id', ParseIntPipe) id: number, @Body('amount') amount: number) {
    return this.productService.updateStock(id, amount);
  }

  @Get(':id/logs')
  getLogs(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getInventoryLogs(id);
  }

  @Post(':id/variants')
  addVariant(@Param('id', ParseIntPipe) id: number, @Body() variantData: any) {
    return this.productService.addVariant(id, variantData);
  }
}
