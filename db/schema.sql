-- pnpm db:setup 으로 적용한다. 여러 번 실행해도 안전하게 if not exists 만 쓴다

-- /api/extract 호출 1건당 1행. 이미지·추출 결과·접근 코드는 저장하지 않는다
create table if not exists request_logs (
  id            bigint generated always as identity primary key,
  at            timestamptz not null default now(),
  env           text not null,
  request_id    text not null,
  ip            text not null,
  document_type text,
  pages         smallint,
  bytes         integer,
  engine        text not null,
  status        smallint not null,
  ms            integer not null,
  input_tokens  integer,
  output_tokens integer,
  error         text
);

create index if not exists request_logs_at_idx on request_logs (at desc);
create index if not exists request_logs_status_idx on request_logs (status, at desc);
