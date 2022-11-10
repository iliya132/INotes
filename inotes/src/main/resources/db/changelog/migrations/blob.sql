--liquibase formatted sql

--changeset iliya132:init
create table if not exists blob (
    id bigserial primary key,
    file_name text not null,
    data bytea not null,
    user_id bigint not null references users(id),
    size bigint not null
);

create index if not exists idx_user_id on blob (user_id);

--changeset iliya132:added-unique-constraint
alter table blob add column if not exists note_id bigint not null references notes(id);
alter table blob add constraint uq_note_filename unique (file_name, note_id);

--changeset iliya132:added-on-delete-cascade-constraint
begin;
    alter table blob
    drop constraint blob_note_id_fkey,
    add constraint blob_note_id_fkey
        foreign key (note_id) references notes(id)
        on delete cascade;
commit;
