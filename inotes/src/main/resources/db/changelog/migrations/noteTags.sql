--liquibase formatted sql

--changeset iliya132:init
create table if not exists note_tags(
    note_id bigserial not null references notes(id),
    tag text not null,
    primary key (note_id, tag)
);

create index if not exists idx_note_id on note_tags (note_id);
