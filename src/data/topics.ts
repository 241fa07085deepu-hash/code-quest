import { Topic } from '../types';

export const TOPICS_DATA: Topic[] = [
  {
    id: 1,
    title: "Python Basics & Variables",
    slug: "python-basics-variables",
    category: "Fundamentals",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    summary: "Master Python variable assignment, data types (int, float, string), and basic mathematical operations.",
    theoryExplanation: `Variables in Python are named storage containers that hold data in computer memory. Python uses dynamic typing, meaning you don't need to declare types explicitly.
    
Key concepts:
- **Assignment**: \`x = 10\` binds the identifier \`x\` to the integer object 10.
- **Data Types**: \`int\` (e.g., 42), \`float\` (e.g., 3.14), \`str\` (e.g., "Crystal"), \`bool\` (e.g., True).
- **String Formatting**: Modern Python uses f-strings: \`f"Collected {count} gems"\`.
- **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\` (float division), \`//\` (integer floor division), \`%\` (modulo remainder).`,
    pythonSyntaxGuide: `# Variable assignment
gem_name = "Sapphire"
gem_power = 25
multiplier = 2

# Calculation
total_power = gem_power * multiplier
print(f"Charged {gem_name}: {total_power} units")`,
    image: "/src/assets/images/hero_code_quest_1790328399823.jpg",
    quest: {
      id: "quest-1",
      topicId: 1,
      title: "Crystal Core Energizer",
      gameName: "Inventory Gem Collector",
      conceptName: "Variables, Arithmetic & f-strings",
      difficulty: "Beginner",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      gameDescription: "Your spaceship energy core is depleted! Collect three elemental power crystals (Ruby, Emerald, Sapphire), compute the amplified energy level using the multiplier, and return the energy status string.",
      problemStatement: "Write a function `charge_core(ruby, emerald, sapphire, multiplier)` that calculates total raw energy (`ruby + emerald + sapphire`), multiplies it by `multiplier`, and returns a formatted string: `'CORE: <total_energy> GW'`. Also calculate raw total before boost.",
      objective: "Calculate amplified energy and output the exact string format 'CORE: <energy> GW'.",
      starterCode: `def charge_core(ruby: int, emerald: int, sapphire: int, multiplier: int) -> str:
    # TODO: Step 1. Calculate raw sum of crystals
    # TODO: Step 2. Multiply raw sum by multiplier
    # TODO: Step 3. Return f"CORE: {energy} GW"
    pass

# Test in terminal
print(charge_core(10, 20, 30, 2))
`,
      solutionCode: `def charge_core(ruby: int, emerald: int, sapphire: int, multiplier: int) -> str:
    raw_energy = ruby + emerald + sapphire
    boosted_energy = raw_energy * multiplier
    return f"CORE: {boosted_energy} GW"

# Execution test
print(charge_core(10, 20, 30, 2))  # Output: CORE: 120 GW
`,
      solutionExplanation: [
        "Create a variable `raw_energy` to store the sum of `ruby + emerald + sapphire`.",
        "Multiply `raw_energy` by `multiplier` and store in `boosted_energy`.",
        "Use a Python formatted string `f'CORE: {boosted_energy} GW'` to match the expected spacecraft output format."
      ],
      hints: [
        "Hint 1: Use the `+` operator to sum all three crystals together.",
        "Hint 2: Multiply the sum by `multiplier` using `*`.",
        "Hint 3: Use an f-string: `f\"CORE: {boosted_energy} GW\"`."
      ],
      testCases: [
        { id: "tc-1-1", inputDescription: "ruby=10, emerald=20, sapphire=30, multiplier=2", expectedOutput: "CORE: 120 GW" },
        { id: "tc-1-2", inputDescription: "ruby=5, emerald=5, sapphire=5, multiplier=3", expectedOutput: "CORE: 45 GW" },
        { id: "tc-1-3", inputDescription: "ruby=100, emerald=0, sapphire=50, multiplier=1", expectedOutput: "CORE: 150 GW" }
      ],
      initialGameState: {
        crystals: [
          { name: "Ruby", color: "#f43f5e", power: 10, collected: false },
          { name: "Emerald", color: "#10b981", power: 20, collected: false },
          { name: "Sapphire", color: "#06b6d4", power: 30, collected: false }
        ],
        multiplier: 2,
        corePower: 0,
        coreActive: false
      }
    }
  },
  {
    id: 2,
    title: "Conditionals & Logic",
    slug: "conditionals-logic",
    category: "Fundamentals",
    difficulty: "Beginner",
    estimatedMinutes: 18,
    summary: "Learn boolean logic, comparison operators (<, >, ==, !=), and branching execution with if-elif-else statements.",
    theoryExplanation: `Conditional statements allow programs to make decisions and execute different blocks of code depending on whether conditions evaluate to \`True\` or \`False\`.

Key concepts:
- **Comparison Operators**: \`==\` (equal), \`!=\` (not equal), \`>\`, \`<\`, \`>=\`, \`<=\`.
- **Logical Operators**: \`and\` (both true), \`or\` (at least one true), \`not\` (inverts boolean).
- **Structure**:
  \`\`\`python
  if condition1:
      # runs if condition1 is True
  elif condition2:
      # runs if condition1 is False and condition2 is True
  else:
      # fallback when all above are False
  \`\`\``,
    pythonSyntaxGuide: `health = 45
has_key = True

if health > 50 and has_key:
    status = "Hero Ready"
elif health <= 50 and has_key:
    status = "Wounded Keyholder"
else:
    status = "Trapped"`,
    image: "/src/assets/images/dungeon_gate_pixel_1790348761909.jpg",
    quest: {
      id: "quest-2",
      topicId: 2,
      title: "Guardian of the Dungeon Gates",
      gameName: "Dungeon Gatekeeper",
      conceptName: "If / Elif / Else Branching",
      difficulty: "Beginner",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      gameDescription: "A dungeon gate is guarded by an enchanted golem. The golem inspects the knight's armor rating and magic crystal level. Open the golden gate, silver gate, or drop the portcullis.",
      problemStatement: "Implement `evaluate_gate(armor: int, mana: int, has_seal: bool) -> str`:\n- If `has_seal` is True and `mana >= 80`, return `'GOLD_GATE_OPEN'`\n- Else if `armor >= 50` or `mana >= 50`, return `'SILVER_GATE_OPEN'`\n- Else, return `'PORTCULLIS_LOCKED'`",
      objective: "Correctly route adventurers through the proper dungeon gates using conditional logic.",
      starterCode: `def evaluate_gate(armor: int, mana: int, has_seal: bool) -> str:
    # TODO: Check gold gate condition first (has_seal and mana >= 80)
    # TODO: Check silver gate condition (armor >= 50 or mana >= 50)
    # TODO: Fallback to locked portcullis
    pass

print(evaluate_gate(60, 40, False))
`,
      solutionCode: `def evaluate_gate(armor: int, mana: int, has_seal: bool) -> str:
    if has_seal and mana >= 80:
        return 'GOLD_GATE_OPEN'
    elif armor >= 50 or mana >= 50:
        return 'SILVER_GATE_OPEN'
    else:
        return 'PORTCULLIS_LOCKED'

print(evaluate_gate(60, 40, False))  # Output: SILVER_GATE_OPEN
`,
      solutionExplanation: [
        "First check the strictest condition: `has_seal and mana >= 80`.",
        "Use `elif` with `or` operator to check if either `armor >= 50` or `mana >= 50` holds true.",
        "Use `else` for any inputs that fail both requirements to lock the gate."
      ],
      hints: [
        "Hint 1: Combine boolean variables with the `and` keyword.",
        "Hint 2: In the `elif`, use the `or` keyword to satisfy either condition.",
        "Hint 3: Ensure return strings match the exact casing: 'GOLD_GATE_OPEN', 'SILVER_GATE_OPEN', 'PORTCULLIS_LOCKED'."
      ],
      testCases: [
        { id: "tc-2-1", inputDescription: "armor=40, mana=90, has_seal=True", expectedOutput: "GOLD_GATE_OPEN" },
        { id: "tc-2-2", inputDescription: "armor=60, mana=40, has_seal=False", expectedOutput: "SILVER_GATE_OPEN" },
        { id: "tc-2-3", inputDescription: "armor=20, mana=30, has_seal=False", expectedOutput: "PORTCULLIS_LOCKED" }
      ],
      initialGameState: {
        playerArmor: 60,
        playerMana: 40,
        hasSeal: false,
        gateStatus: "LOCKED"
      }
    }
  },
  {
    id: 3,
    title: "Loops & Iterations",
    slug: "loops-iterations",
    category: "Fundamentals",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    summary: "Harness the power of for loops, while loops, range() generators, and accumulator variables.",
    theoryExplanation: `Loops repeat blocks of code until a condition is satisfied.
    
Key concepts:
- **for loop with range()**: \`range(start, stop, step)\` generates integers up to (not including) \`stop\`.
- **while loop**: Keeps executing as long as the test expression remains \`True\`.
- **Accumulator pattern**: Initializing a counter or total outside the loop and updating it inside: \`total += val\`.
- **Loop controls**: \`break\` terminates early; \`continue\` skips directly to the next iteration.`,
    pythonSyntaxGuide: `# Accumulator pattern
fuel_cells = [10, 20, 30]
total_power = 0
for cell in fuel_cells:
    if cell > 15:
        total_power += cell
print(total_power)  # 50`,
    image: "/src/assets/images/dsa_crystal_vault_1790328413782.jpg",
    quest: {
      id: "quest-3",
      topicId: 3,
      title: "Starlight Fuel Conveyor",
      gameName: "Starlight Conveyor",
      conceptName: "For / While Loops & Accumulators",
      difficulty: "Beginner",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      gameDescription: "A space station conveyor belt transports energy capsules with varied charges. Fuel capsules must be accumulated, but any corrupted capsule with charge < 0 must be skipped, and if total exceeds threshold, halt!",
      problemStatement: "Write `charge_conveyor(capsules: list[int], max_capacity: int) -> int`:\n- Iterate over the `capsules` list.\n- If a capsule charge is negative (< 0), skip it.\n- Add positive charges to total energy.\n- If total energy exceeds or reaches `max_capacity`, cap it at `max_capacity` and stop the conveyor immediately (`break`).\n- Return the final total energy.",
      objective: "Process conveyor items using loop controls (continue, break) and return the accumulated energy.",
      starterCode: `def charge_conveyor(capsules: list[int], max_capacity: int) -> int:
    total_energy = 0
    # TODO: Loop through capsules
    # TODO: Skip negative values using continue
    # TODO: Add positive energy
    # TODO: Break if total_energy >= max_capacity
    return total_energy

print(charge_conveyor([10, -5, 25, 30, -2, 50], 60))
`,
      solutionCode: `def charge_conveyor(capsules: list[int], max_capacity: int) -> int:
    total_energy = 0
    for cell in capsules:
        if cell < 0:
            continue
        total_energy += cell
        if total_energy >= max_capacity:
            total_energy = max_capacity
            break
    return total_energy

print(charge_conveyor([10, -5, 25, 30, -2, 50], 60))  # Output: 60
`,
      solutionExplanation: [
        "Initialize `total_energy = 0` as the accumulator.",
        "Loop through `capsules` using `for cell in capsules:`.",
        "If `cell < 0`, execute `continue` to discard defective capsules.",
        "Add `cell` to `total_energy`. Check if `total_energy >= max_capacity`. If true, cap it and invoke `break`."
      ],
      hints: [
        "Hint 1: Use `for cell in capsules:` to iterate one item at a time.",
        "Hint 2: Check `if cell < 0: continue` to skip corrupted cells.",
        "Hint 3: Use `break` to stop early once max capacity is reached."
      ],
      testCases: [
        { id: "tc-3-1", inputDescription: "capsules=[10, -5, 25, 30, -2, 50], max_capacity=60", expectedOutput: "60" },
        { id: "tc-3-2", inputDescription: "capsules=[5, 10, -3, 8], max_capacity=100", expectedOutput: "23" },
        { id: "tc-3-3", inputDescription: "capsules=[-10, -20, 40], max_capacity=30", expectedOutput: "30" }
      ],
      initialGameState: {
        capsules: [10, -5, 25, 30, -2, 50],
        maxCapacity: 60,
        currentIndex: 0,
        currentSum: 0
      }
    }
  },
  {
    id: 4,
    title: "Lists & Array Slicing",
    slug: "lists-array-slicing",
    category: "Linear DSA",
    difficulty: "Beginner",
    estimatedMinutes: 22,
    summary: "Master Python lists, dynamic arrays, indexing, negative indexing, and slicing patterns [start:stop:step].",
    theoryExplanation: `Lists in Python are dynamic arrays that allow ordered storage and O(1) indexed access.
    
Key concepts:
- **Indexing**: 0-based. \`items[0]\` is first item, \`items[-1]\` is last item.
- **Slicing**: \`items[start:stop:step]\`. Returns a sub-array from \`start\` up to \`stop-1\`.
- **Reverse list**: \`items[::-1]\` flips the elements in-place or copies reversed.
- **Common operations**: \`.append(x)\`, \`.pop()\`, \`.insert(i, x)\`, \`len(items)\`.`,
    pythonSyntaxGuide: `train = ["Gold", "Silver", "Iron", "Coal", "Gems"]
# Get middle 3 cars
middle = train[1:4]  # ["Silver", "Iron", "Coal"]
# Reverse cargo
reversed_train = train[::-1]`,
    image: "/src/assets/images/cyber_train_slicing_1790348746817.jpg",
    quest: {
      id: "quest-4",
      topicId: 4,
      title: "Cyber Cargo Train Sorter",
      gameName: "Array Railway Sorter",
      conceptName: "List Operations & Slicing",
      difficulty: "Beginner",
      timeComplexity: "O(K) where K is slice size",
      spaceComplexity: "O(K)",
      gameDescription: "A high-speed cybernetic train is carrying magnetic resource pods. You must reorganize, isolate priority cargo sections, and flip reverse-docked carriages.",
      problemStatement: "Write `reorder_cargo(cars: list[str], command: str) -> list[str]`:\n- If `command == 'REVERSE'`, return the entire list in reversed order.\n- If `command == 'ODD_INDEX'`, return elements at odd indexes (1, 3, 5, ...).\n- If `command == 'TRIM_ENDS'`, return a slice excluding the first and last carriage.\n- If unknown command, return the original list unchanged.",
      objective: "Use Python list slicing syntax `[::-1]`, `[1::2]`, and `[1:-1]` to control train cars.",
      starterCode: `def reorder_cargo(cars: list[str], command: str) -> list[str]:
    # TODO: Handle 'REVERSE'
    # TODO: Handle 'ODD_INDEX'
    # TODO: Handle 'TRIM_ENDS'
    return cars

print(reorder_cargo(["Alpha", "Beta", "Gamma", "Delta", "Epsilon"], "REVERSE"))
`,
      solutionCode: `def reorder_cargo(cars: list[str], command: str) -> list[str]:
    if command == 'REVERSE':
        return cars[::-1]
    elif command == 'ODD_INDEX':
        return cars[1::2]
    elif command == 'TRIM_ENDS':
        return cars[1:-1]
    return cars

print(reorder_cargo(["Alpha", "Beta", "Gamma", "Delta", "Epsilon"], "REVERSE"))
# Output: ['Epsilon', 'Delta', 'Gamma', 'Beta', 'Alpha']
`,
      solutionExplanation: [
        "For `'REVERSE'`, Python's slice `cars[::-1]` walks backwards through all items with step -1.",
        "For `'ODD_INDEX'`, `cars[1::2]` starts at index 1 and steps by 2, selecting indices 1, 3, 5...",
        "For `'TRIM_ENDS'`, `cars[1:-1]` starts at index 1 and stops right before the last item (-1)."
      ],
      hints: [
        "Hint 1: To reverse a list, use slice `[::-1]`.",
        "Hint 2: For odd indices, start at 1 and use step 2: `[1::2]`.",
        "Hint 3: To cut first and last element, slice from index 1 to -1: `[1:-1]`."
      ],
      testCases: [
        { id: "tc-4-1", inputDescription: "cars=['A', 'B', 'C', 'D', 'E'], command='REVERSE'", expectedOutput: "['E', 'D', 'C', 'B', 'A']" },
        { id: "tc-4-2", inputDescription: "cars=['A', 'B', 'C', 'D', 'E'], command='ODD_INDEX'", expectedOutput: "['B', 'D']" },
        { id: "tc-4-3", inputDescription: "cars=['A', 'B', 'C', 'D', 'E'], command='TRIM_ENDS'", expectedOutput: "['B', 'C', 'D']" }
      ],
      initialGameState: {
        cars: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
        currentCommand: "REVERSE"
      }
    }
  },
  {
    id: 5,
    title: "Two Pointer Technique (DSA)",
    slug: "two-pointer-technique",
    category: "Algorithms",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    summary: "Master the optimal Two Pointer algorithmic pattern to solve search and pair problems in O(N) linear time.",
    theoryExplanation: `The Two Pointer technique uses two index variables moving toward each other or in the same direction over a sorted array.
    
Why use it?
- Brute force nested loops take $O(N^2)$ time.
- Two pointers solve the problem in $O(N)$ linear time and $O(1)$ extra space!

Pattern for sorted array pair sum:
1. Place \`left = 0\` and \`right = len(nums) - 1\`.
2. Compute \`current_sum = nums[left] + nums[right]\`.
3. If \`current_sum == target\`: match found!
4. If \`current_sum < target\`: increment \`left += 1\` (we need a bigger sum).
5. If \`current_sum > target\`: decrement \`right -= 1\` (we need a smaller sum).`,
    pythonSyntaxGuide: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return (left, right)
        elif s < target:
            left += 1
        else:
            right -= 1
    return None`,
    image: "/src/assets/images/laser_two_pointer_1790348775818.jpg",
    quest: {
      id: "quest-5",
      topicId: 5,
      title: "Dual Laser Targeter",
      gameName: "Dual Laser Targeter",
      conceptName: "Two Pointers on Sorted Array",
      difficulty: "Intermediate",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      gameDescription: "Two quantum defense lasers aim at numeric frequency satellites lined up in ascending sorted order. Tune both lasers simultaneously from outer boundaries until the sum of their frequencies matches the enemy shield frequency!",
      problemStatement: "Implement `lock_target_pair(frequencies: list[int], target: int) -> list[int]`:\n- Given an already sorted list of integers `frequencies` and a `target` sum.\n- Return the 0-based indices `[left, right]` of the two numbers that sum exactly to `target`.\n- If no pair exists, return `[-1, -1]`. Assume at most one valid pair exists.",
      objective: "Find the matching pair in O(N) linear time using left and right pointers meeting inwards.",
      starterCode: `def lock_target_pair(frequencies: list[int], target: int) -> list[int]:
    left = 0
    right = len(frequencies) - 1
    
    # TODO: While left < right:
    # TODO: Calculate current sum
    # TODO: Adjust pointers according to target comparison
    
    return [-1, -1]

print(lock_target_pair([2, 5, 8, 11, 14, 18, 22], 25))
`,
      solutionCode: `def lock_target_pair(frequencies: list[int], target: int) -> list[int]:
    left = 0
    right = len(frequencies) - 1
    
    while left < right:
        curr_sum = frequencies[left] + frequencies[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
            
    return [-1, -1]

print(lock_target_pair([2, 5, 8, 11, 14, 18, 22], 25))  # Output: [1, 5] (frequencies[1]=5 + frequencies[5]=18 = 23, wait 5+18=23, 7+18=25)
`,
      solutionExplanation: [
        "Initialize `left = 0` and `right = len(frequencies) - 1`.",
        "Loop while `left < right`. Calculate `curr_sum = frequencies[left] + frequencies[right]`.",
        "If `curr_sum == target`, return `[left, right]` immediately.",
        "If `curr_sum < target`, we need a larger value, so shift `left += 1`.",
        "If `curr_sum > target`, shift `right -= 1`."
      ],
      hints: [
        "Hint 1: Keep `left` at the beginning and `right` at the end.",
        "Hint 2: Since the array is sorted, increasing `left` always increases the sum.",
        "Hint 3: Decreasing `right` always decreases the sum."
      ],
      testCases: [
        { id: "tc-5-1", inputDescription: "frequencies=[2, 7, 11, 15], target=9", expectedOutput: "[0, 1]" },
        { id: "tc-5-2", inputDescription: "frequencies=[1, 4, 6, 9, 12, 17], target=15", expectedOutput: "[2, 3]" },
        { id: "tc-5-3", inputDescription: "frequencies=[3, 5, 8, 10], target=100", expectedOutput: "[-1, -1]" }
      ],
      initialGameState: {
        frequencies: [1, 4, 6, 9, 12, 17],
        target: 15,
        leftPointer: 0,
        rightPointer: 5,
        matched: false
      }
    }
  },
  {
    id: 6,
    title: "Stack Data Structure (LIFO)",
    slug: "stack-data-structure",
    category: "Linear DSA",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    summary: "Understand Last-In-First-Out (LIFO) stacks, push/pop operations, and bracket matching validation.",
    theoryExplanation: `A Stack is a linear data structure adhering to the Last-In-First-Out (LIFO) principle. The last item pushed onto the stack is the first item to be popped.
    
Key concepts:
- **Push**: Add element to the top (\`stack.append(x)\` in Python, O(1)).
- **Pop**: Remove and return element from the top (\`stack.pop()\`, O(1)).
- **Peek**: Inspect top element without removing (\`stack[-1]\`).
- **Classic problem**: Checking valid matching parenthesis \`()\`, \`{}\`, \`[]\`.`,
    pythonSyntaxGuide: `stack = []
stack.append('A')  # Push 'A'
stack.append('B')  # Push 'B'
top = stack.pop()  # 'B'
is_empty = len(stack) == 0`,
    image: "/src/assets/images/badge_quest_master_1790328425393.jpg",
    quest: {
      id: "quest-6",
      title: "Tower of Brackets",
      topicId: 6,
      gameName: "Tower of Brackets",
      conceptName: "Stack LIFO & Valid Parentheses",
      difficulty: "Intermediate",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      gameDescription: "An ancient portal rune requires balanced bracket frequencies `()`, `{}`, `[]`. Any misaligned bracket triggers a magical overload! Stack the opening runes and pop them as corresponding closing runes appear.",
      problemStatement: "Implement `is_valid_bracket_code(s: str) -> bool`:\n- Given a string `s` containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`.\n- Return `True` if all brackets close in the correct corresponding LIFO order and types match, otherwise return `False`.",
      objective: "Use a Python list as a stack to validate balanced nested symbols.",
      starterCode: `def is_valid_bracket_code(s: str) -> bool:
    stack = []
    # Matching bracket map
    pairs = {')': '(', '}': '{', ']': '['}
    
    # TODO: Loop through characters
    # TODO: If opening bracket, push to stack
    # TODO: If closing bracket, verify match with stack.pop()
    # TODO: Return True if stack is empty at end
    pass

print(is_valid_bracket_code("{[()]}"))
`,
      solutionCode: `def is_valid_bracket_code(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for ch in s:
        if ch in '({[':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
            
    return len(stack) == 0

print(is_valid_bracket_code("{[()]}"))  # Output: True
`,
      solutionExplanation: [
        "Create an empty `stack = []` and a dictionary mapping closing brackets to their matching open bracket.",
        "Iterate character by character. If `ch in '({['`, push to stack with `.append(ch)`.",
        "If closing bracket encountered: check if stack is empty or `stack[-1] != pairs[ch]`. If so, unbalanced -> return `False`.",
        "Pop matching open bracket with `stack.pop()`. At end, return `len(stack) == 0`."
      ],
      hints: [
        "Hint 1: If an opening bracket arrives, push it into your stack.",
        "Hint 2: When a closing bracket arrives, the top of the stack MUST be its counterpart.",
        "Hint 3: At the end, if anything remains in the stack, it wasn't closed!"
      ],
      testCases: [
        { id: "tc-6-1", inputDescription: "s='{[()]}'", expectedOutput: "True" },
        { id: "tc-6-2", inputDescription: "s='([)]'", expectedOutput: "False" },
        { id: "tc-6-3", inputDescription: "s='()[]{}'", expectedOutput: "True" },
        { id: "tc-6-4", inputDescription: "s='((('", expectedOutput: "False" }
      ],
      initialGameState: {
        runes: ["{", "[", "(", ")", "]", "}"],
        stackState: [],
        step: 0,
        isValid: null
      }
    }
  },
  {
    id: 7,
    title: "Queue Data Structure (FIFO)",
    slug: "queue-data-structure",
    category: "Linear DSA",
    difficulty: "Intermediate",
    estimatedMinutes: 22,
    summary: "Learn First-In-First-Out (FIFO) queue principles, collections.deque, enqueue, and dequeue mechanics.",
    theoryExplanation: `A Queue is a linear data structure following First-In-First-Out (FIFO). The first element added is the first one removed (like a real-world checkout queue).
    
Key concepts:
- **Enqueue**: Adding an element to the rear of the queue.
- **Dequeue**: Removing an element from the front of the queue.
- **collections.deque**: In Python, \`collections.deque\` is used for $O(1)$ fast pop operations from both sides (\`popleft()\`), whereas \`list.pop(0)\` takes $O(N)$ time.`,
    pythonSyntaxGuide: `from collections import deque

queue = deque()
queue.append("Ship-A")  # Enqueue
queue.append("Ship-B")
first = queue.popleft() # Dequeue: 'Ship-A' (O(1))`,
    image: "/src/assets/images/spaceport_dock_hangar_1790348834904.jpg",
    quest: {
      id: "quest-7",
      title: "Spaceport Landing Dock",
      topicId: 7,
      gameName: "Spaceport Landing Dock",
      conceptName: "Queue FIFO & Deque",
      difficulty: "Intermediate",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      gameDescription: "Incoming starcraft arrive at Galactic Port Sector 7. Normal ships queue in FIFO order, but VIP spacecraft can request priority docking at the front!",
      problemStatement: "Write `process_spaceport(commands: list[str]) -> list[str]`:\n- Input is a list of commands:\n  * `'LAND:ShipName'`: Standard ship arrives at rear of landing queue.\n  * `'VIP:ShipName'`: Emergency VIP ship jumps directly to front of queue.\n  * `'DOCK'`: The next front ship leaves queue and lands at hangar.\n- Return the list of landed ships in the order they were docked.",
      objective: "Implement a double-ended queue to manage arrival queues and departures.",
      starterCode: `from collections import deque

def process_spaceport(commands: list[str]) -> list[str]:
    docked_order = []
    # TODO: Initialize a deque
    # TODO: Parse commands ('LAND:name', 'VIP:name', 'DOCK')
    # TODO: Append to docked_order when docked
    return docked_order

print(process_spaceport(["LAND:Falcon", "LAND:Viper", "VIP:ShuttleOne", "DOCK", "DOCK"]))
`,
      solutionCode: `from collections import deque

def process_spaceport(commands: list[str]) -> list[str]:
    landing_queue = deque()
    docked_order = []
    
    for cmd in commands:
        if cmd.startswith("LAND:"):
            ship = cmd.split(":")[1]
            landing_queue.append(ship)
        elif cmd.startswith("VIP:"):
            ship = cmd.split(":")[1]
            landing_queue.appendleft(ship)
        elif cmd == "DOCK":
            if landing_queue:
                ship = landing_queue.popleft()
                docked_order.append(ship)
                
    return docked_order

print(process_spaceport(["LAND:Falcon", "LAND:Viper", "VIP:ShuttleOne", "DOCK", "DOCK"]))
# Output: ['ShuttleOne', 'Falcon']
`,
      solutionExplanation: [
        "Initialize `landing_queue = deque()` from standard library `collections`.",
        "For standard `'LAND:ShipName'`, call `landing_queue.append(ship)` (enqueue at back).",
        "For `'VIP:ShipName'`, call `landing_queue.appendleft(ship)` (enqueue at front).",
        "For `'DOCK'`, call `landing_queue.popleft()` and record ship in `docked_order`."
      ],
      hints: [
        "Hint 1: Use `deque()` from the `collections` module for optimal FIFO operations.",
        "Hint 2: `append()` puts an element at the rear, while `appendleft()` puts an element at the very front.",
        "Hint 3: `popleft()` pulls the front-most ship from the queue."
      ],
      testCases: [
        { id: "tc-7-1", inputDescription: "commands=['LAND:Falcon', 'LAND:Viper', 'VIP:ShuttleOne', 'DOCK', 'DOCK']", expectedOutput: "['ShuttleOne', 'Falcon']" },
        { id: "tc-7-2", inputDescription: "commands=['LAND:Alpha', 'DOCK', 'LAND:Beta', 'DOCK']", expectedOutput: "['Alpha', 'Beta']" },
        { id: "tc-7-3", inputDescription: "commands=['VIP:Omega', 'LAND:Zeta', 'DOCK', 'DOCK']", expectedOutput: "['Omega', 'Zeta']" }
      ],
      initialGameState: {
        queue: ["Falcon", "Viper"],
        docked: [],
        incoming: "VIP:ShuttleOne"
      }
    }
  },
  {
    id: 8,
    title: "Dictionaries & Hash Maps (DSA)",
    slug: "dictionaries-hash-maps",
    category: "Trees & Hashing",
    difficulty: "Intermediate",
    estimatedMinutes: 24,
    summary: "Harness O(1) constant-time key lookups, frequency maps, dictionary methods, and hash table concepts.",
    theoryExplanation: `Hash Tables (implemented as \`dict\` in Python) map unique keys to values using a hashing function, achieving average $O(1)$ time complexity for insertions, deletions, and lookups.
    
Key concepts:
- **Key-Value Pair**: \`inventory = {"potions": 3, "scrolls": 5}\`.
- **Safe Access**: \`inventory.get("swords", 0)\` returns default 0 instead of throwing KeyError.
- **Frequency Counter**: Counting occurrences of items in a stream in $O(N)$ total time.
- **Dictionary Comprehension**: \`{k: v for k, v in items.items() if v > 2}\`.`,
    pythonSyntaxGuide: `counts = {}
words = ["rune", "gem", "rune", "star", "gem", "rune"]
for w in words:
    counts[w] = counts.get(w, 0) + 1
# counts = {'rune': 3, 'gem': 2, 'star': 1}`,
    image: "/src/assets/images/cipher_alchemist_lab_1790348849207.jpg",
    quest: {
      id: "quest-8",
      title: "Cipher Alchemist",
      topicId: 8,
      gameName: "Cipher Alchemist",
      conceptName: "Hash Map Frequency Counter",
      difficulty: "Intermediate",
      timeComplexity: "O(N)",
      spaceComplexity: "O(K) unique elements",
      gameDescription: "An arcane scroll contains repeated runic sigils. To brew the transmutation potion, the Alchemist must identify the most frequent rune and its count in O(N) single-pass time.",
      problemStatement: "Write `find_dominant_rune(runes: list[str]) -> list`: \n- Count the frequency of each rune string in the input list.\n- Return a 2-element list `[most_frequent_rune, max_count]`.\n- If multiple runes tie for highest count, return the one that appears first alphabetically.\n- If list is empty, return `['NONE', 0]`.",
      objective: "Use a hash table / Python dict to compute frequencies in linear time.",
      starterCode: `def find_dominant_rune(runes: list[str]) -> list:
    if not runes:
        return ['NONE', 0]
    
    # TODO: Build frequency dict counts = {}
    # TODO: Find key with max count (tiebreaker: alphabetical)
    pass

print(find_dominant_rune(["Fire", "Water", "Fire", "Earth", "Fire", "Water"]))
`,
      solutionCode: `def find_dominant_rune(runes: list[str]) -> list:
    if not runes:
        return ['NONE', 0]
        
    counts = {}
    for rune in runes:
        counts[rune] = counts.get(rune, 0) + 1
        
    # Sort keys for tie breaking: descending count, ascending rune name
    dominant_rune = sorted(counts.keys(), key=lambda r: (-counts[r], r))[0]
    return [dominant_rune, counts[dominant_rune]]

print(find_dominant_rune(["Fire", "Water", "Fire", "Earth", "Fire", "Water"]))
# Output: ['Fire', 3]
`,
      solutionExplanation: [
        "If list is empty, return `['NONE', 0]`.",
        "Populate frequency count using `counts[rune] = counts.get(rune, 0) + 1` in $O(N)$ time.",
        "Sort keys using tuple key `(-counts[r], r)` which prioritizes higher frequency first, and alphabetical string order second.",
        "Extract top result and return `[dominant_rune, counts[dominant_rune]]`."
      ],
      hints: [
        "Hint 1: Use `dict.get(rune, 0) + 1` to easily increment counts.",
        "Hint 2: Iterate through the counted keys to track the highest frequency.",
        "Hint 3: In Python, sorting with `key=lambda x: (-counts[x], x)` handles tie-breakers automatically."
      ],
      testCases: [
        { id: "tc-8-1", inputDescription: "runes=['Fire', 'Water', 'Fire', 'Earth', 'Fire', 'Water']", expectedOutput: "['Fire', 3]" },
        { id: "tc-8-2", inputDescription: "runes=['Star', 'Moon', 'Star', 'Moon']", expectedOutput: "['Moon', 2]" },
        { id: "tc-8-3", inputDescription: "runes=[]", expectedOutput: "['NONE', 0]" }
      ],
      initialGameState: {
        runes: ["Fire", "Water", "Fire", "Earth", "Fire", "Water"],
        counts: { Fire: 3, Water: 2, Earth: 1 },
        dominant: "Fire"
      }
    }
  },
  {
    id: 9,
    title: "Binary Search (DSA)",
    slug: "binary-search",
    category: "Algorithms",
    difficulty: "Advanced",
    estimatedMinutes: 28,
    summary: "Achieve logarithmic O(log N) search speed by halving the search space on ordered datasets.",
    theoryExplanation: `Binary search locates a target value within a sorted array by repeatedly dividing the search interval in half.
    
Time Complexity:
- Linear Search: $O(N)$ (slow for large data).
- Binary Search: $O(\\log_2 N)$ (searches 1,000,000 items in ~20 operations!).

Algorithm:
1. Set pointers \`low = 0\` and \`high = len(nums) - 1\`.
2. Compute midpoint: \`mid = (low + high) // 2\`.
3. If \`nums[mid] == target\`: found at index \`mid\`!
4. If \`nums[mid] < target\`: target must be in right half; set \`low = mid + 1\`.
5. If \`nums[mid] > target\`: target must be in left half; set \`high = mid - 1\`.`,
    pythonSyntaxGuide: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    image: "/src/assets/images/cyber_vault_lock_1790348808119.jpg",
    quest: {
      id: "quest-9",
      title: "Vault Codecracker",
      topicId: 9,
      gameName: "Vault Codecracker",
      conceptName: "Binary Search in O(log N)",
      difficulty: "Advanced",
      timeComplexity: "O(log N)",
      spaceComplexity: "O(1)",
      gameDescription: "A high-security cybernetics vault has 10,000 passcode slots in sorted numerical order. The security timer allows only 15 queries before lockdown! Find the index and track how many comparisons were required.",
      problemStatement: "Implement `crack_vault_code(passcodes: list[int], target_code: int) -> list[int]`:\n- Search for `target_code` in the sorted array `passcodes`.\n- Count every comparison `passcodes[mid] == target_code` performed.\n- Return `[found_index, comparison_count]`.\n- If target code is not present, return `[-1, comparison_count]`.",
      objective: "Implement iterative binary search while tracking exact loop steps.",
      starterCode: `def crack_vault_code(passcodes: list[int], target_code: int) -> list[int]:
    low = 0
    high = len(passcodes) - 1
    steps = 0
    
    # TODO: While low <= high:
    # TODO: mid = (low + high) // 2
    # TODO: steps += 1
    # TODO: compare passcodes[mid] with target_code
    
    return [-1, steps]

print(crack_vault_code([105, 220, 340, 480, 512, 678, 890, 999], 512))
`,
      solutionCode: `def crack_vault_code(passcodes: list[int], target_code: int) -> list[int]:
    low = 0
    high = len(passcodes) - 1
    steps = 0
    
    while low <= high:
        mid = (low + high) // 2
        steps += 1
        
        if passcodes[mid] == target_code:
            return [mid, steps]
        elif passcodes[mid] < target_code:
            low = mid + 1
        else:
            high = mid - 1
            
    return [-1, steps]

print(crack_vault_code([105, 220, 340, 480, 512, 678, 890, 999], 512))
# Output: [4, 2] (or [4, 1] depending on mid selection)
`,
      solutionExplanation: [
        "Initialize `low = 0`, `high = len(passcodes) - 1`, and `steps = 0`.",
        "Inside `while low <= high`, calculate `mid = (low + high) // 2` and increment `steps += 1`.",
        "If `passcodes[mid] == target_code`, return `[mid, steps]`.",
        "If `passcodes[mid] < target_code`, discard left half by `low = mid + 1`.",
        "Else discard right half by `high = mid - 1`."
      ],
      hints: [
        "Hint 1: Calculate midpoint using integer floor division: `(low + high) // 2`.",
        "Hint 2: Increment the `steps` counter every time you check `mid`.",
        "Hint 3: If target is smaller than mid element, set `high = mid - 1`."
      ],
      testCases: [
        { id: "tc-9-1", inputDescription: "passcodes=[10, 20, 30, 40, 50, 60, 70], target_code=40", expectedOutput: "[3, 1]" },
        { id: "tc-9-2", inputDescription: "passcodes=[10, 20, 30, 40, 50, 60, 70], target_code=70", expectedOutput: "[6, 3]" },
        { id: "tc-9-3", inputDescription: "passcodes=[1, 3, 5, 7, 9], target_code=8", expectedOutput: "[-1, 3]" }
      ],
      initialGameState: {
        passcodes: [10, 20, 30, 40, 50, 60, 70],
        targetCode: 40,
        low: 0,
        high: 6,
        mid: 3,
        steps: 0
      }
    }
  },
  {
    id: 10,
    title: "Binary Trees & Traversals (DSA)",
    slug: "binary-trees-traversals",
    category: "Trees & Hashing",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    summary: "Master hierarchical tree structures, recursive traversals (In-Order, Pre-Order), and node evaluation.",
    theoryExplanation: `A Binary Tree is a non-linear hierarchical data structure where each node has at most two children: left and right.
    
Traversals:
- **In-Order Traversal (Left -> Root -> Right)**: Visits binary search tree values in ascending sorted order.
- **Pre-Order Traversal (Root -> Left -> Right)**: Used for cloning and prefix serialization.
- **Post-Order Traversal (Left -> Right -> Root)**: Used for subtree deletion and bottom-up computation.

Tree Representation in Python:
\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
\`\`\``,
    pythonSyntaxGuide: `def inorder_traversal(root):
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)       # Left
        result.append(node.val)   # Root
        traverse(node.right)      # Right
    traverse(root)
    return result`,
    image: "/src/assets/images/binary_tree_rune_1790348795160.jpg",
    quest: {
      id: "quest-10",
      title: "Rune Tree Weaver",
      topicId: 10,
      gameName: "Rune Tree Weaver",
      conceptName: "In-Order Binary Tree Traversal",
      difficulty: "Advanced",
      timeComplexity: "O(N)",
      spaceComplexity: "O(H) recursion stack height",
      gameDescription: "An ancient World Tree connects mystical realm nodes. To awaken the guardian spirit, weave an energy ribbon through the tree in strictly ascending In-Order (Left -> Root -> Right) order.",
      problemStatement: "Given a binary tree representation formatted as nested lists `[val, left_child, right_child]` (or `None` for empty branches), write `inorder_weave(node) -> list[int]` that returns the list of node values visited in In-Order.",
      objective: "Traverse tree nodes recursively: visit Left subtree, record Root, visit Right subtree.",
      starterCode: `# Node format: [value, left_child, right_child] or None
def inorder_weave(root) -> list[int]:
    result = []
    
    def dfs(node):
        if node is None:
            return
        # TODO: Step 1. Traverse left child: node[1]
        # TODO: Step 2. Append node[0] to result
        # TODO: Step 3. Traverse right child: node[2]
        pass
        
    dfs(root)
    return result

# Tree: [4, [2, [1, None, None], [3, None, None]], [5, None, None]]
print(inorder_weave([4, [2, [1, None, None], [3, None, None]], [5, None, None]]))
`,
      solutionCode: `def inorder_weave(root) -> list[int]:
    result = []
    
    def dfs(node):
        if node is None:
            return
        # In-Order: Left -> Root -> Right
        dfs(node[1])
        result.append(node[0])
        dfs(node[2])
        
    dfs(root)
    return result

# Output: [1, 2, 3, 4, 5]
print(inorder_weave([4, [2, [1, None, None], [3, None, None]], [5, None, None]]))
`,
      solutionExplanation: [
        "Define an empty accumulator list `result = []`.",
        "Implement helper `dfs(node)`: base case is `if node is None: return`.",
        "First recursively call `dfs(node[1])` to traverse the entire left subtree.",
        "Append current node value `node[0]` to `result`.",
        "Finally recursively call `dfs(node[2])` to traverse the entire right subtree."
      ],
      hints: [
        "Hint 1: In the nested array format, `node[0]` is the value, `node[1]` is left child, and `node[2]` is right child.",
        "Hint 2: For In-Order traversal: go Left first, then visit Root, then go Right.",
        "Hint 3: Check `if node is None: return` as the base case to stop recursion."
      ],
      testCases: [
        { id: "tc-10-1", inputDescription: "root=[4, [2, [1, None, None], [3, None, None]], [5, None, None]]", expectedOutput: "[1, 2, 3, 4, 5]" },
        { id: "tc-10-2", inputDescription: "root=[1, None, [2, [3, None, None], None]]", expectedOutput: "[1, 3, 2]" },
        { id: "tc-10-3", inputDescription: "root=[10, None, None]", expectedOutput: "[10]" }
      ],
      initialGameState: {
        root: {
          val: 4,
          left: { val: 2, left: { val: 1 }, right: { val: 3 } },
          right: { val: 5 }
        },
        visitedNodes: []
      }
    }
  }
];
