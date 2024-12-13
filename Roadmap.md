use pnpm
evaluate use of deltas instead of sending whole content (images!)

user based resources:

- replace username by id in createdBy, lastUpdatedBy fields of notes. for shoppingList / item username can be removed
  actually, were not doing anything with it.
- when no id is present (old notes), the user will be undefined, we can show ??? in Ui. only way around would be to
  manually edit the db


user dotenv instead of config service -> db migrations easier