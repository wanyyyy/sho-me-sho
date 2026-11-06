import { sampleField, type TemplateSample } from "@/shared/lib/template";
import { MK } from "./marital.model";

const hi = sampleField("high");
const mid = sampleField("medium");

/**
 * 혼인관계증명서(상세) 샘플. 양식 파일의 OOO 자리표를 그대로 쓴 가상 데이터 (ko 가 원문, ja 가 번역).
 * 양식처럼 혼인사항·상세내용이 없는 경우라 가변 행이 비어 있다
 */
export const MARITAL_SAMPLE: TemplateSample<"marital"> = {
  documentType: "marital",
  fields: {
    [MK.registryBase]: hi("OOOO市 OO区 OO路OO街 OO", "OOOO시 OO구 OO로OO길 OO"),
    [MK.personName]: mid("キム・ワロ(金OO)", "김와로(金OO)"),
    [MK.personBirthDate]: hi("1901年 01月 01日", "1901년 01월 01일"),
    [MK.personResidentNumber]: hi("010101-1234567", "010101-1234567"),
    [MK.personGender]: hi("男", "남"),
    [MK.personOrigin]: hi("OO", "OO"),
    [MK.certifiedAt]: hi("2026年 01月 10日", "2026년 01월 10일"),
    [MK.issuerTitle]: hi("OOOOO市 OO区長", "OOOOO시 OO구청장"),
    [MK.issuerName]: mid("OOO", "OOO"),
    [MK.issueNumber]: hi("1234-5678-1234-5678", "1234-5678-1234-5678"),
    [MK.issuedTime]: hi("12時 01分", "12시 01분"),
    [MK.issuerOfficer]: mid("OOO", "OOO"),
    [MK.issuerPhone]: hi("02-1234-5678", "02-1234-5678"),
    [MK.applicant]: mid("OOO", "OOO"),
    [MK.stampSerial]: hi("0001S", "0001S"),
    [MK.stampOffice]: hi("OO区", "OO구"),
    [MK.stampAmount]: hi("1000ウォン", "1000원"),
    [MK.stampDate]: hi("2026.1.10", "2026.1.10"),
    [MK.stampCode]: hi("SAD001", "SAD001"),
    [MK.stampIssuedTime]: hi("12:03:34.763", "12:03:34.763"),
  },
};
