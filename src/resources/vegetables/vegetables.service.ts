import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { Vegetable } from 'src/database/sql/entities/vegetable.entity ';
import { responseModel } from 'src/helpers/response.helper';

@Injectable()
export class VegetablesService {
  async create(createVegetableDto: CreateVegetableDto) {
    try {
      //check if vegetable already added
      const vegetableCheck = await Vegetable.findOne({
        where: {
          name: createVegetableDto.name,
        },
      });

      if (vegetableCheck)
        throw new HttpException(
          `${createVegetableDto.name} is already exists`,
          HttpStatus.NOT_ACCEPTABLE,
        );

      await Vegetable.create({
        name: createVegetableDto.name,
        color: createVegetableDto.color,
        price: createVegetableDto.price,
      });

      return responseModel('vegetable added successfully.');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async findAll() {
    try {
      const vegetables = await Vegetable.findAll({
        attributes: ['name', 'color', 'price', 'createdAt', 'updatedAt'],
        raw: true,
      });

      return responseModel('vegetables', { vegetables: vegetables });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async findOne(id: number) {
    try {
      const vegetable = await Vegetable.findOne({
        attributes: ['name', 'color', 'price', 'createdAt', 'updatedAt'],
        raw: true,
        where: {
          vegetable_id: id,
        },
      });

      return responseModel('vegetable', { vegetable: vegetable });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async remove(id: number) {
    try {
      await Vegetable.destroy({
        where: {
          vegetable_id: id,
        },
      });

      return responseModel(`vegetable having id ${id} removed`);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
