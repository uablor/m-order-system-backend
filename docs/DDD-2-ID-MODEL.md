# DDD 2-ID Model

## Rule

| Layer        | ID usage |
|-------------|----------|
| **ORM**     | `id` / `<entity>_id` = technical PK (UUID for now). `domain_id` = business identity (UUID, unique). |
| **Domain**  | `id` = `UniqueEntityId` (domainId only). **Domain must never see DB technical id.** |
| **API/DTO** | Expose `id` as domainId (UUID string) only. |

## Convention

- **Mapper ORM → Domain:** `domain.id = UniqueEntityId.create(orm.domain_id ?? orm.<pk>)`
- **Mapper Domain → ORM:** `orm.domain_id = domain.id.value` (and set PK column for save)
- **Repository findById(domainId):** `WHERE domain_id = :domainId`
- **Repository save:** Set both PK column and `domain_id` from `aggregate.id.value`

## Migration

- `1738765200000-AddDomainIdToAllTables`: Adds `domain_id` to all tables, backfills from current PK, adds unique index. Existing UUID PK kept for FK integrity.

## Future (optional)

- Add technical `id` BIGINT AUTO_INCREMENT as new PK; switch FKs to reference it; keep `domain_id` as unique business key.
