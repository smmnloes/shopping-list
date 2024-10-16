import { Controller, Get, NotFoundException, Param, Request, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { MealPlan } from '../data/entities/meal-plan'
import { ExtendedRequest } from '../util/request-types'

@Controller('api')
export class MealApiController {
  constructor(
    @InjectRepository(MealPlan) readonly mealPlanRepository: Repository<MealPlan>
  ) {
  }


  @UseGuards(JwtAuthGuard)
  @Get('meals/:weekyear')
  async getMealsForWeek(@Param('weekyear') weekYear: string): Promise<{ meals: (string)[] }> {
    const result = await this.mealPlanRepository.findOne({where: {weekYear}})
    if (result === null) {
      throw new NotFoundException('Meal plan not found')
    } else {
      return {meals: result.meals}
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('meals/:weekyear')
  async saveMealsForWeek(@Param('weekyear') weekYear: string, @Request() {body: {meals}, user: {username}}: ExtendedRequest<{
    meals: string[]
  }>): Promise<void> {
    const toSave = await this.mealPlanRepository.findOne({where: {weekYear}}).then(result => {
      if (result) {
        result.meals = meals
        return result
      } else {
        return new MealPlan(username, weekYear, meals)
      }
    })
    await this.mealPlanRepository.save(toSave)
  }

}
