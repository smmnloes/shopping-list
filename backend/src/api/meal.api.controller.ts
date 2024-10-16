import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { MealPlan } from '../data/entities/meal-plan'

@Controller('api')
export class MealApiController {
  constructor(
    @InjectRepository(MealPlan) readonly mealPlanRepository: Repository<MealPlan>
  ) {
  }


  @UseGuards(JwtAuthGuard)
  @Get('meals/:weekyear')
  async getMealsForWeek(@Param('weekyear') weekYear: string): Promise<{ meals: (string | null)[] }> {
    const result = await this.mealPlanRepository.findOne({where: {weekYear}})
    if (result === null) {
      throw new NotFoundException('Meal plan not found')
    } else {
      return {meals: result.meals}
    }
  }

}
