import type { ExtractionResult } from "./certificate.types.ts";
import { K } from "./marriage.template.ts";

const hi = (ja: string, ko: string) =>
  ({ ja, ko, confidence: "high" }) as const;
const mid = (ja: string, ko: string) =>
  ({ ja, ko, confidence: "medium" }) as const;
const low = (ja: string, ko: string) =>
  ({ ja, ko, confidence: "low" }) as const;
const masked = () => hi("＊＊＊＊＊", "＊＊＊＊＊");

/**
 * 실제 모델 연동 전 개발용 샘플. 실제 증명서의 표 구조를 따르되 인물·주소는 모두 가상이다.
 * (원본처럼 비공개 처리된 행은 ＊＊＊＊＊ 로 둔다)
 */
export const SAMPLE_EXTRACTION: ExtractionResult = {
  documentType: "marriage",
  fields: {
    [K.notificationType]: hi("婚姻届", "혼인신고"),
    [K.notifiedAt]: hi("令和７年９月６日", "2025년 9월 6일"),

    [K.notifierName(0)]: masked(),
    [K.notifierNote(0)]: masked(),
    [K.notifierName(1)]: masked(),
    [K.notifierNote(1)]: masked(),

    [K.personKana(0)]: hi("ヤマダ ハナコ", "야마다 하나코"),
    [K.personName(0)]: hi("山田 花子（届出人）", "야마다 하나코 (신고인)"),
    [K.personRelation(0)]: hi("妻", "처"),
    [K.personRegistryLabel(0)]: hi("本籍", "본적"),
    [K.personRegistry(0)]: mid(
      "東京都新宿区西新宿二丁目８番地１ 山田 一郎",
      "도쿄도 신주쿠구 니시신주쿠 2초메 8번지 1 야마다 이치로",
    ),
    [K.personBirthDate(0)]: hi("平成５年４月１日", "1993년 4월 1일"),

    [K.personKana(1)]: low("", ""),
    [K.personName(1)]: low("キム、ミンス（届出人）", "김민수 (신고인)"),
    [K.personRelation(1)]: hi("夫", "부"),
    [K.personRegistryLabel(1)]: hi("国籍・地域", "국적·지역"),
    [K.personRegistry(1)]: hi("韓国", "한국"),
    [K.personBirthDate(1)]: hi("西暦１９９１年３月１５日", "1991년 3월 15일"),

    [K.personName(2)]: masked(),
    [K.personRelation(2)]: masked(),
    [K.personBirthDate(2)]: masked(),
    [K.personName(3)]: masked(),
    [K.personRelation(3)]: masked(),
    [K.personBirthDate(3)]: masked(),

    [K.summaryLabel(0)]: hi("届後本籍", "신고 후 본적"),
    [K.summaryValue(0)]: mid(
      "東京都新宿区西新宿三丁目５番 山田花子",
      "도쿄도 신주쿠구 니시신주쿠 3초메 5번 야마다 하나코",
    ),
    [K.summaryLabel(1)]: hi("戸籍の変動", "호적의 변동"),
    [K.summaryValue(1)]: hi("新戸籍編製", "신호적 편제"),

    [K.issueNumber]: hi("0000012345", "0000012345"),
    [K.acceptedAt]: hi("令和７年９月６日", "2025년 9월 6일"),
    [K.issuedAt]: hi("令和７年９月１０日", "2025년 9월 10일"),
    [K.issuerTitle]: hi("東京都新宿区長", "도쿄도 신주쿠구장"),
    [K.issuerName]: mid("新宿 太郎", "신주쿠 타로"),
  },
};
