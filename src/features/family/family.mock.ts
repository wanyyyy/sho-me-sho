import {
  sampleField,
  sampleRow,
  type TemplateSample,
} from "@/shared/lib/template";
import { FAMILY_REPEAT, FK } from "./family.model";

const hi = sampleField("high");
const mid = sampleField("medium");

const member = (
  i: number,
  relation: [string, string],
  name: [string, string],
  birthDate: [string, string],
  residentNumber: string,
  gender: [string, string],
) =>
  sampleRow(FAMILY_REPEAT.key, i, {
    relation: hi(...relation),
    name: mid(...name),
    birthDate: hi(...birthDate),
    residentNumber: hi(residentNumber, residentNumber),
    gender: hi(...gender),
    origin: hi("OO", "OO"),
  });

/** 가족관계증명서(상세) 샘플. 양식 파일의 OOO 자리표를 그대로 쓴 가상 데이터 (ko 가 원문, ja 가 번역) */
export const FAMILY_SAMPLE: TemplateSample<"family"> = {
  documentType: "family",
  fields: {
    [FK.registryBase]: hi(
      "OOOOO市 OO区 OO路OO街 OO",
      "OOOOO시 OO구 OO로OO길 OO",
    ),
    [FK.personName]: mid("キム・ワロ(金OO)", "김와로(金OO)"),
    [FK.personBirthDate]: hi("1901年 01月 01日", "1901년 01월 01일"),
    [FK.personResidentNumber]: hi("010101-1234567", "010101-1234567"),
    [FK.personGender]: hi("男", "남"),
    [FK.personOrigin]: hi("OO", "OO"),
    ...member(
      0,
      ["父", "부"],
      ["キム・ワロ(金OO)", "김와로(金OO)"],
      ["1901年 01月 01日", "1901년 01월 01일"],
      "010101-1234567",
      ["男", "남"],
    ),
    ...member(
      1,
      ["母", "모"],
      ["キム・ワロ(金OO)", "김와로(金OO)"],
      ["1901年 01月 01日", "1901년 01월 01일"],
      "010101-2345678",
      ["女", "여"],
    ),
    [FK.certifiedAt]: hi("2026年 01月 10日", "2026년 01월 10일"),
    [FK.issuerTitle]: hi("OOOOO市 OO区長", "OOOOO시 OO구청장"),
    [FK.issuerName]: mid("OOO", "OOO"),
    [FK.issueNumber]: hi("1234-5678-1234-5678", "1234-5678-1234-5678"),
    [FK.issuedTime]: hi("12時 03分", "12시 03분"),
    [FK.issuerOfficer]: mid("OOO", "OOO"),
    [FK.issuerPhone]: hi("02-1234-5678", "02-1234-5678"),
    [FK.applicant]: mid("OOO", "OOO"),
    [FK.stampSerial]: hi("0001S", "0001S"),
    [FK.stampOffice]: hi("OO区", "OO구"),
    [FK.stampAmount]: hi("1000ウォン", "1000원"),
    [FK.stampDate]: hi("2026.1.10", "2026.1.10"),
    [FK.stampCode]: hi("SAD001", "SAD001"),
    [FK.stampIssuedTime]: hi("12:03:06.848", "12:03:06.848"),
  },
};
