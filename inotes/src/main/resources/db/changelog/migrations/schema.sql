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
