--liquibase formatted sql

--changeset iliya132:init
create table if not exists notes (
    id bigserial primary key,
    name text unique not null,
    notebook bigint not null references notebooks (id),
    content text null
);
