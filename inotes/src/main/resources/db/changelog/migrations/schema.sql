--liquibase formatted sql

--changeset iliya132:init
CREATE TABLE users
(
    id bigserial primary key,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    enabled  bool         NOT NULL DEFAULT true
);

create table roles(
    id bigserial primary key,
    name text unique
);

create index ix_user_username
    on users (username);

--changeset iliya132:added-user-roles-table

create table user_roles
(
    user_id bigint not null references users(id) ,
    role_id bigint not null references roles(id),
    primary key (user_id, role_id)
);

--changeset iliya132:inserted-primary-roles
insert into roles(name) values ('ROLE_USER'), ('ROLE_ADMIN');

--changeset iliya132:added-oauth
alter table users add column if not exists external_user_name varchar(100) null;

--changeset iliya132:added-attributes-fields
alter table users add column if not exists external_id text;
alter table users add column if not exists external_login text;
alter table users add column if not exists external_default_email text;
alter table users add column if not exists external_is_avatar_empty bool;
alter table users add column if not exists external_psuid text;

--changeset iliya132:added-token-column
alter table users add column if not exists token text;

--changeset iliya132:added-display-name-column
alter table users add column if not exists display_name text;

--changeset iliya132:added-verification-code
alter table users add column if not exists verification_code text;

create type verification_type_enum as enum ('VERIFY_EMAIL', 'RESTORE_PASSWORD');

alter table users add column if not exists verification_type verification_type_enum;
alter table users add column if not exists verification_code_expire_at timestamp;
alter table users alter column external_default_email set not null;
create index if not exists idx_verification_code on users (verification_code);
