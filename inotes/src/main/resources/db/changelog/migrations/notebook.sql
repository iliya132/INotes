--liquibase formatted sql

--changeset iliya132:init
create table if not exists notebooks (
    id bigserial primary key,
    name text not null,
    owner bigint not null,
    color text null
);

create index if not exists idx_user on notebooks (owner);

--changeset iliya132:added-grouped-notebooks
create table if not exists notebook_access (
    notebook_id bigserial foreign key references notebooks (id),
    user_id bigserial foreign key references users(id),
    primary key (notebook_id, user_id)
);

insert into notebook_access
select id, owner from notebooks;
