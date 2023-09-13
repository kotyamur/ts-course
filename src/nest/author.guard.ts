import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Injectable
} from '@nestjs/common'

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly tasksService: TasksService,
    private readonly categoriesService: CategoriesService
  ) {}
  async CanActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { id, type } = request.params

    let entity

    switch (type) {
      case 'task':
        entity = await this.tasksService.findOne(+id)
        break
      case 'category':
        entity = await this.categoriesService.findOne(+id)
        break
      default:
        throw new NotFoundException('Something went wrong...')
    }
    const user = request.user
    if(entity && user && entity.user.id === user.id) {
      return true
    }
    return false
    //throw new BadRequestException('Something went wrong...')
  }
}
//cats.controller.ts

import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @UseGuards(AuthorGuard)
  @Get(':type/:id')
  findOne(@Param() params: any): string {
    return `This action returns a #${params.id} cat`;
  }
}

//TasksModule module add CategoriesService  and Categories and in CategoriesModule add TasksService and Task
@Module({
	imports: [TypeOrmModule.forFeature([Task, Categories])],
	controllers: [TasksController],
	providers: [TasksService, CategoriesService],
})
export class TasksModule {}
