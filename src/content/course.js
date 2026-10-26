// The course: one file per module in ./modules. Each lesson has a single `body` of blocks.
import m00 from './modules/m00-start';
import m01 from './modules/m01-claude-code';
import m02 from './modules/m02-accounts';
import m03 from './modules/m03-plan';
import m04 from './modules/m04-build';
import m05 from './modules/m05-ui';
import m06 from './modules/m06-blocks';
import m07 from './modules/m07-data-money';
import m08 from './modules/m08-live';
import m09 from './modules/m09-secure';
import m10 from './modules/m10-grown-up';
import m11 from './modules/m11-power-tools';
import m12 from './modules/m12-agents';
import m13 from './modules/m13-ai-products';
import m14 from './modules/m14-capstone';

export const modules = [m00, m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14];

export const allLessons = modules.flatMap((m, mi) =>
  m.lessons.map((l, li) => ({ ...l, moduleId: m.id, moduleTitle: m.title, moduleIndex: mi, lessonIndex: li }))
);
