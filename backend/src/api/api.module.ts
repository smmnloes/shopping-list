import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ApiController } from './api.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { MealPlan } from '../data/entities/meal-plan'
import { MealApiController } from './meal.api.controller'
import { ShoppingApiController } from './shopping.api.controller'
import { NotesApiController } from './notes.api.controller'
import { Note } from '../data/entities/note'
import { User } from '../data/entities/user'
import { UserKeyService } from '../data/crypto/user-key-service'
import { Location } from '../data/entities/location'
import { LocationsApiController } from './locations.api.controller'
import { SuggestionsService } from './services/suggestions-service'
import { TakeoutPayment } from '../data/entities/takeout-payment'
import { TakeoutApiController } from './takeout.api.controller'
import { NotificationsApiController } from './notifications.api.controller'
import { NotificationSubscription } from '../data/entities/notification-subscription'
import { NotificationService } from './services/notification-service'
import { FileShare } from '../data/entities/file-share'
import { PassphraseGenerator } from './services/passphrase-generator/passphrase-generator'
import { FileSharesApiController } from './file-shares-api-controller'
import { ArchiveService } from './services/archive-service'
import { InsultApiController } from './insult.api.controller'
import { BabyName } from '../data/entities/baby-name'
import { BabyNamesService } from './services/baby-names/baby-names-service'
import { BabyNamesApiController } from './baby-names.api.controller'

@Module({
  imports: [ AuthModule, TypeOrmModule.forFeature([ ShoppingList, ListItem, MealPlan, Note, User, Location, TakeoutPayment, NotificationSubscription, FileShare, BabyName ]) ],
  controllers: [
    ApiController, MealApiController, ShoppingApiController, NotesApiController, LocationsApiController, TakeoutApiController, NotificationsApiController, FileSharesApiController, InsultApiController, BabyNamesApiController
  ],
  providers: [ UserKeyService, SuggestionsService, NotificationService, PassphraseGenerator, ArchiveService, BabyNamesService ],
  exports: []
})
export class ApiModule {
}
