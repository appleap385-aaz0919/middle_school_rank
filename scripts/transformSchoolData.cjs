const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * 주소에서 시도와 시군구를 추출하는 함수
 * @param {string} address - 주소 문자열
 * @returns {Object} - { sido, sigungu }
 */
function parseAddress(address) {
  if (!address) return { sido: null, sigungu: null };

  // 시도별 매칭 패턴 (시도 + 시군구 순서)
  // 공백 관계없이 매칭하도록 수정
  const patterns = [
    // 서울특별시 (구)
    { regex: /서울특별시\s*([가-힣]+구)/, sido: '서울특별시' },
    // 부산광역시 (구/군)
    { regex: /부산광역시\s*([가-힣]+구|[가-힣]+군)/, sido: '부산광역시' },
    // 대구광역시 (구/군)
    { regex: /대구광역시\s*([가-힣]+구|[가-힣]+군)/, sido: '대구광역시' },
    // 인천광역시 (구/군)
    { regex: /인천광역시\s*([가-힣]+구|[가-힣]+군)/, sido: '인천광역시' },
    // 광주광역시 (구)
    { regex: /광주광역시\s*([가-힣]+구)/, sido: '광주광역시' },
    // 대전광역시 (구)
    { regex: /대전광역시\s*([가-힣]+구)/, sido: '대전광역시' },
    // 울산광역시 (구/군)
    { regex: /울산광역시\s*([가-힣]+구|[가-힣]+군)/, sido: '울산광역시' },
    // 세종특별자치시
    { regex: /세종특별자치시/, sido: '세종특별자치시', sigungu: '세종특별자치시' },
    // 경기도 (시/군)
    { regex: /경기도\s*([가-힣]+시|[가-힣]+군)/, sido: '경기도' },
    // 강원특별자치도 및 강원도 (시/군)
    { regex: /강원(?:특별자치)?도\s*([가-힣]+시|[가-힣]+군)/, sido: '강원도' },
    // 충청북도 (시/군)
    { regex: /충청북도\s*([가-힣]+시|[가-힣]+군)/, sido: '충청북도' },
    // 충청남도 (시/군)
    { regex: /충청남도\s*([가-힣]+시|[가-힣]+군)/, sido: '충청남도' },
    // 전북특별자치도 및 전라북도 (시/군)
    { regex: /전북(?:특별자치)?도\s*([가-힣]+시|[가-힣]+군)/, sido: '전라북도' },
    // 전라남도 (시/군)
    { regex: /전라남도\s*([가-힣]+시|[가-힣]+군)/, sido: '전라남도' },
    // 경상북도 (시/군)
    { regex: /경상북도\s*([가-힣]+시|[가-힣]+군)/, sido: '경상북도' },
    // 경상남도 (시/군)
    { regex: /경상남도\s*([가-힣]+시|[가-힣]+군)/, sido: '경상남도' },
    // 제주특별자치도 (시)
    { regex: /제주특별자치도\s*([가-힣]+시)/, sido: '제주특별자치도' },
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern.regex);
    if (match) {
      return {
        sido: pattern.sido,
        sigungu: pattern.sigungu || match[1],
      };
    }
  }

  return { sido: null, sigungu: null };
}

/**
 * 주소 파싱 (지번/도로명 주소 모두 시도)
 */
function parseAddressFromBoth(jibunAddress, roadAddress) {
  // 먼저 지번 주소 시도
  let result = parseAddress(jibunAddress);
  if (result.sido && result.sigungu) {
    return result;
  }
  // 실패하면 도로명 주소 시도
  return parseAddress(roadAddress);
}

/**
 * 기존 schoolDataBase.json에서 학교 데이터를 찾아 반환
 * @param {Object} existingData - 기존 데이터
 * @param {string} year - 연도
 * @param {string} regionKey - 지역 키
 * @param {string} schoolName - 학교 이름
 * @returns {Object|null} - 기존 학교 데이터 또는 null
 */
function findExistingSchool(existingData, year, regionKey, schoolName) {
  if (!existingData[year] || !existingData[year][regionKey]) {
    return null;
  }
  return existingData[year][regionKey].find(s => s.name === schoolName) || null;
}

/**
 * XLSX 파일을 읽어서 schoolData 형식으로 변환
 * 기존 순위 데이터(achievement, admission, rank)를 보존합니다
 */
function transformSchoolData() {
  console.log('데이터 변환 시작...\n');

  // 기존 데이터 읽기 (순위 정보 보존을 위해)
  const existingDataPath = path.join(__dirname, '../src/data/schoolDataBase.json');
  let existingData = null;
  if (fs.existsSync(existingDataPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
      console.log('기존 데이터를 로드했습니다. 순위 정보를 보존합니다.\n');
    } catch (e) {
      console.log('기존 데이터 읽기 실패, 새로 생성합니다.\n');
    }
  }

  // XLSX 파일 읽기
  const workbook = XLSX.readFile('./middle_school_list.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // 시트 데이터를 JSON으로 변환 (헤더 포함)
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // 헤더 찾기
  const headers = data[0];
  const schoolNameIndex = headers.indexOf('학교명');
  const schoolLevelIndex = headers.indexOf('학교급구분');
  const establishmentTypeIndex = headers.indexOf('설립형태');
  const roadAddressIndex = headers.indexOf('소재지도로명주소');
  const jibunAddressIndex = headers.indexOf('소재지지번주소');

  console.log(`총 ${data.length - 1}개의 학교 데이터를 처리합니다.\n`);

  // 연도별 데이터 구조 생성 (2025, 2024, 2023)
  // 기존 데이터가 있으면 복사해서 시작
  const result = {
    2025: existingData?.[2025] ? JSON.parse(JSON.stringify(existingData[2025])) : {},
    2024: existingData?.[2024] ? JSON.parse(JSON.stringify(existingData[2024])) : {},
    2023: existingData?.[2023] ? JSON.parse(JSON.stringify(existingData[2023])) : {},
  };

  let middleSchoolCount = 0;
  let parsedCount = 0;
  let skippedCount = 0;
  let preservedCount = 0;
  let newSchoolCount = 0;

  // 데이터 행 처리 (헤더 제외)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    const schoolName = row[schoolNameIndex];
    const schoolLevel = row[schoolLevelIndex];
    const establishmentType = row[establishmentTypeIndex];
    const roadAddress = row[roadAddressIndex];
    const jibunAddress = row[jibunAddressIndex];

    // 중학교만 필터링
    if (schoolLevel !== '중학교') {
      skippedCount++;
      continue;
    }

    middleSchoolCount++;

    // 주소 파싱 (지번/도로명 주소 모두 시도)
    const { sido, sigungu } = parseAddressFromBoth(jibunAddress, roadAddress);

    if (!sido || !sigungu) {
      console.log(`주소 파싱 실패: ${schoolName} - ${jibunAddress}`);
      skippedCount++;
      continue;
    }

    parsedCount++;

    // 지역 키 생성 (예: "서울특별시 강남구")
    const regionKey = `${sido} ${sigungu}`;

    // 모든 연도에 동일하게 추가
    for (const year of [2025, 2024, 2023]) {
      if (!result[year][regionKey]) {
        result[year][regionKey] = [];
      }

      // 기존 데이터에 이 학교가 있는지 확인
      const existingSchool = findExistingSchool(existingData, year, regionKey, schoolName);

      if (existingSchool) {
        // 기존 데이터가 있으면 순위 정보 보존
        const schoolData = {
          name: schoolName,
          type: establishmentType || '공립',
          gender: '남녀공학',
          // 기존 순위 정보 보존
          ...(existingSchool.rank !== undefined && { rank: existingSchool.rank }),
          ...(existingSchool.achievement !== undefined && { achievement: existingSchool.achievement }),
          ...(existingSchool.admission !== undefined && { admission: existingSchool.admission }),
          hasRanking: existingSchool.hasRanking || false,
        };

        // 기존 배열에서 해당 학교 찾아서 업데이트
        const schoolIndex = result[year][regionKey].findIndex(s => s.name === schoolName);
        if (schoolIndex !== -1) {
          result[year][regionKey][schoolIndex] = schoolData;
        } else {
          result[year][regionKey].push(schoolData);
        }
        if (year === 2025) preservedCount++;
      } else {
        // 새로운 학교
        const schoolData = {
          name: schoolName,
          type: establishmentType || '공립',
          gender: '남녀공학',
          hasRanking: false,
        };
        result[year][regionKey].push(schoolData);
        if (year === 2025) newSchoolCount++;
      }
    }
  }

  console.log(`\n=== 변환 완료 ===`);
  console.log(`중학교 수: ${middleSchoolCount}`);
  console.log(`주소 파싱 성공: ${parsedCount}`);
  console.log(`건너뛴 데이터: ${skippedCount}`);
  console.log(`기존 순위 데이터 보존: ${preservedCount}개교`);
  console.log(`신규 학교 추가: ${newSchoolCount}개교`);
  console.log(`총 지역 수: ${Object.keys(result[2025]).length}\n`);

  // 결과를 파일로 저장
  const outputPath = path.join(__dirname, '../src/data/schoolDataBase.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

  console.log(`데이터가 저장되었습니다: ${outputPath}\n`);

  // 지역별 학교 수 출력
  console.log('=== 지역별 학교 수 (상위 20개) ===');
  const regions = Object.entries(result[2025])
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20);

  for (const [region, schools] of regions) {
    console.log(`${region}: ${schools.length}개교`);
  }

  return result;
}

// 실행
transformSchoolData();
