import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Param, Query, Body } from '@nestjs/common/decorators';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { NinjasService } from './ninjas.service';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { NotFoundException } from '@nestjs/common/exceptions';

@Controller('ninjas')
export class NinjasController {
  constructor(private readonly ninjasService: NinjasService) {}

  // GET /ninjas?weapon=star --> []
  @Get()
  getNinjas(@Query('weapon') weapon: 'stars' | 'nunchucks') {
    return this.ninjasService.getNinjas(weapon);
  }

  // GET /ninjas/:id --> {...}
  @Get(':id')
  getOneNinja(@Param('id', ParseIntPipe) id: number) {
    try {
      // return this.ninjasService.getNinja(id);
      return {};
    } catch (err) {
      throw new NotFoundException();
    }
  }

  // POST /ninjas --> {...}
  @Post()
  createNinja(@Body() createNinjaDto: CreateNinjaDto) {
    return {
      name: createNinjaDto.name,
    };
  }

  // PUT /ninjas/:id --> {...}
  @Put(':id')
  updateNinja() {
    return {};
  }

  // DELETE /ninjas/:id --> {...}
  @Delete(':id')
  deleteNinja() {
    return {};
  }
}
