import type {
  DocumentTemplate,
  TemplateField,
  TemplateSection,
} from "@/shared/lib/template";

/** 사건본인 행 수 (원본 양식 고정) */
export const PERSON_ROWS = [0, 1, 2, 3] as const;
/** 신고인 행 수 */
export const NOTIFIER_ROWS = [0, 1] as const;
/** 신고의 요지 행 수 */
export const SUMMARY_ROWS = [0, 1] as const;

export const K = {
  notificationType: "notificationType",
  notifiedAt: "notifiedAt",
  notifierName: (i: number) => `notifier.${i}.name`,
  notifierNote: (i: number) => `notifier.${i}.note`,
  personKana: (i: number) => `person.${i}.kana`,
  personName: (i: number) => `person.${i}.name`,
  personRelation: (i: number) => `person.${i}.relation`,
  personRegistryLabel: (i: number) => `person.${i}.registryLabel`,
  personRegistry: (i: number) => `person.${i}.registry`,
  personBirthDate: (i: number) => `person.${i}.birthDate`,
  summaryLabel: (i: number) => `summary.${i}.label`,
  summaryValue: (i: number) => `summary.${i}.value`,
  issueNumber: "issueNumber",
  acceptedAt: "acceptedAt",
  issuedAt: "issuedAt",
  issuerTitle: "issuerTitle",
  issuerName: "issuerName",
} as const;

const f = (
  key: string,
  labelKo: string,
  labelJa: string,
  kind: TemplateField["kind"] = "text",
): TemplateField => ({ key, labelKo, labelJa, kind });

/**
 * 수리증명서(受理証明書) 칸 목록. 원본 양식의 표 구조를 그대로 따른다.
 * 머릿글·항목명·고정 문구는 certificate-sheet.ui.tsx 가 그리고, 여기에는 값 칸만 선언한다.
 */
export const MARRIAGE_FIELDS: TemplateField[] = [
  f(K.notificationType, "신고", "届出"),
  f(K.notifiedAt, "신고일", "届出日", "date"),
  ...NOTIFIER_ROWS.flatMap((i) => [
    f(
      K.notifierName(i),
      `신고인 ${i + 1} 성명`,
      `届出人 ${i + 1} 氏名`,
      "name",
    ),
    f(K.notifierNote(i), `신고인 ${i + 1} (괄호)`, `届出人 ${i + 1} ( )`),
  ]),
  ...PERSON_ROWS.flatMap((i) => [
    f(
      K.personKana(i),
      `사건본인 ${i + 1} 읽기`,
      `事件本人 ${i + 1} ふりがな`,
      "name",
    ),
    f(
      K.personName(i),
      `사건본인 ${i + 1} 성명`,
      `事件本人 ${i + 1} 氏名`,
      "name",
    ),
    f(K.personRelation(i), `사건본인 ${i + 1} 관계`, `事件本人 ${i + 1} 続柄`),
    f(
      K.personRegistryLabel(i),
      `사건본인 ${i + 1} 본적/국적 항목`,
      `本籍 / 国籍・地域`,
    ),
    f(
      K.personRegistry(i),
      `사건본인 ${i + 1} 본적/국적`,
      `事件本人 ${i + 1} 本籍`,
    ),
    f(
      K.personBirthDate(i),
      `사건본인 ${i + 1} 생년월일`,
      `事件本人 ${i + 1} 生年月日`,
      "date",
    ),
  ]),
  ...SUMMARY_ROWS.flatMap((i) => [
    f(K.summaryLabel(i), `요지 ${i + 1} 항목`, `要旨 ${i + 1} 項目`),
    f(K.summaryValue(i), `요지 ${i + 1} 내용`, `要旨 ${i + 1} 内容`),
  ]),
  f(K.issueNumber, "발행번호", "発行番号", "number"),
  f(K.acceptedAt, "수리일", "受理日", "date"),
  f(K.issuedAt, "발행일", "発行日", "date"),
  f(K.issuerTitle, "발행자 직함", "発行者 役職"),
  f(K.issuerName, "발행자 성명", "発行者 氏名", "name"),
];

export const MARRIAGE_FIELD_MAP: Record<string, TemplateField> =
  Object.fromEntries(MARRIAGE_FIELDS.map((field) => [field.key, field]));

/** 좁은 화면용 세로 목록에서 쓰는 묶음. 표의 행 순서와 같다 */
export const MARRIAGE_SECTIONS: TemplateSection[] = [
  { title: "신고", keys: [K.notificationType, K.notifiedAt] },
  ...NOTIFIER_ROWS.map((i) => ({
    title: `신고인 ${i + 1}`,
    keys: [K.notifierName(i), K.notifierNote(i)],
  })),
  ...PERSON_ROWS.map((i) => ({
    title: `사건본인 ${i + 1}`,
    keys: [
      K.personKana(i),
      K.personName(i),
      K.personRelation(i),
      K.personRegistryLabel(i),
      K.personRegistry(i),
      K.personBirthDate(i),
    ],
  })),
  {
    title: "신고의 요지",
    keys: SUMMARY_ROWS.flatMap((i) => [K.summaryLabel(i), K.summaryValue(i)]),
  },
  {
    title: "발행",
    keys: [
      K.issueNumber,
      K.acceptedAt,
      K.issuedAt,
      K.issuerTitle,
      K.issuerName,
    ],
  },
];

/** 인쇄·화면 공통 머릿글 (한국어 양식 고정 문구) */
export const SHEET_LABELS = {
  title: "수 리 증 명 서",
  titleJa: "受理証明書",
  notification: "신고",
  notifiedAt: "신고일",
  notifier: "신고인",
  person: "사건본인",
  birthDate: "생년월일",
  summary: "신고의 요지",
  issueNumber: "발행번호",
  statement: (acceptedAt: string) =>
    `위 신고는 ${acceptedAt || "____년 __월 __일"} 수리하였음을 증명함.`,
  seal: "직인",
} as const;

/**
 * 수리증명서 템플릿. 일본어 원문 → 한국어 번역. 가변 행 없이 원본 양식의 행 수가 고정이다
 */
export const MARRIAGE_TEMPLATE: DocumentTemplate<"marriage"> = {
  type: "marriage",
  source: "ja",
  target: "ko",
  title: { ja: SHEET_LABELS.titleJa, ko: "수리증명서" },
  description:
    "일본 관공서가 발행한 혼인신고 수리증명서를 한국 구청 제출용 한국어 양식으로",
  orientation: "landscape",
  fields: MARRIAGE_FIELDS,
  repeats: [],
  prompt: {
    intro:
      "이 이미지는 일본 관공서가 발행한 수리증명서(受理証明書)다. 표의 각 칸을 읽어 아래 키에 맞춰 채워라.",
    rules: [
      "ko: ja 의 자연스러운 한국어 번역. 지명·주소는 한글 음역(예: 東京都新宿区 → 도쿄도 신주쿠구).",
      '원본에서 비공개 처리된 칸(＊ 또는 검게 가려짐)은 ja·ko 모두 "＊＊＊＊＊".',
      "사건본인 행은 위에서부터 1~4. 없는 행은 빈 문자열로 둔다.",
      "続柄(관계)의 ko 는 양식 관례대로 妻 → 처, 夫 → 부, 子 → 자.",
      "날짜의 ja 는 원문 연호 그대로(예: 令和７年９月６日), ko 는 서기로(예: 2025년 9월 6일).",
    ],
  },
  sections: () => MARRIAGE_SECTIONS,
  fileName: (doc) =>
    `수리증명서_번역_${doc.value(K.issueNumber) || doc.id.slice(0, 8)}`,
};
