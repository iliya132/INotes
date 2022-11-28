--liquibase formatted sql

--changeset iliya132:init
create table if not exists note_tags(
    note_id bigserial not null references notes(id),
    tag text not null,
    primary key (note_id, tag)
);

create index if not exists idx_note_id on note_tags (note_id);

--changeset iliya132:fix-for-deleting-notes
begin;
alter table note_tags
drop constraint note_tags_note_id_fkey,
add constraint note_tags_note_id_fkey foreign key (note_id) references notes(id)
    on delete cascade
