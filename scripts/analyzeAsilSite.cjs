const { chromium } = require('playwright');
const fs = require('fs');

/**
 * 학교알리미 사이트 구조 분석
 */
async function analyzeSite() {
  console.log('학교알리미 사이트 구조 분석 시작...\n');

  const browser = await chromium.launch({ headless: false }); // headless 모드로 페이지 확인
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  // 페이지 이동
  console.log('페이지 로딩 중...');
  await page.goto('https://asil.kr/asil/sub/school_list.jsp', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  // 대기: 페이지 로딩
  await page.waitForTimeout(5000);

  // 페이지 스크린샷 저장
  await page.screenshot({ path: 'asil_page.png', fullPage: true });
  console.log('스크린샷 저장: asil_page.png\n');

  // 모든 select 요소 찾기
  console.log('=== Select 요소 목록 ===');
  const selects = await page.evaluate(() => {
    const selectElements = document.querySelectorAll('select');
    return Array.from(selectElements).map((select, index) => ({
      index,
      name: select.name,
      id: select.id,
      className: select.className,
      optionCount: select.options.length,
      firstOptions: Array.from(select.options).slice(0, 5).map(opt => ({
        value: opt.value,
        text: opt.text,
      })),
    }));
  });

  console.log(JSON.stringify(selects, null, 2));

  // 모든 input 요소 찾기
  console.log('\n=== Input 요소 목록 ===');
  const inputs = await page.evaluate(() => {
    const inputElements = document.querySelectorAll('input');
    return Array.from(inputElements).map((input, index) => ({
      index,
      type: input.type,
      name: input.name,
      id: input.id,
      className: input.className,
      value: input.value,
    }));
  });

  console.log(JSON.stringify(inputs, null, 2));

  // 테이블 구조 확인
  console.log('\n=== 테이블 구조 ===');
  const tables = await page.evaluate(() => {
    const tableElements = document.querySelectorAll('table');
    return Array.from(tableElements).map((table, index) => {
      const rows = table.querySelectorAll('tr');
      return {
        index,
        rowCount: rows.length,
        headers: Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim()),
        firstRow: rows[1] ? Array.from(rows[1].querySelectorAll('td')).map(td => td.textContent.trim().substring(0, 50)) : [],
      };
    });
  });

  console.log(JSON.stringify(tables, null, 2));

  // 전체 HTML 저장 (분석용)
  const html = await page.content();
  fs.writeFileSync('asil_page.html', html, 'utf8');
  console.log('\nHTML 저장: asil_page.html');

  // 콘솔 로그 확인
  console.log('\n=== 페이지 콘솔 로그 ===');
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });

  // 30초 대기 (분석 시간)
  console.log('\n브라우저를 30초간 유지합니다. 분석 후 자동 닫힙니다...');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('\n분석 완료!');
}

// 실행
(async () => {
  await analyzeSite();
})();
