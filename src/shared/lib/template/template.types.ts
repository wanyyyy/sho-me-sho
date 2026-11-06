/**
 * 양식 엔진 타입. 서류 종류와 무관한 "칸 채우기" 모델:
 * 양식 = 고정 칸 + 가변 행 그룹, 값 = 원문/번역/신뢰도. 서류별 선언은 entities 에서 한다
 */
export type Lang = "ja" | "ko";

export const CONFIDENCES = ["high", "medium", "low"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

/** 칸 하나의 값. ja/ko 중 하나는 원문, 다른 하나는 번역 (방향은 템플릿이 정한다) */
export type ExtractedField = { ja: string; ko: string; confidence: Confidence };

export type FieldKind = "text" | "date" | "name" | "number";

/**
 * 양식 칸 선언 (코드로 고정). key 는 추출 결과의 키와 1:1.
 * kind 가 동작을 정한다: date 는 날짜 표기 정규화, name 은 항상 확인 필요
 */
export type TemplateField = {
  key: string;
  labelKo: string;
  /** 일본어 항목명. 모델 프롬프트·툴팁용 */
  labelJa: string;
  kind: FieldKind;
};

/** 가변 행 그룹의 열 하나. 실제 키는 `${group.key}.${행번호}.${sub}` */
export type RepeatField = Omit<TemplateField, "key"> & { sub: string };

/** 서류마다 개수가 다른 표 (기본증명서의 상세내용 등). 모델이 행 수를 정한다 */
export type RepeatGroup = {
  key: string;
  labelKo: string;
  labelJa: string;
  fields: RepeatField[];
};

/** 좁은 화면용 세로 목록 묶음 */
export type TemplateSection = { title: string; keys: string[] };

/** 템플릿 헬퍼가 문서에서 보는 최소 모양 (어떤 키가 있는지) */
export type TemplateDocument = {
  extracted: Record<string, unknown>;
  edits: Record<string, unknown>;
};

/** 파일명 등 값이 필요한 곳에 넘기는 읽기 전용 접근자 */
export type DocumentView = {
  id: string;
  value: (key: string) => string;
};

/** 서류 종류 하나의 선언. 양식·번역 방향·모델 지시 규칙·파일명을 한 곳에 */
export type DocumentTemplate<TType extends string = string> = {
  type: TType;
  /** 원문 언어 → 번역 언어 */
  source: Lang;
  target: Lang;
  title: Record<Lang, string>;
  /** 홈 메뉴 설명 */
  description: string;
  orientation: "portrait" | "landscape";
  fields: TemplateField[];
  repeats: RepeatGroup[];
  /** 모델 지시문에 들어갈 서류 설명과 번역 규칙 */
  prompt: { intro: string; rules: string[] };
  sections: (doc: TemplateDocument) => TemplateSection[];
  fileName: (doc: DocumentView) => string;
};

/** 서류별 샘플 데이터 모양 */
export type TemplateSample<TType extends string = string> = {
  documentType: TType;
  fields: Record<string, ExtractedField>;
};
