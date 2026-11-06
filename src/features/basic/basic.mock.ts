import {
  sampleField,
  sampleRow,
  type TemplateSample,
} from "@/shared/lib/template";
import { BK } from "./basic.model";

const hi = sampleField("high");
const mid = sampleField("medium");

const row = (
  group: string,
  i: number,
  category: [string, string],
  label: [string, string],
  value: [string, string],
) =>
  sampleRow(group, i, {
    category: hi(...category),
    label: hi(...label),
    value: hi(...value),
  });

/** 기본증명서(상세) 샘플. 양식 파일의 OOO 자리표를 그대로 쓴 가상 데이터 (ko 가 원문, ja 가 번역) */
export const BASIC_SAMPLE: TemplateSample<"basic"> = {
  documentType: "basic",
  fields: {
    [BK.registryBase]: hi("OOOOO市 OO区 OO路O街 OO", "OOOOO시 OO구 OO로O길 OO"),
    ...row(
      "history",
      0,
      ["作成", "작성"],
      ["家族関係登録簿作成日", "가족관계등록부작성일"],
      ["2008年 01月 01日", "2008년 01월 01일"],
    ),
    ...row(
      "history",
      1,
      ["作成", "작성"],
      ["作成事由", "작성사유"],
      [
        "家族関係の登録などに関する法律 附則 第3条第1項",
        "가족관계의 등록 등에 관한 법률 부칙 제3조제1항",
      ],
    ),
    ...row(
      "history",
      2,
      ["訂正", "정정"],
      ["道路名住所記録日", "도로명주소기록일"],
      ["2011年 12月 12日", "2011년 12월 12일"],
    ),
    ...row(
      "history",
      3,
      ["訂正", "정정"],
      ["更訂前", "경정전"],
      ["OOOOO市 OO区 OO洞 OOO番地のOO", "OOOOO시 OO구 OO동 OOO번지의 OO"],
    ),
    ...row(
      "history",
      4,
      ["訂正", "정정"],
      ["更訂後", "경정후"],
      ["OOOOO市 OO区 OO路O街 OO", "OOOOO시 OO구 OO로O길 OO"],
    ),
    ...row(
      "history",
      5,
      ["訂正", "정정"],
      ["更訂事由", "경정사유"],
      ["道路名住所法 第20条", "도로명주소법 제20조"],
    ),
    [BK.personName]: mid("キム・ワロ(金OO)", "김와로(金OO)"),
    [BK.personBirthDate]: hi("1901年 01月 01日", "1901년 01월 01일"),
    [BK.personResidentNumber]: hi("010101-1234567", "010101-1234567"),
    [BK.personGender]: hi("男", "남"),
    [BK.personOrigin]: hi("OO", "OO"),
    ...row(
      "general",
      0,
      ["出生", "출생"],
      ["出生場所", "출생장소"],
      ["OO市 OO区 OO洞 OO番地", "OO시 OO구 OO동 OO번지"],
    ),
    ...row(
      "general",
      1,
      ["出生", "출생"],
      ["申告日", "신고일"],
      ["1901年 01月 01日", "1901년 01월 01일"],
    ),
    ...row("general", 2, ["出生", "출생"], ["申告人", "신고인"], ["父", "부"]),
    [BK.certifiedAt]: hi("2026年 01月 01日", "2026년 01월 01일"),
    [BK.issuerTitle]: hi("OOOOO市 OO区長", "OOOOO시 OO구청장"),
    [BK.issuerName]: mid("OOO", "OOO"),
    [BK.issueNumber]: hi("1234-5678-1234-5678", "1234-5678-1234-5678"),
    [BK.issuedTime]: hi("12時 00分", "12시 00분"),
    [BK.issuerOfficer]: mid("OOO", "OOO"),
    [BK.issuerPhone]: hi("02-1234-5678", "02-1234-5678"),
    [BK.applicant]: mid("OOO", "OOO"),
    [BK.stampSerial]: hi("0001S", "0001S"),
    [BK.stampOffice]: hi("OO区", "OO구"),
    [BK.stampAmount]: hi("1000ウォン", "1000원"),
    [BK.stampDate]: hi("2026.1.11", "2026.1.11"),
    [BK.stampCode]: hi("SAD001", "SAD001"),
    [BK.stampIssuedTime]: hi("12:03:17.781", "12:03:17.781"),
    [BK.sealLine1]: hi("OO区長之印", "OO구청장의인"),
    [BK.sealLine2]: hi("上岩洞住民センター専用", "상암동주민센터전용"),
  },
};
