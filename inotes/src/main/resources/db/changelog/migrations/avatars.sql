--liquibase formatted sql

--changeset iliya132:init
create table if not exists avatars (
    id bigserial primary key,
    blob bytea not null,
    user_id bigint not null references users(id)
);

--changeset iliya132:unique-key
alter table avatars ADD CONSTRAINT avatars_user_id_uk UNIQUE (user_id);
