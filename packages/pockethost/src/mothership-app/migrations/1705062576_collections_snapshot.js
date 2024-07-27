/// <reference path="../pb_hooks/types/types.d.ts" />
migrate(
  (db) => {
    const MOTHERSHIP_DATA_ROOT = $os.getenv('MOTHERSHIP_DATA_ROOT')
    const snapshot = require(
      `${MOTHERSHIP_DATA_ROOT}/pb_migrations/_db_snapshot.json`,
    ).filter((item) => item.type === 'base')

    const collections = snapshot.map((item) => new Collection(item))

    Dao(db).importCollections(collections, true, null)
  },
  (db) => {
    return null
  },
)
