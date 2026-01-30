const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * 학교알리미 지역 코드 매핑
 * select 요소의 value 값 사용
 */
const REGION_CODES = {
  // 서울 (11)
  '서울특별시 강남구': '11680',
  '서울특별시 강동구': '11740',
  '서울특별시 강북구': '11305',
  '서울특별시 강서구': '11500',
  '서울특별시 관악구': '11620',
  '서울특별시 광진구': '11260',
  '서울특별시 구로구': '11530',
  '서울특별시 금천구': '11545',
  '서울특별시 노원구': '11350',
  '서울특별시 도봉구': '11320',
  '서울특별시 동대문구': '11230',
  '서울특별시 동작구': '11590',
  '서울특별시 마포구': '11440',
  '서울특별시 서대문구': '11410',
  '서울특별시 서초구': '11650',
  '서울특별시 성동구': '11200',
  '서울특별시 성북구': '11290',
  '서울특별시 송파구': '11710',
  '서울특별시 양천구': '11470',
  '서울특별시 영등포구': '11560',
  '서울특별시 용산구': '11170',
  '서울특별시 은평구': '11380',
  '서울특별시 종로구': '11110',
  '서울특별시 중구': '11140',
  '서울특별시 중랑구': '11270',
  // 부산 (26)
  '부산광역시 강서구': '21130',
  '부산광역시 금정구': '21160',
  '부산광역시 남구': '21050',
  '부산광역시 동구': '20710',
  '부산광역시 동래구': '20920',
  '부산광역시 부산진구': '21020',
  '부산광역시 북구': '20950',
  '부산광역시 사상구': '21140',
  '부산광역시 사하구': '21040',
  '부산광역시 서구': '20740',
  '부산광역시 수영구': '21150',
  '부산광역시 연제구': '21120',
  '부산광역시 영도구': '20800',
  '부산광역시 중구': '20640',
  '부산광역시 해운대구': '21100',
  // 대구 (27)
  '대구광역시 남구': '22410',
  '대구광역시 달서구': '22530',
  '대구광역시 동구': '22220',
  '대구광역시 북구': '22440',
  '대구광역시 서구': '22330',
  '대구광역시 수성구': '22520',
  '대구광역시 중구': '22100',
  // 인천 (28)
  '인천광역시 강화군': '28720',
  '인천광역시 계양구': '28380',
  '인천광역시 남동구': '28550',
  '인천광역시 동구': '28080',
  '인천광역시 미추홀구': '28260',
  '인천광역시 부평구': '28520',
  '인천광역시 서구': '28180',
  '인천광역시 연수구': '28590',
  '인천광역시 옹진군': '28810',
  '인천광역시 중구': '28010',
  // 광주 (29)
  '광주광역시 광산구': '29550',
  '광주광역시 남구': '29240',
  '광주광역시 동구': '29150',
  '광주광역시 북구': '29440',
  '광주광역시 서구': '29330',
  // 대전 (30)
  '대전광역시 대덕구': '30530',
  '대전광역시 동구': '30170',
  '대전광역시 서구': '30380',
  '대전광역시 유성구': '30520',
  '대전광역시 중구': '30110',
  // 울산 (31)
  '울산광역시 남구': '31240',
  '울산광역시 동구': '31150',
  '울산광역시 북구': '31350',
  '울산광역시 울주군': '31700',
  '울산광역시 중구': '31010',
  // 세종 (36)
  '세종특별자치시 세종특별자치시': '36110',
  // 경기 (41)
  '경기도 가평군': '41830',
  '경기도 고양시': '41280',
  '경기도 과천시': '41290',
  '경기도 광명시': '41210',
  '경기도 광주시': '41310',
  '경기도 구리시': '41320',
  '경기도 군포시': '41510',
  '경기도 김포시': '41570',
  '경기도 남양주시': '41360',
  '경기도 동두천시': '41250',
  '경기도 부천시': '41190',
  '경기도 성남시': '41370',
  '경기도 수원시': '41110',
  '경기도 시흥시': '41390',
  '경기도 안산시': '41270',
  '경기도 안성시': '41550',
  '경기도 안양시': '41180',
  '경기도 양주시': '41630',
  '경기도 양평군': '41790',
  '경기도 여주시': '41670',
  '경기도 연천군': '41800',
  '경기도 오산시': '41370',
  '경기도 용인시': '41460',
  '경기도 의왕시': '41430',
  '경기도 의정부시': '41160',
  '경기도 이천시': '41490',
  '경기도 파주시': '41480',
  '경기도 평택시': '41520',
  '경기도 포천시': '41620',
  '경기도 하남시': '41260',
  '경기도 화성시': '41590',
  // 강원 (42)
  '강원도 강릉시': '42160',
  '강원도 고성군': '42820',
  '강원도 동해시': '42220',
  '강원도 삼척시': '42270',
  '강원도 속초시': '42210',
  '강원도 양구군': '42800',
  '강원도 양양군': '42850',
  '강원도 영월군': '42440',
  '강원도 원주시': '42300',
  '강원도 인제군': '42780',
  '강원도 정선군': '42510',
  '강원도 철원군': '42110',
  '강원도 춘천시': '42110',
  '강원도 태백시': '42280',
  '강원도 평창군': '42630',
  '강원도 홍천군': '42680',
  '강원도 화천군': '42710',
  '강원도 횡성군': '42750',
  // 충북 (43)
  '충청북도 괴산군': '43800',
  '충청북도 단양군': '43100',
  '충청북도 보은군': '43720',
  '충청북도 영동군': '43440',
  '충청북도 옥천군': '43740',
  '충청북도 음성군': '43520',
  '충청북도 제천시': '43150',
  '충청북도 증평군': '43780',
  '충청북도 진천군': '43510',
  '충청북도 청주시': '43010',
  '충청북도 충주시': '43230',
  // 충남 (44)
  '충청남도 계룡시': '44200',
  '충청남도 공주시': '44150',
  '충청남도 금산군': '44810',
  '충청남도 논산시': '44330',
  '충청남도 당진시': '44270',
  '충청남도 보령시': '44480',
  '충청남도 부여군': '44640',
  '충청남도 서산시': '44720',
  '충청남도 서천군': '44790',
  '충청남도 아산시': '44220',
  '충청남도 예산군': '44840',
  '충청남도 천안시': '44130',
  '충청남도 청양군': '44880',
  '충청남도 태안군': '44930',
  '충청남도 홍성군': '44900',
  // 전북 (45)
  '전라북도 고창군': '45810',
  '전라북도 군산시': '45210',
  '전라북도 김제시': '45320',
  '전라북도 남원시': '45470',
  '전라북도 무주군': '45790',
  '전라북도 부안군': '45800',
  '전라북도 순창군': '45690',
  '전라북도 완주군': '45530',
  '전라북도 익산시': '45240',
  '전라북도 임실군': '45570',
  '전라북도 장수군': '45650',
  '전라북도 전주시': '45110',
  '전라북도 정읍시': '45380',
  '전라북도 진안군': '45720',
  // 전남 (46)
  '전라남도 강진군': '46630',
  '전라남도 고흥군': '46880',
  '전라남도 곡성군': '46460',
  '전라남도 광양시': '46230',
  '전라남도 구례군': '46360',
  '전라남도 나주시': '46170',
  '전라남도 담양군': '46730',
  '전라남도 목포시': '46110',
  '전라남도 무안군': '46800',
  '전라남도 보성군': '46550',
  '전라남도 순천시': '46210',
  '전라남도 신안군': '46990',
  '전라남도 여수시': '46150',
  '전라남도 영광군': '46850',
  '전라남도 영암군': '46790',
  '전라남도 완도군': '46590',
  '전라남도 장성군': '46670',
  '전라남도 장흥군': '46610',
  '전라남도 진도군': '46950',
  '전라남도 함평군': '46750',
  '전라남도 해남군': '46900',
  '전라남도 화순군': '46310',
  // 경북 (47)
  '경상북도 경산시': '47290',
  '경상북도 경주시': '47150',
  '경상북도 고령군': '47840',
  '경상북도 구미시': '47340',
  '경상북도 군위군': '47830',
  '경상북도 김천시': '47190',
  '경상북도 문경시': '47410',
  '경상북도 봉화군': '47650',
  '경상북도 상주시': '47300',
  '경상북도 성주군': '47740',
  '경상북도 안동시': '47210',
  '경상북도 영덕군': '47540',
  '경상북도 영양군': '47580',
  '경상북도 영주시': '47480',
  '경상북도 영천시': '47430',
  '경상북도 예천군': '47680',
  '경상북도 울릉군': '47930',
  '경상북도 울진군': '47940',
  '경상북도 의성군': '47500',
  '경상북도 청도군': '47730',
  '경상북도 청송군': '47560',
  '경상북도 칠곡군': '47330',
  '경상북도 포항시': '47110',
  // 경남 (48)
  '경상남도 거제시': '48270',
  '경상남도 거창군': '48860',
  '경상남도 고성군': '48810',
  '경상남도 김해시': '48200',
  '경상남도 남해군': '48700',
  '경상남도 밀양시': '48250',
  '경상남도 사천시': '48490',
  '경상남도 산청군': '48560',
  '경상남도 양산시': '48300',
  '경상남도 의령군': '48520',
  '경상남도 진주시': '48170',
  '경상남도 창녕군': '48380',
  '경상남도 창원시': '48120',
  '경상남도 통영시': '48220',
  '경상남도 하동군': '48890',
  '경상남도 함안군': '48580',
  '경상남도 함양군': '48760',
  '경상남도 합천군': '48820',
  // 제주 (50)
  '제주특별자치도 서귀포시': '50130',
  '제주특별자치도 제주시': '50110',
};

// 시도 코드
const SIDO_CODES = {
  '서울': '11',
  '부산': '26',
  '대구': '27',
  '인천': '28',
  '광주': '29',
  '대전': '30',
  '울산': '31',
  '세종': '36',
  '경기': '41',
  '강원': '42',
  '충북': '43',
  '충남': '44',
  '전북': '45',
  '전남': '46',
  '경북': '47',
  '경남': '48',
  '제주': '50',
};

/**
 * 테이블 데이터 파싱
 * - 헤더 테이블(인덱스 0)와 데이터 테이블(인덱스 1)이 분리되어 있음
 * - 데이터 테이블은 가장 많은 행을 가진 테이블
 */
function parseTableData(page) {
  return page.evaluate(() => {
    const schools = [];
    const tables = document.querySelectorAll('table');

    // 가장 많은 행을 가진 테이블 선택 (데이터 테이블)
    let dataTable = null;
    let maxRows = 0;

    for (const table of tables) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > maxRows) {
        maxRows = rows.length;
        dataTable = table;
      }
    }

    if (!dataTable) {
      return schools;
    }

    const rows = dataTable.querySelectorAll('tr');

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      // 최소 9개 컬럼 필요 (순위, 위치, 학교명, 응시자수, 성취도평균, 국어, 영어, 수학, 특목고진학률)
      if (cells.length >= 9) {
        const rankText = cells[0]?.textContent?.trim() || '';
        const location = cells[1]?.textContent?.trim() || '';
        const name = cells[2]?.textContent?.trim() || '';

        // 보통학력이상 평균은 5번째 컬럼 (인덱스 4)
        const achievementText = cells[4]?.textContent?.trim() || '';

        // 특목고 진학률은 9번째 컬럼 (인덱스 8)
        const admissionText = cells[8]?.textContent?.trim() || '';

        // 순위 파싱
        const rank = parseInt(rankText) || 0;

        // 성취도 파싱 (예: "97.6%")
        const achievementMatch = achievementText.match(/([\d.]+)%/);
        const achievement = achievementMatch ? parseFloat(achievementMatch[1]) : 0;

        // 진학률 파싱 (예: "8.8%")
        const admissionMatch = admissionText.match(/([\d.]+)%/);
        const admission = admissionMatch ? parseFloat(admissionMatch[1]) : 0;

        // 유효한 데이터만 추가
        if (name && rank > 0 && achievement > 0) {
          schools.push({
            rank,
            name,
            type: '공립',
            gender: '남녀공학',
            achievement,
            admission,
            hasRanking: true,
          });
        }
      }
    });

    return schools;
  });
}

/**
 * 지역명에서 시도 추출
 */
function extractSido(regionName) {
  const sidoMap = {
    '서울특별시': '서울',
    '부산광역시': '부산',
    '대구광역시': '대구',
    '인천광역시': '인천',
    '광주광역시': '광주',
    '대전광역시': '대전',
    '울산광역시': '울산',
    '세종특별자치시': '세종',
    '경기도': '경기',
    '강원도': '강원',
    '충청북도': '충북',
    '충청남도': '충남',
    '전라북도': '전북',
    '전라남도': '전남',
    '경상북도': '경북',
    '경상남도': '경남',
    '제주특별자치도': '제주',
  };

  // 정확한 매칭 먼저 시도
  for (const [key, value] of Object.entries(sidoMap)) {
    if (regionName.startsWith(key)) {
      return value;
    }
  }

  // 부분 매칭 (호환성)
  if (regionName.includes('서울')) return '서울';
  if (regionName.includes('부산')) return '부산';
  if (regionName.includes('대구')) return '대구';
  if (regionName.includes('인천')) return '인천';
  if (regionName.includes('광주')) return '광주';
  if (regionName.includes('대전')) return '대전';
  if (regionName.includes('울산')) return '울산';
  if (regionName.includes('세종')) return '세종';
  if (regionName.includes('경기')) return '경기';
  if (regionName.includes('강원')) return '강원';
  if (regionName.includes('충북') || regionName.includes('충청북')) return '충북';
  if (regionName.includes('충남') || regionName.includes('충청남')) return '충남';
  if (regionName.includes('전북') || regionName.includes('전라북')) return '전북';
  if (regionName.includes('전남') || regionName.includes('전라남')) return '전남';
  if (regionName.includes('경북') || regionName.includes('경상북')) return '경북';
  if (regionName.includes('경남') || regionName.includes('경상남')) return '경남';
  if (regionName.includes('제주')) return '제주';

  return null;
}

/**
 * 전국 데이터 스크래핑
 */
async function scrapeAllRegions() {
  console.log('학교알리미 전국 데이터 스크래핑 시작...\n');
  console.log(`총 ${Object.keys(REGION_CODES).length}개 지역 처리 예정\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  const results = {
    2025: {},
  };

  let successCount = 0;
  let failCount = 0;
  let totalSchools = 0;
  const totalRegions = Object.keys(REGION_CODES).length;

  // 지역 목록을 배열로 변환
  const regions = Object.entries(REGION_CODES);

  for (let i = 0; i < regions.length; i++) {
    const [regionKey, gunguCode] = regions[i];

    try {
      const sido = extractSido(regionKey);
      const sidoCode = SIDO_CODES[sido];

      console.log(`[${i + 1}/${totalRegions}] ${regionKey} (${sidoCode}, ${gunguCode}) 처리 중...`);

      // 페이지 이동
      await page.goto('https://asil.kr/asil/sub/school_list.jsp', {
        waitUntil: 'networkidle',
        timeout: 60000,
      });

      // 대기: 페이지 로딩
      await page.waitForTimeout(5000);

      // select 요소 매번 새로 찾기
      const selects = await page.$$('select');

      if (selects.length >= 3) {
        // 시도 선택 (0번째 select)
        await page.evaluate((code) => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 1) {
            selects[0].value = code;
            selects[0].dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, sidoCode);
        await page.waitForTimeout(3000);

        // 시군구 선택 (1번째 select) - 다시 찾기
        await page.evaluate((code) => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 2) {
            selects[1].value = code;
            selects[1].dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, gunguCode);
        await page.waitForTimeout(3000);

        // 중학교 선택 (2번째 select)
        await page.evaluate(() => {
          const selects = document.querySelectorAll('select');
          if (selects.length >= 3) {
            selects[2].value = '3';
            selects[2].dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        await page.waitForTimeout(5000);

        // 테이블 데이터 파싱
        const schools = await parseTableData(page);

        if (schools.length > 0) {
          results['2025'][regionKey] = schools;
          successCount++;
          totalSchools += schools.length;
          console.log(`  완료: ${schools.length}개교 (상위 3개: ${schools.slice(0, 3).map(s => s.name).join(', ')})\n`);
        } else {
          failCount++;
          console.log(`  데이터 없음\n`);
        }
      } else {
        failCount++;
        console.log(`  select 요소를 찾을 수 없음\n`);
      }

    } catch (error) {
      failCount++;
      console.error(`  오류: ${error.message}\n`);
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('스크래핑 완료:');
  console.log(`성공: ${successCount}개 지역`);
  console.log(`실패: ${failCount}개 지역`);
  console.log(`총 학교 수: ${totalSchools}개교\n`);

  // 결과 저장
  const outputPath = path.join(__dirname, '../src/data/schoolAlimData.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`데이터 저장 완료: ${outputPath}\n`);

  // 지역별 학교 수 요약 (상위 20개)
  console.log('=== 지역별 학교 수 (상위 20개) ===');
  const regionsBySchoolCount = Object.entries(results['2025'])
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20);

  for (const [region, schools] of regionsBySchoolCount) {
    console.log(`${region}: ${schools.length}개교`);
  }

  return results;
}

// 메인 실행
(async () => {
  await scrapeAllRegions();
})();
