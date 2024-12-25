Task 1

Completed

Tests:

Test 1

result [2, 4, 6, 8, 10]

Test with debounce

debounceTest: ~2000ms

result ['Processed 1', 'Processed 2', 'Processed 3', 'Processed 4', 'Processed 5']


Task 2

Completed

Tests:

Test 1 full parallelism
result [ 2, 4, 6, 8, 10 ]

Test 2 limited parallelism
limitedParallelism: 2.003s
result [
  'Processed 1',
  'Processed 2',
  'Processed 3',
  'Processed 4',
  'Processed 5'
]

Test 3: Sequential execution
sequential: 1.016s
Result: [
  'Sequential 1',
  'Sequential 2',
  'Sequential 3',
  'Sequential 4',
  'Sequential 5'
]

Task 3 

Completed

Tests: 

Test 1 default execution
result [ 2, 4, 6, 8, 10 ]

Test 2 cancel during execution
error op cancelled

Test 3 cancel during debounce
result [ 2, 4, 6, 8, 10 ]

If debounceTime set to 1500 the result will be 'error op cancelled'


Task 4

Completed

Test:

stream processing
element 0
element 4
element 8
element 12
element 16
total processed elements 500


Task 5

Completed
