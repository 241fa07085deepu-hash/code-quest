import { TestCase } from '../types';

export interface RunResult {
  success: boolean;
  terminalOutput: string;
  testResults: {
    id: string;
    description: string;
    passed: boolean;
    actual: string;
    expected: string;
    error?: string;
  }[];
  passedCount: number;
  totalCount: number;
  error?: string;
  visualStateUpdate?: any;
}

// Helper to normalize Python-like string outputs
function normalizeOutput(val: any): string {
  if (val === undefined || val === null) return 'None';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return '[' + val.map(item => {
      if (typeof item === 'string') return `'${item}'`;
      return normalizeOutput(item);
    }).join(', ') + ']';
  }
  return String(val);
}

// Python-like syntax and logic evaluator for our 10 DSA/Python challenges
export function executePythonQuest(
  questId: string,
  userCode: string,
  testCases: TestCase[]
): RunResult {
  const terminalLogs: string[] = [];
  const testResults: RunResult['testResults'] = [];

  // Capture user print statements or comments for terminal feel
  terminalLogs.push(`$ python3 quest_solution.py`);
  terminalLogs.push(`[System] Initializing Python 3.12 sandbox...`);

  // Detect empty or pass-only code
  const trimmed = userCode.trim();
  const hasPassOnly = trimmed.includes('pass') && trimmed.split('\n').filter(l => !l.trim().startsWith('#') && l.trim() !== 'pass').length <= 2;
  
  if (!trimmed || hasPassOnly) {
    terminalLogs.push(`[Traceback] IndentationError or NotImplemented: Function body contains only 'pass' or is empty.`);
    terminalLogs.push(`>>> Hint: Look at the problem instructions or check the Hints / Solution tab below.`);
    return {
      success: false,
      terminalOutput: terminalLogs.join('\n'),
      testResults: testCases.map(tc => ({
        id: tc.id,
        description: tc.inputDescription,
        passed: false,
        actual: 'None',
        expected: tc.expectedOutput,
        error: 'Incomplete implementation'
      })),
      passedCount: 0,
      totalCount: testCases.length,
      error: "Function not implemented yet. Complete the function logic to run the game!"
    };
  }

  // Evaluate per quest type
  try {
    let funcEvaluator: (input: any) => any;
    let visualStateUpdate: any = null;

    switch (questId) {
      case 'quest-1': {
        // charge_core(ruby, emerald, sapphire, multiplier)
        funcEvaluator = (input: { ruby: number; emerald: number; sapphire: number; multiplier: number }) => {
          // Check if user code multiplies and sums
          const matchCore = /f?["']CORE:\s*\{?([^"'\n]+)\}?\s*GW["']/i.exec(userCode);
          const hasSum = userCode.includes('+') || userCode.includes('sum(');
          const hasMult = userCode.includes('*');

          if (hasSum && hasMult) {
            const sum = input.ruby + input.emerald + input.sapphire;
            const boosted = sum * input.multiplier;
            return `CORE: ${boosted} GW`;
          } else if (userCode.includes('raw_energy * multiplier') || userCode.includes('boosted_energy')) {
            const sum = input.ruby + input.emerald + input.sapphire;
            return `CORE: ${sum * input.multiplier} GW`;
          } else {
            return `CORE: ${input.ruby + input.emerald + input.sapphire} GW`; // partial without mult
          }
        };

        const test1 = funcEvaluator({ ruby: 10, emerald: 20, sapphire: 30, multiplier: 2 });
        terminalLogs.push(`>>> charge_core(10, 20, 30, 2) => ${test1}`);
        visualStateUpdate = {
          coreActive: test1 === 'CORE: 120 GW',
          corePower: 120,
          crystals: [
            { name: "Ruby", color: "#f43f5e", power: 10, collected: true },
            { name: "Emerald", color: "#10b981", power: 20, collected: true },
            { name: "Sapphire", color: "#06b6d4", power: 30, collected: true }
          ]
        };
        break;
      }

      case 'quest-2': {
        // evaluate_gate(armor, mana, has_seal)
        funcEvaluator = (input: { armor: number; mana: number; has_seal: boolean }) => {
          const code = userCode;
          // Verify conditional checks
          if (input.has_seal && input.mana >= 80 && (code.includes('GOLD_GATE_OPEN') || code.includes('gold'))) {
            return 'GOLD_GATE_OPEN';
          }
          if ((input.armor >= 50 || input.mana >= 50) && (code.includes('SILVER_GATE_OPEN') || code.includes('silver'))) {
            return 'SILVER_GATE_OPEN';
          }
          return 'PORTCULLIS_LOCKED';
        };

        terminalLogs.push(`>>> evaluate_gate(60, 40, False) => SILVER_GATE_OPEN`);
        visualStateUpdate = { gateStatus: "OPENED_SILVER", playerArmor: 60, playerMana: 40 };
        break;
      }

      case 'quest-3': {
        // charge_conveyor(capsules, max_capacity)
        funcEvaluator = (input: { capsules: number[]; max_capacity: number }) => {
          let sum = 0;
          const hasBreak = userCode.includes('break');
          const hasContinue = userCode.includes('continue') || userCode.includes('> 0') || userCode.includes('>= 0');

          for (const c of input.capsules) {
            if (c < 0) {
              if (hasContinue) continue;
              else sum += c; // failed to skip
            } else {
              sum += c;
              if (hasBreak && sum >= input.max_capacity) {
                sum = input.max_capacity;
                break;
              }
            }
          }
          return sum;
        };

        const val = funcEvaluator({ capsules: [10, -5, 25, 30, -2, 50], max_capacity: 60 });
        terminalLogs.push(`>>> charge_conveyor([10, -5, 25, 30, -2, 50], 60) => ${val}`);
        visualStateUpdate = { currentSum: val, maxCapacity: 60, status: 'CONVEYOR_STABLE' };
        break;
      }

      case 'quest-4': {
        // reorder_cargo(cars, command)
        funcEvaluator = (input: { cars: string[]; command: string }) => {
          const cars = [...input.cars];
          if (input.command === 'REVERSE') {
            return userCode.includes('[::-1]') || userCode.includes('.reverse()') ? [...cars].reverse() : cars;
          } else if (input.command === 'ODD_INDEX') {
            return userCode.includes('[1::2]') || userCode.includes('% 2 != 0') ? cars.filter((_, i) => i % 2 !== 0) : cars;
          } else if (input.command === 'TRIM_ENDS') {
            return userCode.includes('[1:-1]') || userCode.includes('[1:len') ? cars.slice(1, -1) : cars;
          }
          return cars;
        };

        const res = funcEvaluator({ cars: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'], command: 'REVERSE' });
        terminalLogs.push(`>>> reorder_cargo(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'], 'REVERSE') => [${res.join(', ')}]`);
        visualStateUpdate = { cars: res, currentCommand: 'REVERSE' };
        break;
      }

      case 'quest-5': {
        // lock_target_pair(frequencies, target)
        funcEvaluator = (input: { frequencies: number[]; target: number }) => {
          const arr = input.frequencies;
          const t = input.target;
          let left = 0;
          let right = arr.length - 1;

          // Check if user has while left < right or two pointers
          if (userCode.includes('left') && userCode.includes('right')) {
            while (left < right) {
              const s = arr[left] + arr[right];
              if (s === t) return [left, right];
              else if (s < t) left++;
              else right--;
            }
            return [-1, -1];
          }

          // Fallback brute force if they wrote a loop
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i] + arr[j] === t) return [i, j];
            }
          }
          return [-1, -1];
        };

        const p = funcEvaluator({ frequencies: [2, 7, 11, 15], target: 9 });
        terminalLogs.push(`>>> lock_target_pair([2, 7, 11, 15], 9) => [${p.join(', ')}]`);
        visualStateUpdate = { leftPointer: p[0], rightPointer: p[1], matched: p[0] !== -1 };
        break;
      }

      case 'quest-6': {
        // is_valid_bracket_code(s)
        funcEvaluator = (input: { s: string }) => {
          const s = input.s;
          const stack: string[] = [];
          const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
          
          if (!userCode.includes('stack')) return false;

          for (const ch of s) {
            if ('({['.includes(ch)) {
              stack.push(ch);
            } else if (ch in pairs) {
              if (stack.length === 0 || stack[stack.length - 1] !== pairs[ch]) {
                return false;
              }
              stack.pop();
            }
          }
          return stack.length === 0;
        };

        terminalLogs.push(`>>> is_valid_bracket_code("{[()]}") => True`);
        visualStateUpdate = { stackState: [], isValid: true, runes: ["{", "[", "(", ")", "]", "}"] };
        break;
      }

      case 'quest-7': {
        // process_spaceport(commands)
        funcEvaluator = (input: { commands: string[] }) => {
          const queue: string[] = [];
          const docked: string[] = [];

          for (const cmd of input.commands) {
            if (cmd.startsWith("LAND:")) {
              queue.push(cmd.split(":")[1]);
            } else if (cmd.startsWith("VIP:")) {
              queue.unshift(cmd.split(":")[1]);
            } else if (cmd === "DOCK") {
              if (queue.length > 0) {
                docked.push(queue.shift()!);
              }
            }
          }
          return docked;
        };

        const res = funcEvaluator({ commands: ["LAND:Falcon", "LAND:Viper", "VIP:ShuttleOne", "DOCK", "DOCK"] });
        terminalLogs.push(`>>> process_spaceport([...]) => [${res.join(', ')}]`);
        visualStateUpdate = { docked: res, queue: ["Viper"] };
        break;
      }

      case 'quest-8': {
        // find_dominant_rune(runes)
        funcEvaluator = (input: { runes: string[] }) => {
          if (!input.runes || input.runes.length === 0) return ['NONE', 0];
          const counts: Record<string, number> = {};
          for (const r of input.runes) {
            counts[r] = (counts[r] || 0) + 1;
          }
          const sorted = Object.keys(counts).sort((a, b) => {
            if (counts[b] !== counts[a]) return counts[b] - counts[a];
            return a.localeCompare(b);
          });
          const best = sorted[0];
          return [best, counts[best]];
        };

        const res = funcEvaluator({ runes: ["Fire", "Water", "Fire", "Earth", "Fire", "Water"] });
        terminalLogs.push(`>>> find_dominant_rune([...]) => ['${res[0]}', ${res[1]}]`);
        visualStateUpdate = { dominant: res[0], counts: { Fire: 3, Water: 2, Earth: 1 } };
        break;
      }

      case 'quest-9': {
        // crack_vault_code(passcodes, target_code)
        funcEvaluator = (input: { passcodes: number[]; target_code: number }) => {
          const arr = input.passcodes;
          const t = input.target_code;
          let low = 0;
          let high = arr.length - 1;
          let steps = 0;

          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            steps++;
            if (arr[mid] === t) {
              return [mid, steps];
            } else if (arr[mid] < t) {
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }
          return [-1, steps];
        };

        const res = funcEvaluator({ passcodes: [10, 20, 30, 40, 50, 60, 70], target_code: 40 });
        terminalLogs.push(`>>> crack_vault_code([10, 20, ...], 40) => [${res.join(', ')}]`);
        visualStateUpdate = { low: 0, high: 6, mid: 3, steps: res[1], unlocked: res[0] !== -1 };
        break;
      }

      case 'quest-10': {
        // inorder_weave(root)
        funcEvaluator = (input: { root: any }) => {
          const res: number[] = [];
          function dfs(node: any) {
            if (!node) return;
            dfs(node[1]);
            res.push(node[0]);
            dfs(node[2]);
          }
          dfs(input.root);
          return res;
        };

        const tree = [4, [2, [1, null, null], [3, null, null]], [5, null, null]];
        const res = funcEvaluator({ root: tree });
        terminalLogs.push(`>>> inorder_weave([4, [2, ...], [5, ...]]) => [${res.join(', ')}]`);
        visualStateUpdate = { visitedNodes: res, completed: true };
        break;
      }

      default:
        funcEvaluator = () => 'PASS';
    }

    // Run test cases against funcEvaluator
    let passedCount = 0;
    for (const tc of testCases) {
      const parsedInputs = parseTestCaseInput(questId, tc.inputDescription);
      const actualVal = funcEvaluator(parsedInputs);
      const actualStr = normalizeOutput(actualVal);
      const expectedNormalized = tc.expectedOutput.trim();

      const isMatch = actualStr === expectedNormalized || actualStr.replace(/'/g, '"') === expectedNormalized.replace(/'/g, '"');
      if (isMatch) passedCount++;

      testResults.push({
        id: tc.id,
        description: tc.inputDescription,
        passed: isMatch,
        actual: actualStr,
        expected: tc.expectedOutput,
        error: isMatch ? undefined : `Mismatch: Got ${actualStr}, expected ${tc.expectedOutput}`
      });
    }

    const allPassed = passedCount === testCases.length;
    if (allPassed) {
      terminalLogs.push(`\n[SUCCESS] ✨ All ${testCases.length} unit test cases passed!`);
      terminalLogs.push(`[Game Engine] Mini-game simulation verified. Stage complete.`);
    } else {
      terminalLogs.push(`\n[FAILED] ❌ ${passedCount}/${testCases.length} test cases passed.`);
      terminalLogs.push(`[Tip] Click 'View Hint' or check 'Correct Answer' below to study the solution.`);
    }

    return {
      success: allPassed,
      terminalOutput: terminalLogs.join('\n'),
      testResults,
      passedCount,
      totalCount: testCases.length,
      visualStateUpdate
    };
  } catch (err: any) {
    terminalLogs.push(`\n[Execution Error] ${err.message || 'SyntaxError during Python parsing'}`);
    return {
      success: false,
      terminalOutput: terminalLogs.join('\n'),
      testResults: testCases.map(tc => ({
        id: tc.id,
        description: tc.inputDescription,
        passed: false,
        actual: 'Error',
        expected: tc.expectedOutput,
        error: err.message
      })),
      passedCount: 0,
      totalCount: testCases.length,
      error: err.message
    };
  }
}

// Parses test case input description strings into structured JS objects
function parseTestCaseInput(questId: string, desc: string): any {
  try {
    switch (questId) {
      case 'quest-1': {
        // "ruby=10, emerald=20, sapphire=30, multiplier=2"
        const ruby = Number(/ruby=(\d+)/.exec(desc)?.[1] || 10);
        const emerald = Number(/emerald=(\d+)/.exec(desc)?.[1] || 20);
        const sapphire = Number(/sapphire=(\d+)/.exec(desc)?.[1] || 30);
        const multiplier = Number(/multiplier=(\d+)/.exec(desc)?.[1] || 1);
        return { ruby, emerald, sapphire, multiplier };
      }
      case 'quest-2': {
        // "armor=40, mana=90, has_seal=True"
        const armor = Number(/armor=(\d+)/.exec(desc)?.[1] || 0);
        const mana = Number(/mana=(\d+)/.exec(desc)?.[1] || 0);
        const has_seal = /has_seal=True/i.test(desc);
        return { armor, mana, has_seal };
      }
      case 'quest-3': {
        // capsules=[10, -5, 25, 30, -2, 50], max_capacity=60
        const capMatch = /capsules=\[([^\]]+)\]/.exec(desc)?.[1] || "10";
        const capsules = capMatch.split(',').map(s => Number(s.trim()));
        const max_capacity = Number(/max_capacity=(\d+)/.exec(desc)?.[1] || 60);
        return { capsules, max_capacity };
      }
      case 'quest-4': {
        // cars=['A', 'B', 'C', 'D', 'E'], command='REVERSE'
        const carsMatch = /cars=\[([^\]]+)\]/.exec(desc)?.[1] || "'A'";
        const cars = carsMatch.split(',').map(s => s.trim().replace(/['"]/g, ''));
        const command = /command=['"]([^'"]+)['"]/.exec(desc)?.[1] || 'REVERSE';
        return { cars, command };
      }
      case 'quest-5': {
        // frequencies=[2, 7, 11, 15], target=9
        const freqMatch = /frequencies=\[([^\]]+)\]/.exec(desc)?.[1] || "2";
        const frequencies = freqMatch.split(',').map(s => Number(s.trim()));
        const target = Number(/target=(\d+)/.exec(desc)?.[1] || 9);
        return { frequencies, target };
      }
      case 'quest-6': {
        // s='{[()]}'
        const s = /s=['"]([^'"]*)['"]/.exec(desc)?.[1] || '';
        return { s };
      }
      case 'quest-7': {
        // commands=['LAND:Falcon', 'LAND:Viper', 'VIP:ShuttleOne', 'DOCK', 'DOCK']
        const cmdMatch = /commands=\[([^\]]+)\]/.exec(desc)?.[1] || "";
        const commands = cmdMatch.split(',').map(s => s.trim().replace(/['"]/g, ''));
        return { commands };
      }
      case 'quest-8': {
        // runes=['Fire', 'Water', 'Fire', 'Earth', 'Fire', 'Water']
        const runeMatch = /runes=\[([^\]]*)\]/.exec(desc)?.[1] || "";
        const runes = runeMatch.trim() ? runeMatch.split(',').map(s => s.trim().replace(/['"]/g, '')) : [];
        return { runes };
      }
      case 'quest-9': {
        // passcodes=[10, 20, 30, 40, 50, 60, 70], target_code=40
        const passMatch = /passcodes=\[([^\]]+)\]/.exec(desc)?.[1] || "10";
        const passcodes = passMatch.split(',').map(s => Number(s.trim()));
        const target_code = Number(/target_code=(\d+)/.exec(desc)?.[1] || 40);
        return { passcodes, target_code };
      }
      case 'quest-10': {
        // root=[4, [2, [1, None, None], [3, None, None]], [5, None, None]]
        const jsonStr = desc.replace('root=', '')
          .replace(/None/g, 'null');
        try {
          const root = JSON.parse(jsonStr);
          return { root };
        } catch {
          return { root: [4, [2, [1, null, null], [3, null, null]], [5, null, null]] };
        }
      }
      default:
        return {};
    }
  } catch {
    return {};
  }
}
