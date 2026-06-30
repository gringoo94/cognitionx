import { tests } from '../src/data/tests/index.ts';

let issues = 0;
const notes = [];
for (const t of tests) {
  const errs = [];
  for (const f of ['slug','code','title','seoTitle','seoDescription','questions','scoring']) {
    if (!t[f]) errs.push(`missing ${f}`);
  }
  if (t.seoTitle && t.seoTitle.length > 60) errs.push(`seoTitle ${t.seoTitle.length}>60`);
  if (t.seoDescription && t.seoDescription.length > 160) errs.push(`seoDescription ${t.seoDescription.length}>160`);
  if (!t.perQuestionScale && (!t.scale || t.scale.length === 0)) errs.push('no scale');
  if (t.reverseItems) for (const r of t.reverseItems) if (r < 1 || r > t.questions.length) errs.push(`reverseItem ${r} OOR`);
  if (t.subscales) for (const s of t.subscales) for (const i of s.items) if (i < 1 || i > t.questions.length) errs.push(`subscale ${s.key} item ${i} OOR`);
  if (t.perQuestionScale && t.perQuestionScale.length !== t.questions.length) errs.push(`perQuestionScale len mismatch`);
  try {
    const zeros = new Array(t.questions.length).fill(0);
    const r1 = t.scoring(zeros);
    if (r1.score > r1.maxScore) errs.push(`zeros: ${r1.score}>${r1.maxScore}`);
    const maxes = t.questions.map((_, i) => {
      const sc = t.perQuestionScale?.[i] || t.scale;
      return sc[sc.length - 1].value;
    });
    const r2 = t.scoring(maxes);
    if (r2.score > r2.maxScore) errs.push(`maxes: ${r2.score}>${r2.maxScore}`);
    if (r2.score !== r2.maxScore) notes.push(`${t.slug}: maxAns->score=${r2.score}, declared maxScore=${r2.maxScore}`);
  } catch (e) { errs.push(`scoring threw: ${e.message}`); }
  if (errs.length) { issues += errs.length; console.log(`❌ ${t.slug}:`); errs.forEach(e=>console.log('  -',e)); }
}
console.log(`\nTotal: ${tests.length}, issues: ${issues}`);
console.log('\nNotes (max-answer != maxScore):');
notes.forEach(n=>console.log(' ',n));
