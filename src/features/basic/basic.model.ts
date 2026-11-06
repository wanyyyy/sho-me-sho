import {
  type DocumentTemplate,
  type RepeatGroup,
  repeatRowKeys,
  repeatRows,
  type TemplateDocument,
  type TemplateField,
} from "@/shared/lib/template";

/** 기본증명서(상세) 고정 칸 키 */
export const BK = {
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
  // 2쪽 (발급 정보·수입증지). 1쪽만 올리면 비어 있으므로 직접 채운다
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

export const BASIC_FIELDS: TemplateField[] = [
  f(BK.registryBase, "등록기준지", "登録基準地"),
  f(BK.personName, "본인 성명", "本人 氏名", "name"),
  f(BK.personBirthDate, "본인 출생연월일", "本人 出生年月日", "date"),
  f(
    BK.personResidentNumber,
    "본인 주민등록번호",
    "本人 住民登録番号",
    "number",
  ),
  f(BK.personGender, "본인 성별", "本人 性別"),
  f(BK.personOrigin, "본인 본", "本人 本籍"),
  f(BK.certifiedAt, "증명일", "証明日", "date"),
  f(BK.issuerTitle, "발급기관장 직함", "発給機関長"),
  f(BK.issuerName, "발급기관장 성명", "発給機関長 氏名", "name"),
  f(BK.issueNumber, "발행번호", "発給番号", "number"),
  f(BK.issuedTime, "발급시각", "発給時刻"),
  f(BK.issuerOfficer, "발급담당자", "発給担当者", "name"),
  f(BK.issuerPhone, "전화", "電話", "number"),
  f(BK.applicant, "신청인", "申請人", "name"),
  f(BK.stampSerial, "수입증지 일련번호", "収入証紙 番号", "number"),
  f(BK.stampOffice, "수입증지 발행관서", "収入証紙 発行官署"),
  f(BK.stampAmount, "수입증지 금액", "収入証紙 金額"),
  f(BK.stampDate, "수입증지 날짜", "収入証紙 日付"),
  f(BK.stampCode, "수입증지 코드", "収入証紙 コード", "number"),
  f(BK.stampIssuedTime, "증지발행시각", "証紙発行時刻"),
];

const detailRow = (): RepeatGroup["fields"] => [
  { sub: "category", labelKo: "구분", labelJa: "区分", kind: "text" },
  { sub: "label", labelKo: "항목", labelJa: "項目", kind: "text" },
  { sub: "value", labelKo: "내용", labelJa: "内容", kind: "text" },
];

/** 상세내용 표(작성·정정 등)와 일반등록사항 표(출생 등). 대괄호 줄 하나가 행 하나 */
export const BASIC_REPEATS: { history: RepeatGroup; general: RepeatGroup } = {
  history: {
    key: "history",
    labelKo: "상세내용",
    labelJa: "詳細内容",
    fields: detailRow(),
  },
  general: {
    key: "general",
    labelKo: "일반등록사항",
    labelJa: "一般登録事項",
    fields: detailRow(),
  },
};

/** 양식(일본어)에 고정으로 찍히는 머릿글·문구 */
export const BASIC_LABELS = {
  title: "基 本 証 明 書 ( 詳 細 )",
  registryBase: "登録基準地",
  category: "区 分",
  detail: "詳 細 内 容",
  personHead: [
    "区分",
    "氏　　名",
    "出生年月日",
    "住民登録番号",
    "性別",
    "本籍",
  ],
  self: "本人",
  general: "一般登録事項",
  statement:
    "上の基本証明書(詳細)は家族関係登録簿の記録事項と相違いない事を証明します。",
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
  pageOf: (n: number) => `${n} / 2`,
} as const;

function sections(doc: TemplateDocument) {
  const rows = (group: RepeatGroup) =>
    repeatRows(group, doc).map((i) => ({
      title: `${group.labelKo} ${i + 1}`,
      keys: repeatRowKeys(group, i),
    }));
  return [
    { title: "등록기준지", keys: [BK.registryBase] },
    ...rows(BASIC_REPEATS.history),
    {
      title: "본인",
      keys: [
        BK.personName,
        BK.personBirthDate,
        BK.personResidentNumber,
        BK.personGender,
        BK.personOrigin,
      ],
    },
    ...rows(BASIC_REPEATS.general),
    {
      title: "증명",
      keys: [BK.certifiedAt, BK.issuerTitle, BK.issuerName, BK.issueNumber],
    },
    {
      title: "발급 정보 (2쪽)",
      keys: [BK.issuedTime, BK.issuerOfficer, BK.issuerPhone, BK.applicant],
    },
    {
      title: "수입증지 (2쪽)",
      keys: [
        BK.stampSerial,
        BK.stampOffice,
        BK.stampAmount,
        BK.stampDate,
        BK.stampCode,
        BK.stampIssuedTime,
      ],
    },
  ];
}

/**
 * 기본증명서(상세) 템플릿. 한국어 원문 → 일본어 번역. 일본 시약소 제출용 양식(2쪽)을 따른다.
 * 상세내용·일반등록사항 표는 사람마다 행 수가 달라 가변 행으로 받는다
 */
export const BASIC_TEMPLATE: DocumentTemplate<"basic"> = {
  type: "basic",
  source: "ko",
  target: "ja",
  title: { ko: "기본증명서(상세)", ja: "基本証明書(詳細)" },
  description: "기본증명서(상세) → 시약소 제출용 일본어 양식",
  orientation: "portrait",
  fields: BASIC_FIELDS,
  repeats: [BASIC_REPEATS.history, BASIC_REPEATS.general],
  prompt: {
    intro:
      "이 이미지는 대한민국 가족관계등록부의 기본증명서(상세)다. 표의 각 칸을 읽어 아래 키에 맞춰 채워라. ko 에는 원문을 그대로, ja 에는 일본 관공서 제출용 일본어 번역을 넣는다.",
    rules: [
      '날짜: 자릿수를 그대로 두고 단위만 바꾼다. "2008년 01월 01일" → "2008年 01月 01日".',
      '이름: 가타카나 음독 + 괄호 안 한자 유지. "김대완(金垈完)" → "キム・デワン(金垈完)". 괄호 한자가 없으면 가타카나만.',
      '주소: 시/구/동/로/길/번지 → 市/区/洞/路/街/番地, 지명은 한자 표기. "서울특별시 구로구 개봉로19길 51" → "ソウル特別市 九老区 開峰路19街 51", "구로구 개봉동 303번지의 35" → "九老区 開峰洞 303番地の35".',
      '법령: "가족관계의 등록 등에 관한 법률 부칙 제3조제1항" → "家族関係の登録などに関する法律 附則 第3条第1項", "도로명주소법 제20조" → "道路名住所法 第20条".',
      "성별 남/여 → 男/女. 신고인 부/모 → 父/母. 본(本)의 한자(예: 安東)는 그대로. 주민등록번호는 그대로.",
      "구분: 작성 → 作成, 정정 → 訂正, 출생 → 出生, 개명 → 改名, 국적 → 国籍. 항목명: 가족관계등록부작성일 → 家族関係登録簿作成日, 작성사유 → 作成事由, 도로명주소기록일 → 道路名住所記録日, 경정전 → 更訂前, 경정후 → 更訂後, 경정사유 → 更訂事由, 출생장소 → 出生場所, 신고일 → 申告日, 신고인 → 申告人.",
      "history 는 등록기준지 아래 첫 번째 '구분/상세내용' 표, general 은 '일반등록사항' 아래 표. 대괄호 [항목] 줄 하나가 행 하나이며, label 에는 대괄호를 뺀 항목명, value 에는 그 줄의 값만 넣는다. 같은 구분이 여러 줄이면 category 를 줄마다 반복한다.",
      '발급기관장은 "서울특별시 마포구청장 유동균" 처럼 직함과 성명이 붙어 있다. issuerTitle 에 직함(ja 예: ソウル特別市 麻浦区長), issuerName 에 성명.',
      "2쪽 항목(발급시각·발급담당자·전화·신청인·수입증지)은 2쪽 이미지에서 읽는다. 수입증지는 왼쪽 아래 둥근 네모 안의 줄(번호·관서·금액·날짜·코드)과 그 아래 증지발행시각. 직인(도장)은 읽지 않는다. 2쪽이 없으면 ja·ko 모두 빈 문자열.",
    ],
  },
  sections,
  fileName: (doc) =>
    `基本証明書_翻訳_${doc.value(BK.issueNumber) || doc.id.slice(0, 8)}`,
};
