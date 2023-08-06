import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VegetablesService } from './vegetables.service';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('vegetables')
export class VegetablesController {
  constructor(private readonly vegetablesService: VegetablesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createVegetableDto: CreateVegetableDto) {
    return this.vegetablesService.create(createVegetableDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.vegetablesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vegetablesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vegetablesService.remove(+id);
  }
}
