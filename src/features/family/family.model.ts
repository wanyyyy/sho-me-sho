import {
  type DocumentTemplate,
  type RepeatGroup,
  repeatRowKeys,
  repeatRows,
  type TemplateDocument,
  type TemplateField,
} from "@/shared/lib/template";

/** 가족관계증명서(상세) 고정 칸 키 */
export const FK = {
  registryBase: "registryBase",
  personName: "person.name",
  personBirthDate: "person.birthDate",
  personResidentNumber: "person.residentNumber",
  personGender: "person.gender",
  personOrigin: "person.origin",
  certifiedAt: "certifiedAt",
  issuerTitle: "issuerTitle",
  issuerName: "issuerName",
  issueNumber: "issueNumber",
  issuedTime: "issuedTime",
  issuerOfficer: "issuerOfficer",
  issuerPhone: "issuerPhone",
  applicant: "applicant",
  stampSerial: "stamp.serial",
  stampOffice: "stamp.office",
  stampAmount: "stamp.amount",
  stampDate: "stamp.date",
  stampCode: "stamp.code",
  stampIssuedTime: "stamp.issuedTime",
} as const;

const f = (
  key: string,
  labelKo: string,
  labelJa: string,
  kind: TemplateField["kind"] = "text",
): TemplateField => ({ key, labelKo, labelJa, kind });

export const FAMILY_FIELDS: TemplateField[] = [
  f(FK.registryBase, "등록기준지", "登録基準地"),
  f(FK.personName, "본인 성명", "本人 氏名", "name"),
  f(FK.personBirthDate, "본인 출생연월일", "本人 出生年月日", "date"),
  f(
    FK.personResidentNumber,
    "본인 주민등록번호",
    "本人 住民登録番号",
    "number",
  ),
  f(FK.personGender, "본인 성별", "本人 性別"),
  f(FK.personOrigin, "본인 본", "本人 本籍"),
  f(FK.certifiedAt, "증명일", "証明日", "date"),
  f(FK.issuerTitle, "발급기관장 직함", "発給機関長"),
  f(FK.issuerName, "발급기관장 성명", "発給機関長 氏名", "name"),
  f(FK.issueNumber, "발행번호", "発給番号", "number"),
  f(FK.issuedTime, "발급시각", "発給時刻"),
  f(FK.issuerOfficer, "발급담당자", "発給担当者", "name"),
  f(FK.issuerPhone, "전화", "電話", "number"),
  f(FK.applicant, "신청인", "申請人", "name"),
  f(FK.stampSerial, "수입증지 일련번호", "収入証紙 番号", "number"),
  f(FK.stampOffice, "수입증지 발행관서", "収入証紙 発行官署"),
  f(FK.stampAmount, "수입증지 금액", "収入証紙 金額"),
  f(FK.stampDate, "수입증지 날짜", "収入証紙 日付"),
  f(FK.stampCode, "수입증지 코드", "収入証紙 コード", "number"),
  f(FK.stampIssuedTime, "증지발행시각", "証紙発行時刻"),
];

/** 가족사항 표. 부·모·배우자·자녀 한 사람이 행 하나 */
export const FAMILY_REPEAT: RepeatGroup = {
  key: "family",
  labelKo: "가족사항",
  labelJa: "家族事項",
  fields: [
    { sub: "relation", labelKo: "구분", labelJa: "区分", kind: "text" },
    { sub: "name", labelKo: "성명", labelJa: "氏名", kind: "name" },
    {
      sub: "birthDate",
      labelKo: "출생연월일",
      labelJa: "出生年月日",
      kind: "date",
    },
    {
      sub: "residentNumber",
      labelKo: "주민등록번호",
      labelJa: "住民登録番号",
      kind: "number",
    },
    { sub: "gender", labelKo: "성별", labelJa: "性別", kind: "text" },
    { sub: "origin", labelKo: "본", labelJa: "本籍", kind: "text" },
  ],
};

/** 양식(일본어)에 고정으로 찍히는 머릿글·문구 */
export const FAMILY_LABELS = {
  title: "家 族 関 係 証 明 書 ( 詳 細 )",
  registryBase: "登録基準地",
  personHead: [
    "区分",
    "氏　　名",
    "出生年月日",
    "住民登録番号",
    "性別",
    "本籍",
  ],
  self: "本人",
  family: "家族事項",
  empty: "記録する事項がありません。",
  statement:
    "上の家族関係証明書(詳細)は家族関係登録簿の記録事項と相違いない事を証明します。",
  note: "※ 上の証明書は「家族関係の登録などに関する法律」第15条第3項による登録事項を顕出する詳細証明書です。",
  issueNumber: "発給番号",
  footnote:
    "＊ 電子家族関係登録システム（https://efamily.scourt.go.kr）の証明書真偽確認メニューで発給日から3か月まで偽変造の如何が確認できます。",
  issuedTime: "発給時刻",
  officer: "発給担当者",
  phone: "☏",
  applicant: "申請人",
  stampIssuedTime: "証紙発行時刻",
  noStampNote: "（収入証紙が印影されていない証明は、その効力を保証できません）",
  seal: "職印",
  pageOf: "1 / 1",
} as const;

function sections(doc: TemplateDocument) {
  return [
    { title: "등록기준지", keys: [FK.registryBase] },
    {
      title: "본인",
      keys: [
        FK.personName,
        FK.personBirthDate,
        FK.personResidentNumber,
        FK.personGender,
        FK.personOrigin,
      ],
    },
    ...repeatRows(FAMILY_REPEAT, doc).map((i) => ({
      title: `${FAMILY_REPEAT.labelKo} ${i + 1}`,
      keys: repeatRowKeys(FAMILY_REPEAT, i),
    })),
    {
      title: "증명",
      keys: [FK.certifiedAt, FK.issuerTitle, FK.issuerName, FK.issueNumber],
    },
    {
      title: "발급 정보",
      keys: [FK.issuedTime, FK.issuerOfficer, FK.issuerPhone, FK.applicant],
    },
    {
      title: "수입증지",
      keys: [
        FK.stampSerial,
        FK.stampOffice,
        FK.stampAmount,
        FK.stampDate,
        FK.stampCode,
        FK.stampIssuedTime,
      ],
    },
  ];
}

/**
 * 가족관계증명서(상세) 템플릿. 한국어 원문 → 일본어 번역. 일본 시약소 제출용 양식(1쪽)을 따른다.
 * 가족사항 표는 가족 수만큼 행이 달라 가변 행으로 받는다
 */
export const FAMILY_TEMPLATE: DocumentTemplate<"family"> = {
  type: "family",
  source: "ko",
  target: "ja",
  title: { ko: "가족관계증명서(상세)", ja: "家族関係証明書(詳細)" },
  description: "가족관계증명서(상세) → 시약소 제출용 일본어 양식",
  orientation: "portrait",
  fields: FAMILY_FIELDS,
  repeats: [FAMILY_REPEAT],
  prompt: {
    intro:
      "이 이미지는 대한민국 가족관계등록부의 가족관계증명서(상세)다. 표의 각 칸을 읽어 아래 키에 맞춰 채워라. ko 에는 원문을 그대로, ja 에는 일본 관공서 제출용 일본어 번역을 넣는다.",
    rules: [
      '날짜: 자릿수를 그대로 두고 단위만 바꾼다. "1992년 02월 20일" → "1992年 02月 20日".',
      '이름: 가타카나 음독 + 괄호 안 한자 유지. "김대완(金垈完)" → "キム・デワン(金垈完)". 괄호 한자가 없으면 가타카나만.',
      '주소: 시/구/동/로/길/번지 → 市/区/洞/路/街/番地, 지명은 한자 표기. "서울특별시 구로구 개봉로19길 51" → "ソウル特別市 九老区 開峰路19街 51".',
      "성별 남/여 → 男/女. 본(本)의 한자(예: 安東)는 그대로. 주민등록번호는 그대로.",
      "family 는 '가족사항' 아래 표이며 사람 한 명이 행 하나. 표에 적힌 순서를 지킨다. relation: 부 → 父, 모 → 母, 배우자 → 配偶者, 자녀 → 子, 양부 → 養父, 양모 → 養母, 계부 → 継父, 계모 → 継母. '본인' 행은 family 에 넣지 않고 person 키에 넣는다.",
      '발급기관장은 "서울특별시 마포구청장 유동균" 처럼 직함과 성명이 붙어 있다. issuerTitle 에 직함(ja 예: ソウル特別市 麻浦区長), issuerName 에 성명.',
      "발급시각·발급담당자·전화·신청인은 오른쪽 아래 네 줄에서 읽는다. 수입증지는 왼쪽 아래 둥근 네모 안의 줄(번호·관서·금액·날짜·코드)과 그 아래 증지발행시각. 직인(도장)은 읽지 않는다. 안 보이면 ja·ko 모두 빈 문자열.",
    ],
  },
  sections,
  fileName: (doc) =>
    `家族関係証明書_翻訳_${doc.value(FK.issueNumber) || doc.id.slice(0, 8)}`,
};
