import { Controller, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { MealPlan } from '../data/entities/meal-plan'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import type { MealsForWeek } from '../../../shared/types/meals'

@Controller('api')
export class MealApiController {
  constructor(
    @InjectRepository(MealPlan) readonly mealPlanRepository: Repository<MealPlan>
  ) {
  }


  @UseGuards(JwtAuthGuard)
  @Get('meals/:weekyear')
  async getMealsForWeek(@Param('weekyear') weekYear: string): Promise<MealsForWeek> {
    const result = await this.mealPlanRepository.findOne({ where: { weekYear } })
    if (result === null) {
      throw new NotFoundException('Meal plan not found')
    } else {
      return { meals: result.meals, checks: result.checks }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('meals/:weekyear')
  async saveMealsForWeek(@Param('weekyear') weekYear: string, @Request() {
    body: { meals, checks }
  }: ExtendedJWTGuardRequest<MealsForWeek>): Promise<void> {
    const toSave = await this.mealPlanRepository.findOne({ where: { weekYear } }).then(result => {
      if (result) {
        result.meals = meals
        result.checks = checks
        return result
      } else {
        return new MealPlan(weekYear, meals, checks)
      }
    })
    await this.mealPlanRepository.save(toSave)
  }
}
