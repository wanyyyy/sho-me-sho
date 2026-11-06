import {
  type DocumentTemplate,
  type RepeatGroup,
  repeatRowKeys,
  repeatRows,
  type TemplateDocument,
  type TemplateField,
} from "@/shared/lib/template";

/** 혼인관계증명서(상세) 고정 칸 키 */
export const MK = {
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

export const MARITAL_FIELDS: TemplateField[] = [
  f(MK.registryBase, "등록기준지", "登録基準地"),
  f(MK.personName, "본인 성명", "本人 氏名", "name"),
  f(MK.personBirthDate, "본인 출생연월일", "本人 出生年月日", "date"),
  f(
    MK.personResidentNumber,
    "본인 주민등록번호",
    "本人 住民登録番号",
    "number",
  ),
  f(MK.personGender, "본인 성별", "本人 性別"),
  f(MK.personOrigin, "본인 본", "本人 本籍"),
  f(MK.certifiedAt, "증명일", "証明日", "date"),
  f(MK.issuerTitle, "발급기관장 직함", "発給機関長"),
  f(MK.issuerName, "발급기관장 성명", "発給機関長 氏名", "name"),
  f(MK.issueNumber, "발행번호", "発給番号", "number"),
  f(MK.issuedTime, "발급시각", "発給時刻"),
  f(MK.issuerOfficer, "발급담당자", "発給担当者", "name"),
  f(MK.issuerPhone, "전화", "電話", "number"),
  f(MK.applicant, "신청인", "申請人", "name"),
  f(MK.stampSerial, "수입증지 일련번호", "収入証紙 番号", "number"),
  f(MK.stampOffice, "수입증지 발행관서", "収入証紙 発行官署"),
  f(MK.stampAmount, "수입증지 금액", "収入証紙 金額"),
  f(MK.stampDate, "수입증지 날짜", "収入証紙 日付"),
  f(MK.stampCode, "수입증지 코드", "収入証紙 コード", "number"),
  f(MK.stampIssuedTime, "증지발행시각", "証紙発行時刻"),
];

/** 혼인사항 표(배우자 한 명이 행 하나)와 그 아래 상세내용 표(혼인·이혼 등, 대괄호 줄 하나가 행 하나) */
export const MARITAL_REPEATS: { spouse: RepeatGroup; history: RepeatGroup } = {
  spouse: {
    key: "spouse",
    labelKo: "혼인사항",
    labelJa: "婚姻事項",
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
  },
  history: {
    key: "history",
    labelKo: "상세내용",
    labelJa: "詳細内容",
    fields: [
      { sub: "category", labelKo: "구분", labelJa: "区分", kind: "text" },
      { sub: "label", labelKo: "항목", labelJa: "項目", kind: "text" },
      { sub: "value", labelKo: "내용", labelJa: "内容", kind: "text" },
    ],
  },
};

/** 양식(일본어)에 고정으로 찍히는 머릿글·문구 */
export const MARITAL_LABELS = {
  title: "婚 姻 関 係 証 明 書 ( 詳 細 )",
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
  marital: "婚姻事項",
  category: "区 分",
  detail: "詳 細 内 容",
  empty: "記録する事項がありません。",
  statement:
    "上の婚姻関係証明書(詳細)は家族関係登録簿の記録事項と相違いない事を証明します。",
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
  const rows = (group: RepeatGroup) =>
    repeatRows(group, doc).map((i) => ({
      title: `${group.labelKo} ${i + 1}`,
      keys: repeatRowKeys(group, i),
    }));
  return [
    { title: "등록기준지", keys: [MK.registryBase] },
    {
      title: "본인",
      keys: [
        MK.personName,
        MK.personBirthDate,
        MK.personResidentNumber,
        MK.personGender,
        MK.personOrigin,
      ],
    },
    ...rows(MARITAL_REPEATS.spouse),
    ...rows(MARITAL_REPEATS.history),
    {
      title: "증명",
      keys: [MK.certifiedAt, MK.issuerTitle, MK.issuerName, MK.issueNumber],
    },
    {
      title: "발급 정보",
      keys: [MK.issuedTime, MK.issuerOfficer, MK.issuerPhone, MK.applicant],
    },
    {
      title: "수입증지",
      keys: [
        MK.stampSerial,
        MK.stampOffice,
        MK.stampAmount,
        MK.stampDate,
        MK.stampCode,
        MK.stampIssuedTime,
      ],
    },
  ];
}

/**
 * 혼인관계증명서(상세) 템플릿. 한국어 원문 → 일본어 번역. 일본 시약소 제출용 양식(1쪽)을 따른다.
 * 혼인사항(배우자)과 상세내용(혼인·이혼 이력)은 사람마다 달라 가변 행으로 받고, 없으면 "記録する事項がありません。"
 */
export const MARITAL_TEMPLATE: DocumentTemplate<"marital"> = {
  type: "marital",
  source: "ko",
  target: "ja",
  title: { ko: "혼인관계증명서(상세)", ja: "婚姻関係証明書(詳細)" },
  description: "혼인관계증명서(상세) → 시약소 제출용 일본어 양식",
  orientation: "portrait",
  fields: MARITAL_FIELDS,
  repeats: [MARITAL_REPEATS.spouse, MARITAL_REPEATS.history],
  prompt: {
    intro:
      "이 이미지는 대한민국 가족관계등록부의 혼인관계증명서(상세)다. 표의 각 칸을 읽어 아래 키에 맞춰 채워라. ko 에는 원문을 그대로, ja 에는 일본 관공서 제출용 일본어 번역을 넣는다.",
    rules: [
      '날짜: 자릿수를 그대로 두고 단위만 바꾼다. "1992년 02월 20일" → "1992年 02月 20日".',
      '이름: 가타카나 음독 + 괄호 안 한자 유지. "김대완(金垈完)" → "キム・デワン(金垈完)". 괄호 한자가 없으면 가타카나만. 외국인 배우자는 원문 표기(영문·가타카나)를 그대로 두고 ja 에는 가타카나.',
      '주소: 시/구/동/로/길/번지 → 市/区/洞/路/街/番地, 지명은 한자 표기. "서울특별시 구로구 개봉로19길 51" → "ソウル特別市 九老区 開峰路19街 51".',
      "성별 남/여 → 男/女. 본(本)의 한자(예: 安東)는 그대로. 주민등록번호는 그대로. 외국인의 본 칸에 국적이 있으면 国籍 표기(예: 日本).",
      "spouse 는 '혼인사항' 아래 첫 번째 표(구분/성명/출생연월일/주민등록번호/성별/본). 배우자 한 명이 행 하나, relation 은 배우자 → 配偶者. '기록할 사항이 없습니다.' 뿐이면 빈 배열.",
      "history 는 그 아래 '구분/상세내용' 표. 대괄호 [항목] 줄 하나가 행 하나이며 label 에는 대괄호를 뺀 항목명, value 에는 그 줄의 값만 넣는다. 같은 구분이 여러 줄이면 category 를 줄마다 반복한다. '기록할 사항이 없습니다.' 뿐이면 빈 배열.",
      "구분: 혼인 → 婚姻, 이혼 → 離婚, 혼인무효 → 婚姻無効, 혼인취소 → 婚姻取消. 항목명: 혼인신고일 → 婚姻申告日, 배우자 → 配偶者, 배우자국적 → 配偶者国籍, 처리관서 → 処理官署, 혼인성립일 → 婚姻成立日, 이혼신고일 → 離婚申告日, 이혼종류 → 離婚種類, 송달일 → 送達日, 재판확정일 → 裁判確定日, 신고인 → 申告人.",
      '발급기관장은 "서울특별시 마포구청장 유동균" 처럼 직함과 성명이 붙어 있다. issuerTitle 에 직함(ja 예: ソウル特別市 麻浦区長), issuerName 에 성명.',
      "발급시각·발급담당자·전화·신청인은 오른쪽 아래 네 줄에서 읽는다. 수입증지는 왼쪽 아래 둥근 네모 안의 줄(번호·관서·금액·날짜·코드)과 그 아래 증지발행시각. 직인(도장)은 읽지 않는다. 안 보이면 ja·ko 모두 빈 문자열.",
    ],
  },
  sections,
  fileName: (doc) =>
    `婚姻関係証明書_翻訳_${doc.value(MK.issueNumber) || doc.id.slice(0, 8)}`,
};
