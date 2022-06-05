--liquibase formatted sql

--changeset iliya132:init
create table if not exists notebooks (
    id bigserial primary key,
    name text not null,
    owner bigint not null,
    color text null
);

create index if not exists idx_user on notebooks (owner);
