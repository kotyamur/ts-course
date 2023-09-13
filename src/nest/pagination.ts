//tasks.controller.ts
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	UsePipes,
	ValidationPipe,
	Query,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
		return this.tasksService.create(createTaskDto, +req.user.id)
	}
//pagination need be first
  @Get('pagination')
	@UseGuards(JwtAuthGuard)
	findAllWithPagination(
		@Req() req,
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 6,
	) {
		return this.tasksService.findAllWithPagination(+req.user.id, +page, +limit)
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Req() req) {
		return this.tasksService.findAll(+req.user.id)
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	findOne(@Param('id') id: string) {
		return this.tasksService.findOne(+id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
		return this.tasksService.update(+id, updateTaskDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	remove(@Param('id') id: string) {
		return this.tasksService.remove(+id)
	}
}

//task.service.ts

async findAllWithPagination(id: number, page: number, limit: number) {
		const tasks = await this.taskRepository.find({
			where: {
				user_id: { id },
			},
			relations: {
				category_id: true,
			},
			order: {
				dateEnd: 'ASC',
			},
			take: limit,
			skip: (page - 1) * limit,
		})
		return tasks
	}
