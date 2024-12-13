import { Controller, Body, Param, UseGuards, Put } from '@nestjs/common';
import { CallService } from './call.service';
import { UpdateCallDto } from './dto/update-call.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callService.update(id, updateCallDto);
  }
}
