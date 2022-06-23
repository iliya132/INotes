--liquibase formatted sql

--changeset iliya132:init
create table if not exists notes (
    id bigserial primary key,
    name text unique not null,
    notebook bigint not null references notebooks (id),
    content text null
);

--changeset iliya132:added-cascade-deletion
ALTER TABLE notes
DROP CONSTRAINT notes_notebook_fkey,
ADD CONSTRAINT notes_notebook_fkey
FOREIGN KEY (notebook)
REFERENCES notebooks(id)
ON DELETE CASCADE;

--changeset iliya132:added-shared-url
alter table notes add column is_public_url_shared bool not null default false;

--changeset iliya132:added-public_id
alter table notes add column public_id text null;
